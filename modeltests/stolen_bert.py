# This code is taken from FITBert and modified to simplify it for my use case
# This is unused as it was a stepping stone to skinned bert

import torch
from functional import seq
from torch import nn
from transformers import BertForMaskedLM, BertTokenizer


class StolenBert(nn.Module):
    def __init__(self, model=None, tokenizer=None, mask_token="***mask***", model_name="bert-base-uncased"):
        super(StolenBert, self).__init__()
        self.mask_token = mask_token
        self.device = torch.device("cpu")
        print("device:", self.device)
        if not model:
            self.bert: BertForMaskedLM = BertForMaskedLM.from_pretrained(model_name)
        else:
            self.bert: BertForMaskedLM = model
            self.bert.to(self.device)
        print("Model: ", self.bert.config_class.model_type)

        if not tokenizer:
            self.tokenizer = BertTokenizer.from_pretrained(model_name)
        else:
            self.tokenizer = tokenizer

        self.bert.eval()

    @staticmethod
    def softmax(x):
        return x.exp() / (x.exp().sum(-1)).unsqueeze(-1)

    def process_input(self, sentence, options):
        # check if masked token present
        if self.mask_token not in sentence:
            return None, None, None

        # if there are less than 2 options, then there is nothing to choose so return
        if seq(options).len() < 2:
            return None, None, None

        pre_mask, post_mask = sentence.split(self.mask_token)

        options = seq(options).list()

        tokens = ["[CLS]"] + self.tokenizer.tokenize(pre_mask)
        target_idx = len(tokens)
        tokens += ["[MASK]"]
        tokens += self.tokenizer.tokenize(post_mask) + ["[SEP]"]
        words_ids = (
            seq(options)
                .map(lambda x: self.tokenizer.tokenize(x))
                .map(lambda x: self.tokenizer.convert_tokens_to_ids(x)[0])
        )
        input_ids = self.tokenizer.convert_tokens_to_ids(tokens)
        tensors = torch.tensor(input_ids).unsqueeze(0)
        tensors = tensors.to(self.device)
        return tensors, words_ids, target_idx

    def process_output(self, predictions, words_ids, target_idx, options):
        probabilities = self.softmax(predictions)
        ranked_pairs = (
            seq(words_ids)
                .map(lambda x: float(probabilities[0][target_idx][x].item()))
                .zip(options)
                .sorted(key=lambda x: x[0], reverse=True)
        )
        ranked_options = (seq(ranked_pairs).map(lambda x: x[1])).list()

        return ranked_options, ranked_pairs

