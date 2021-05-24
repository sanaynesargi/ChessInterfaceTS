import json
import time
import chess
from tqdm import tqdm


def load_from_name(name):
    with open(name, "r") as data:
        return json.load(data)


def main():
    solution = load_from_name("TEST_SOLUTION.json")
    test = load_from_name("SOLUTION.json")
    same = {"fens": {}}

    with open("counts.log", "w") as logger:
        for key, value in tqdm(solution["fens"].items()):
            for k, v in test["fens"].items():
                if key == k:
                    if v == value:
                        logger.write(f"CORRECT: {key} MOVES: {value}\n")
                    else:
                        logger.write(
                            f"INCORRECT: {key} CORRECT: {v} TRY: {value} \nBOARD: \n{str(chess.Board(key))}\n")
                    same["fens"][key] = {"correct": value, "try": v}
            time.sleep(18)

    with open("comparision.json", "w") as w:
        json.dump(same, w)


if __name__ == "__main__":
    main()
