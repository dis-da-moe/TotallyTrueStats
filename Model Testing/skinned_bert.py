# Some of this code is taken from FITBert and removed from its class and converted to functions
# There is also original code here

import numpy
import numpy as np
from functional import seq
import torch
import tensorflow as tf

MODEL_TYPE = "int64"


def softmax(x):
    return x.exp() / (x.exp().sum(-1)).unsqueeze(-1)


def softmax_numpy(x: numpy.ndarray):
    exponent: numpy.ndarray = np.exp(x)
    return exponent / (exponent.sum(axis=-1, keepdims=True))


def tokenize_sentence(mask_token, tokenizer, sentence):
    pre_mask, post_mask = sentence.split(mask_token)

    tokens = ["[CLS]"] + tokenizer.tokenize(pre_mask)
    target_idx = len(tokens)
    tokens += ["[MASK]"]
    tokens += tokenizer.tokenize(post_mask) + ["[SEP]"]
    print(tokens)
    input_ids = tokenizer.convert_tokens_to_ids(tokens)
    return input_ids, target_idx


def tokenize_options(options, tokenizer):
    words_ids = (
        seq(options)
            .map(lambda x: tokenizer.tokenize(x))
            .map(lambda x: tokenizer.convert_tokens_to_ids(x)[0])
    )

    return words_ids.list()


def pair_options(words_ids, probabilities, target_idx, options):
    ranked_pairs = (
        seq(words_ids)
            .map(lambda x: float(probabilities[0][target_idx][x].item()))
            .zip(options)
            .sorted(key=lambda x: x[0], reverse=True)
    )
    ranked_options = (seq(ranked_pairs).map(lambda x: x[1])).list()
    return ranked_pairs.list(), ranked_options


def torch_input(mask_token, tokenizer, sentence, options, unsqueeze=True):
    input_ids, target_idx = tokenize_sentence(mask_token, tokenizer, sentence)

    words_ids = tokenize_options(options, tokenizer)

    tensors = torch.tensor(input_ids)

    if unsqueeze:
        tensors = tensors.unsqueeze(0)

    tensors = tensors.to(torch.device("cpu"))
    return tensors, words_ids, target_idx


def torch_output(predictions, words_ids, target_idx, options):
    probabilities = softmax(predictions)
    ranked_pairs, ranked_options = pair_options(words_ids, probabilities, target_idx, options)
    return ranked_options, ranked_pairs


def onnx_input(mask_token, tokenizer, sentence, options):
    input_ids, target_idx = tokenize_sentence(mask_token, tokenizer, sentence)
    attention_mask = np.array([[1] * len(input_ids)], dtype=MODEL_TYPE)
    token_type_ids = np.array([[0] * len(input_ids)], dtype=MODEL_TYPE)
    input_ids = np.array([input_ids], dtype=MODEL_TYPE)
    words_ids = tokenize_options(options, tokenizer)

    return input_ids, attention_mask, token_type_ids, target_idx, words_ids


def onnx_output(predictions, words_ids, target_idx, options):
    probabilities = softmax_numpy(predictions)
    ranked_pairs, ranked_options = pair_options(words_ids, probabilities, target_idx, options)
    return ranked_options, ranked_pairs


def tensor_input(mask_token, tokenizer, sentence, options, max_length):
    # in tensorflow, the inputs need to be padded for saved models
    input_ids, target_idx = tokenize_sentence(mask_token, tokenizer, sentence)
    words_ids = tokenize_options(options, tokenizer)

    non_pad = len(input_ids)
    attention_mask = [1] * non_pad + [0] * (max_length - non_pad)
    input_ids += [0] * (max_length - non_pad)

    convert = tf.convert_to_tensor

    return convert([input_ids]), words_ids, target_idx, convert([attention_mask]), non_pad


def tensor_output(predictions, words_ids, target_idx, options, non_pad):
    predictions = predictions["logits"].numpy()[0][0:non_pad]
    probabilities = softmax_numpy(predictions)
    ranked_pairs = (
        seq(words_ids)
            .map(lambda x: float(probabilities[target_idx][x].item()))
            .zip(options)
            .sorted(key=lambda x: x[0], reverse=True)
    )
    ranked_options = (seq(ranked_pairs).map(lambda x: x[1])).list()

    return ranked_options, ranked_pairs.list()
