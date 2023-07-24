import { GameWords, Word } from "@prisma/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { api } from "~/utils/api";

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState<string[]>([]);
  // create useState for the data from the query
  // the type should be gamewords extended by words

  const [data, setData] = useState<Word[]>();

  const [mistakes, setMistakes] = useState<number>(4);

  const router = useRouter();

  const id = router.query.id as string;

  // query trpc game by id
  const { data: trpcData, isLoading } = api.example.getGame.useQuery({
    id: id,
  });

  useEffect(() => {
    if (trpcData) setData(trpcData);
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
    //check the selected words all have the same dififculty and if they do remove it from the array and add it to the solved array
    if (
      //check all the words have the same difficulty
      selected.every(
        (word) =>
          data?.wordString.find((item) => item.wordString === word)
            ?.difficulty ===
          data?.wordString.find((item) => item.wordString === selected[0])
            ?.difficulty
      )
    ) {
      setSolved([...solved, ...selected]);

      // need to remove the selected words from the array data

      setSelected([]);

      //reset the selected array
    } else {
      alert("Wrong ");
      // if the selected words do not have the same difficulty, add 1 to the mistakes
      setMistakes(mistakes - 1);
      setSelected([]);
    }
  };

  return (
    <>
      <Head>
        <title>Custom Connections</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        {/* isloading */}
        {isLoading && <p>Loading...</p>}
        {/* div to center and put title on top of the page */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold">Custom Connections Game</h1>
          {/* 4 by 4 grid in the middle of the screen */}
          <div className="mt-3 grid grid-cols-4 gap-4">
            {/* solved */}
            {
              // loop over words
              solved?.map((word, i) => (
                //add the card id to the selected array
                <div
                  key={i}
                  //if the difficulty is 1 make it yellow 2 is orange 3 is red 4 is purple
                  className={`col-span-1  rounded-lg ${
                    data?.words.find((item) => item.wordString === word)
                      ?.difficulty === 1
                      ? "bg-yellow-300"
                      : data?.words.find((item) => item.wordString === word)
                          ?.difficulty === 2
                      ? "bg-green-400"
                      : data?.words.find((item) => item.wordString === word)
                          ?.difficulty === 3
                      ? "bg-blue-500"
                      : "bg-purple-400"
                  } p-4 shadow-lg`}
                >
                  <div className="flex flex-col items-center justify-center p-4 px-6 ">
                    <p className="text-xl font-bold uppercase">{word}</p>
                  </div>
                </div>
              ))
            }

            {/* unsolved */}
            {
              // loop over words
              data?.words.map((word, i) => (
                //add the card id to the selected array
                <div
                  key={i}
                  //if the card id is in the selected array, add the selected class
                  className={`rounded-lg  p-4 shadow-lg ${
                    selected.includes(word.wordString)
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                  onClick={() => handleSelection(word.wordString)}
                >
                  <div className="flex flex-col items-center justify-center p-4 px-6 ">
                    <p className="text-xl font-bold uppercase">
                      {word.wordString}
                    </p>
                  </div>
                </div>
              ))
            }

            {/* 4 small circles counting mistakes  */}
            <div className="col-span-4 flex w-full flex-col items-center justify-center p-4 px-6">
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
            </div>
            <div className="col-span-4 flex w-full flex-col items-center justify-center p-4 px-6">
              {/* 3 rounded buttons with border and white background  */}
              <div className="flex flex-row items-center justify-center gap-2">
                <button className="rounded-full border-2 border-gray-500 bg-white p-2 px-4">
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
            </div>
          </div>
        </div>
        {/* italicised by me */}
        <p className="italic text-gray-500">by Enrico Simon</p>
      </main>
    </>
  );
}
