import type { Word } from "@prisma/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { motion } from "framer-motion";
import { notifyToasterError, notifyToasterSuccess } from "~/utils/toaster";
//create an interface thatis gamewords extended by Word
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
interface ISolved {
  word: string[];
  difficulty: number | undefined;
  title: string | undefined;
}

export default function Home() {
  const [mistakes, setMistakes] = useState<number>(4);
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState<ISolved[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const [data, setData] = useState<Word[]>();

  const router = useRouter();

  const { width, height } = useWindowSize();

  const id = router.query.id as string;

  // query trpc game by id
  const { data: trpcData, isLoading } = api.game.getGame.useQuery({
    id: id,
  });

  useEffect(() => {
    //check if trpcData has data and the data does not have a length of 0

    if (trpcData && !data && gameOver === false) {
      const shuffledArray = trpcData?.words.sort((a, b) => 0.5 - Math.random());
      setData(shuffledArray);
    }
  }, [trpcData]);

  const handleSelection = (word: string) => {
    // if the word is already selected, remove it from the array and max selected words is 4
    if (selected.includes(word)) {
      setSelected(selected.filter((item) => item !== word));
    } else if (selected.length < 4) {
      // if the word is not selected, add it to the array
      setSelected([...selected, word]);
    }
  };

  const handleSubmit = () => {
    //check if the selected words are in the previous guesses array
    if (previousGuesses.includes(selected.sort().join(""))) {
      notifyToasterError("Already guessed");
      return;
    }

    //check the selected words all have the same dififculty and if they do remove it from the array and add it to the solved array
    if (
      //check all the words have the same difficulty
      selected.every(
        (word) =>
          data?.find((item) => item.wordString === word)?.difficulty ===
          data?.find((item) => item.wordString === selected[0])?.difficulty
      ) &&
      data
    ) {
      //set solved to the solved array
      setSolved((prevSolved: ISolved[]) => {
        const newSolvedItem = {
          word: selected ?? [],
          difficulty:
            data?.find((item) => item.wordString === selected[0])?.difficulty ??
            0,
          title: getDifficultyTitle(
            data?.find((item) => item.wordString === selected[0])?.difficulty ??
              0
          ),
        };

        return prevSolved ? [...prevSolved, newSolvedItem] : [newSolvedItem];
      });

      // need to remove the selected words from the array data
      setData(data?.filter((word) => !selected.includes(word.wordString)));

      setSelected([]);

      //reset the selected array
    } else {
      //add the guess to the previous guesses array as an array within an array
      //sort selected from A to Z
      setPreviousGuesses((prevGuesses) => [
        ...prevGuesses,
        selected.sort().join(""),
      ]);

      notifyToasterError("Wrong");
      // if the selected words do not have the same difficulty, add 1 to the mistakes
      setMistakes(mistakes - 1);
      setSelected([]);
    }
  };

  const handleShuffle = () => {
    setData(data?.sort((a, b) => 0.5 - Math.random()));
  };

  useEffect(() => {
    // If the mistakes are 0 and trpcData is available
    if (mistakes === 0 && trpcData?.words) {
      notifyToasterError("Better luck next time");
      setData([]);

      // Create an array with all the words from all four categories
      const allWords = trpcData.words.map((word) => word.wordString);

      // Set the solved state with the words from all categories and their difficulty
      setSolved(() => {
        const newSolvedItems: ISolved[] = [];

        // Loop through all four categories
        for (let i = 0; i < 4; i++) {
          //get all the words with the same difficulty as i
          const categoryWords = allWords.filter(
            (word) =>
              trpcData?.words.find((item) => item.wordString === word)
                ?.difficulty ===
              i + 1
          );

          newSolvedItems.push({
            word: categoryWords,
            difficulty: i + 1 ?? 0,
            title: getDifficultyTitle(i + 1 ?? 0),
          });
        }

        return newSolvedItems;
      });

      setGameOver(true);
      setGameWon(false);
    }
  }, [mistakes]);

  //SOLVED CHECKER
  useEffect(() => {
    //check each object in the array and order it by the difficulty
    solved?.sort((a, b) => a.difficulty! - b.difficulty!);

    //if the solved array is the lengh of 4 and data is empty
    if (solved?.length === 4 && data?.length === 0 && mistakes > 0) {
      setGameOver(true);
      //setGamewon to true for 10 seconds so confetti doesnt go forever
      setGameWon(true);
      setTimeout(() => {
        setGameWon(false);
      }, 10000);

      notifyToasterSuccess("You won");
    }
  }, [solved]);

  function getDifficultyTitle(difficulty: number) {
    if (difficulty === 1) {
      return trpcData?.easyTitle;
    } else if (difficulty === 2) {
      return trpcData?.mediumTitle;
    } else if (difficulty === 3) {
      return trpcData?.hardTitle;
    } else if (difficulty === 4) {
      return trpcData?.trickyTitle;
    }
  }

  return (
    <>
      <Head>
        <title>Custom Connections</title>
        <meta name="description" content="Create custom connections game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        {gameWon && mistakes !== 0 ? (
          <Confetti width={width} height={height} />
        ) : null}
        {/* isloading */}
        {isLoading && <p>Loading...</p>}
        {/* div to center and put title on top of the page */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-3xl font-bold md:text-6xl">
            Custom Connections Game
          </h1>
          {/* 4 by 4 grid in the middle of the screen */}
          <motion.div className="mt-3 grid w-full grid-cols-4 gap-4">
            {/* solved */}

            {
              // loop over words
              solved?.map((word, i) => (
                <div
                  key={i}
                  //if the difficulty is 1 make it yellow 2 is orange 3 is red 4 is purple
                  className={`col-span-4 w-full rounded-lg
                    ${
                      word.difficulty === 1
                        ? "bg-yellow-300"
                        : word.difficulty === 2
                        ? "bg-green-500"
                        : word.difficulty === 3
                        ? "bg-blue-500"
                        : "bg-purple-600"
                    }                
                  p-4 shadow-lg`}
                >
                  <div className="flex flex-col items-center justify-center p-4 px-6 ">
                    <p className="text-xl font-bold uppercase">{word.title}</p>
                    <p>
                      {/* div with space between each word */}
                      <div className="flex flex-row gap-2 underline">
                        {word.word.map((item, i) => (
                          <span key={i} className="">
                            {item}
                            {i < word.word.length - 1 && ","}
                          </span>
                        ))}
                      </div>
                    </p>
                  </div>
                </div>
              ))
            }

            {/* unsolved */}
            {
              // loop over words
              data?.map((word, i) => (
                //add the card id to the selected array
                <motion.div
                  key={i}
                  //if the card id is in the selected array, add the selected class
                  className={`w-full  rounded-lg p-4 shadow-lg ${
                    selected.includes(word.wordString)
                      ? "bg-blue-200"
                      : "bg-gray-100"
                  }`}
                  onClick={() => handleSelection(word.wordString)}
                >
                  <div className="flex flex-col items-center justify-center p-4 px-6 ">
                    <p className="text-base font-bold uppercase md:text-xl">
                      {word.wordString}
                    </p>
                  </div>
                </motion.div>
              ))
            }

            {/* 4 small circles counting mistakes  */}
            <div className="col-span-4 flex w-full flex-col items-center justify-center p-4 px-6">
              {!gameOver ? (
                <div className="flex flex-row items-center justify-center gap-2">
                  <p className="text-xl">Mistakes remaining:</p>
                  {/* loop 4 times 4 circles grey for no mistakes red for mistakes */}
                  {Array.from(Array(4).keys()).map((i) => (
                    <div
                      key={i}
                      className={`h-4 w-4 rounded-full ${
                        mistakes > i ? "bg-gray-500" : "bg-red-500"
                      }`}
                    ></div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="col-span-4 flex w-full flex-col items-center justify-center p-4 px-6">
              {/* 3 rounded buttons with border and white background  */}
              {!gameOver ? (
                <div className="flex flex-row items-center justify-center gap-2">
                  <button
                    className="rounded-full border-2 border-gray-500 bg-white p-2 px-4"
                    onClick={() => void handleShuffle()}
                  >
                    <p className="text-xl">Shuffle</p>
                  </button>
                  <button
                    className="rounded-full border-2 border-gray-500 bg-white p-2 px-4"
                    onClick={() => setSelected([])}
                  >
                    <p className="text-xl">Deselect All</p>
                  </button>
                  {selected.length === 4 ? (
                    <button
                      className="rounded-full  bg-gray-900 p-2 px-4 text-white"
                      onClick={() => void handleSubmit()}
                    >
                      <p className="text-xl">Submit</p>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="rounded-full border-2 border-gray-500 bg-white p-2 px-4"
                    >
                      <p className="text-xl">Submit</p>
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
        <p className="mt-5 italic text-gray-500">by Enrico Simon</p>

        <p className="text-xs text-gray-500">
          If you would like to contibute to this project, please visit
          <a
            className="text-blue-500"
            target="_blank"
            href="https://github.com/1916eco/custom-connections-wordle"
          >
            {" github "}
          </a>
        </p>
      </main>
    </>
  );
}
