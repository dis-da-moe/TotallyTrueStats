import math
import random
from functional import seq
from matplotlib import pyplot as plt


def print_choices(words_probs, probs, sentence, mask):
    # print the word choices
    words = words_probs.select(lambda pair: pair[0]).list()
    choices = random.choices(words, probs, k=10)
    percent_sentence = sentence.replace("percent", "%")
    for word in choices:
        print(percent_sentence.replace(mask, word))


def show_gradient(probs):
    # for simply displaying the probabilities on a graph
    x_axis = seq(probs).enumerate(start=0).select(lambda pair: pair[0]).list()
    plt.plot(x_axis, probs)
    plt.show()


def get_difference_pairs(probs):
    shifted = seq(probs).drop(1).list() + [0]
    difference_pairs = (seq(probs)
                        .zip(shifted)
                        )
    return difference_pairs


def cutoff_by_difference(words_probs):
    # This was a test to see if it would be good to cutoff the options based on the gradient increasing
    probs = words_probs.select(lambda pair: pair[1]).list()
    difference_pairs = get_difference_pairs(probs)
    last_difference = difference_pairs.last()[0] - difference_pairs.last()[1]
    drop_amount = (seq(difference_pairs)
                   .for_each(lambda pair: print(pair[0] - pair[1]))
                   .reverse()
                   .take_while(lambda pair: math.isclose(pair[0] - pair[1], last_difference, rel_tol=1e-06))
                   ).len()
    cutoff_differences = (seq(difference_pairs)
                          .drop_right(drop_amount)
                          )
    return cutoff_differences


def display_differences(difference_pairs):
    with_axis = (seq(difference_pairs)
                 .select(lambda pair: pair[0] - pair[1])
                 .enumerate(start=0)
                 )
    x_axis = with_axis.select(lambda pair: pair[0]).list()
    y_axis = with_axis.select(lambda pair: pair[1]).list()
    plt.plot(x_axis, y_axis)
    plt.show()
