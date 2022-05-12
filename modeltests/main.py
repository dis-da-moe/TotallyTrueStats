from pathlib import Path
import different_versions_tests as tests

EXAMPLE_TEXT = "this is a ***mask***."
EXAMPLE_OPTIONS = ["man", "woman", "god", "tomato", "person", "thing", "test", "example", "idea", "sign"]
EXAMPLE_MASK = "***mask***"
MODEL_NAME = "bert-base-uncased"
MOBILE_MODEL_NAME = "google/mobilebert-uncased"
MAX_SEQ_LENGTH = 512

TEST_RANDOM = False
TEST_RESTRICTIONS = True
TEST_NO_RESTRICTIONS = False
TEST_ONNX = False
TEST_TENSORFLOW = False
TEST_TENSORFLOW_MOBILE = False


def add_arguments(default, additional):
    result = default if additional is None else default + additional
    return result


def run_save_load_test(save, load, path_string, additional_save_args=None, additional_load_args=None):
    path = Path(path_string)
    if not path.exists():
        default_save_args = (path, MODEL_NAME)
        save(*add_arguments(default_save_args, additional_save_args))

    default_load_args = (path, MODEL_NAME, EXAMPLE_MASK, EXAMPLE_TEXT, EXAMPLE_OPTIONS)
    return load(*add_arguments(default_load_args, additional_load_args))


def run_pretrained_test(test, additional_args=None):
    default_args = (MODEL_NAME, EXAMPLE_MASK, EXAMPLE_TEXT)
    return test(*add_arguments(default_args, additional_args))


def main():
    results = {}

    if TEST_RANDOM:
        results["Random"] = tests.random_selection(EXAMPLE_MASK, EXAMPLE_TEXT, EXAMPLE_OPTIONS)

    if TEST_RESTRICTIONS:
        result = run_pretrained_test(
            tests.skinned_bert_test,
            (EXAMPLE_OPTIONS,)
        )
        results["Restrictions"] = result

    if TEST_NO_RESTRICTIONS:
        result = run_pretrained_test(
            tests.tf_no_restrictions_test,
            (len(EXAMPLE_OPTIONS),)
        )
        results["No restrictions"] = result

    if TEST_ONNX:
        result = run_save_load_test(
            tests.save_onnx,
            tests.load_onnx,
            "bert_base_uncased.onnx"
        )
        results["Onnx"] = result

    if TEST_TENSORFLOW:
        result = run_save_load_test(
            tests.save_tensorflow,
            tests.load_tensorflow,
            "Saved",
            (MAX_SEQ_LENGTH, False),
            (MAX_SEQ_LENGTH,)
        )
        results["Tensorflow"] = result

    if TEST_TENSORFLOW_MOBILE:
        result = run_save_load_test(
            tests.save_tensorflow,
            tests.load_tensorflow,
            "SavedMobile",
            (MAX_SEQ_LENGTH, True),
            (MAX_SEQ_LENGTH,)
        )
        results["Tensorflow Mobile"] = result

    print(results)


if __name__ == '__main__':
    main()
