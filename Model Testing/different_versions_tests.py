import random
from pathlib import Path

import onnx
import onnxruntime as ort
import torch
import tensorflow as tf
from functional import seq
from transformers import BertForMaskedLM, BertTokenizer, TFMobileBertForMaskedLM, TFBertForMaskedLM
from transformers.convert_graph_to_onnx import convert

import skinned_bert


def random_selection(mask, text, options):
    # random stat as a comparison
    chosen: str = options[random.randint(0, len(options))]
    return text.replace(mask, chosen)


def tf_no_restrictions_test(model_name, mask, text, top_k):
    # this is the final version I decided to use
    model = TFBertForMaskedLM.from_pretrained(model_name)
    tokenizer = BertTokenizer.from_pretrained(model_name)
    input_ids, target_idx = skinned_bert.tokenize_sentence(mask, tokenizer,
                                                           text)
    tensor: tf.Tensor = tf.convert_to_tensor([input_ids])
    results = model(tensor)["logits"][0][target_idx].numpy()
    probabilities = skinned_bert.softmax_numpy(results)
    words_probs = (seq(probabilities)
                   .enumerate(start=0)
                   .sorted(key=lambda pair: pair[1], reverse=True)
                   .map(lambda pair: [tokenizer.decode([pair[0]]), pair[1]])
                   .filter(lambda pair: pair[0].isalpha and len(pair[0]) > 2 and pair[1] > 0.0002)
                   )
    # only took the top 4 to compare to the other method, on site I select a random result by weighted probability
    return words_probs.take(top_k).list()


def skinned_bert_test(model_name, mask, text, options):
    # this is taken from FITBert
    model = BertForMaskedLM.from_pretrained(model_name)
    tokenizer = BertTokenizer.from_pretrained(model_name)
    tensors, words_ids, target_idx = skinned_bert.torch_input(mask, tokenizer, text, options)
    with torch.no_grad():
        predictions = model(tensors)[0]
    ranked_options, ranked_probs = skinned_bert.torch_output(predictions, words_ids, target_idx, options)
    return ranked_probs


def save_onnx(path, model_name):
    # onnx worked but i couldn't get compression like in tensorflow
    tokenizer = BertTokenizer.from_pretrained(model_name)
    model = BertForMaskedLM.from_pretrained(model_name)
    model.eval()
    convert("pt", model, path, 11, tokenizer)


def load_onnx(path, model_name, mask, text, options):
    # these results are very similar to the tensorflow results
    tokenizer = BertTokenizer.from_pretrained(model_name)

    input_ids, attention_mask, token_type_ids, mask_idx, words_ids = skinned_bert.onnx_input(mask, tokenizer,
                                                                                             text,
                                                                                             options)
    model = onnx.load(path)
    onnx.checker.check_model(model)
    sess = ort.InferenceSession(bytes(model.SerializeToString()))
    feeds = {"input_ids": input_ids,
             "attention_mask": attention_mask,
             "token_type_ids": token_type_ids}
    predicted = sess.run(
        output_names=None,
        input_feed=feeds
    )[0]
    ranked, ranked_pairs = skinned_bert.onnx_output(predicted, words_ids, mask_idx, options)

    return ranked_pairs


def save_tensorflow(path: Path, model_name, max_seq_length, is_mobile):
    # with compression and converted to tensorflow.js, this model was 4x smaller than onnx
    # mobile has different results, but that's because it's a different model and they still makes sense
    if is_mobile:
        model = TFMobileBertForMaskedLM.from_pretrained(model_name)
    else:
        model = TFBertForMaskedLM.from_pretrained(model_name)
    model_call = tf.function(model.call)
    concrete_function = model_call.get_concrete_function(
        [tf.TensorSpec([None, max_seq_length], tf.int32, name="input_ids"),
         tf.TensorSpec([None, max_seq_length], tf.int32, name="attention_mask")])
    tf.saved_model.save(model, path.__str__(), signatures=concrete_function)


def load_tensorflow(path: Path, model_name, mask, text, options, max_seq_length):
    model = tf.saved_model.load(path.__str__())
    tokenizer = BertTokenizer.from_pretrained(model_name)
    input_ids, words_ids, target_idx, attention_mask, non_pad = skinned_bert.tensor_input(mask, tokenizer,
                                                                                          text, options,
                                                                                          max_seq_length)
    infer = model.signatures["serving_default"]

    predictions = infer(input_ids=input_ids, attention_mask=attention_mask)
    ranked, ranked_prob = skinned_bert.tensor_output(predictions, words_ids, target_idx, options, non_pad)
    return ranked_prob
