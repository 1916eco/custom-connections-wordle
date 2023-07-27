import { GameWords } from "@prisma/client";
import Head from "next/head";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Modal from "./component/Modal";
import { notifyToasterError } from "~/utils/toaster";

interface Ititles {
  easyTitle: string;
  mediumTitle: string;
  hardTitle: string;
  trickyTitle: string;
}

function Index() {
  const wordsTRPC = api.example.createGame.useMutation();
  const [createdGame, setCreatedGame] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [results, setResults] = useState<GameWords>();
  const [easy, setEasy] = useState<string[]>([]);
  const [medium, setMedium] = useState<string[]>([]);
  const [hard, setHard] = useState<string[]>([]);
  const [tricky, setTricky] = useState<string[]>([]);
  // const [trpcResults, setTrpcResults] = useState<any>();
  const [titles, setTitles] = useState<Ititles>({
    easyTitle: "",
    mediumTitle: "",
    hardTitle: "",
    trickyTitle: "",
  });

  const handleCreateGame = async () => {
    //if createdGame is true, return
    if (createdGame) {
      notifyToasterError("Game already created");
      setOpenModal(true);
      return;
    }

    if (
      easy.length == 4 &&
      medium.length == 4 &&
      hard.length == 4 &&
      tricky.length == 4 &&
      titles.easyTitle !== "" &&
      titles.mediumTitle !== "" &&
      titles.hardTitle !== "" &&
      titles.trickyTitle !== ""
    ) {
      const resultTRPC = await wordsTRPC.mutateAsync({
        wordsArray: [
          //add all easy words to the array with 1 as the difficulty
          ...easy.map((word) => ({
            wordsString: word.toLowerCase(),
            difficulty: 1,
          })),
          //add all medium words to the array with 2 as the difficulty
          ...medium.map((word) => ({
            wordsString: word.toLowerCase(),
            difficulty: 2,
          })),
          //add all hard words to the array with 3 as the difficulty
          ...hard.map((word) => ({
            wordsString: word.toLowerCase(),
            difficulty: 3,
          })),
          //add all tricky words to the array with 4 as the difficulty
          ...tricky.map((word) => ({
            wordsString: word.toLowerCase(),
            difficulty: 4,
          })),
        ],
        titles: titles,
      });
      // console.log("resultTRPC", resultTRPC);
      // setTrpcResults(result);
      setResults(resultTRPC);
      setCreatedGame(true);
      setOpenModal(true);
    } else {
      // console.log("Please add more words or add title");
      notifyToasterError("Please add more words or add title");
    }
  };

  return (
    <>
      <Head>
        <title>Create Custom Connections</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        {results && openModal && createdGame ? (
          <Modal game={results} setOpenModal={setOpenModal} />
        ) : null}
        {/* div to center and put title on top of the page */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold">Create Custom Connections Game</h1>

          <div className="mt-3 grid grid-cols-5 gap-4">
            {/* EASY WORDS */}
            <div
              className={`col-span-1  rounded-lg bg-yellow-300 p-4 shadow-lg`}
            >
              <div className="flex flex-col items-center justify-center p-4 px-6 ">
                <p className="text-xl font-bold uppercase ">Easy</p>
                <input
                  className="bg-transparent p-1 text-center text-base font-bold uppercase"
                  placeholder="Input Title"
                  onChange={(e) =>
                    setTitles({ ...titles, easyTitle: e.target.value })
                  }
                />
              </div>
            </div>
            {
              //   loop 4 times
              Array.from(Array(4).keys()).map((i) => (
                //add the card id to the selected array
                <div
                  key={i}
                  //if the card id is in the selected array, add the selected class
                  className={`flex  rounded-lg p-4 shadow-lg`}
                >
                  <div className="flex flex-col items-center justify-center p-4 px-3 ">
                    {/* input easy words */}
                    <input
                      className="bg-transparent p-1 text-center text-base font-bold uppercase"
                      placeholder="Input easy words"
                      //   add the word to the easy array based on the index
                      onChange={(e) =>
                        setEasy([
                          ...easy.slice(0, i),
                          e.target.value,
                          ...easy.slice(i + 1),
                        ])
                      }
                    />
                  </div>
                </div>
              ))
            }
            {/* MEDIUM WORDS */}
            <div
              className={`col-span-1  rounded-lg bg-green-500 p-4 shadow-lg`}
            >
              <div className="flex flex-col items-center justify-center p-4 px-6 ">
                <p className="text-xl font-bold uppercase">Medium</p>
                <input
                  className="bg-transparent p-1 text-center text-base font-bold uppercase"
                  placeholder="Input Title"
                  onChange={(e) =>
                    setTitles({ ...titles, mediumTitle: e.target.value })
                  }
                />
              </div>
            </div>
            {
              //   loop 4 times
              Array.from(Array(4).keys()).map((i) => (
                //add the card id to the selected array
                <div
                  key={i}
                  //if the card id is in the selected array, add the selected class
                  className={`flex rounded-lg  p-2 shadow-lg`}
                >
                  <div className="flex flex-col items-center justify-center  p-4 px-3">
                    {/* input easy words */}
                    <input
                      className="bg-transparent p-1 text-center text-base font-bold uppercase"
                      placeholder="Input Medium words"
                      onChange={(e) =>
                        setMedium([
                          ...medium.slice(0, i),
                          e.target.value,
                          ...medium.slice(i + 1),
                        ])
                      }
                    />
                  </div>
                </div>
              ))
            }
            {/* HARD WORDS */}

            <div
              className={`col-span-1  rounded-lg  bg-blue-500 p-4 shadow-lg`}
            >
              <div className="flex flex-col items-center justify-center p-4 px-6 ">
                <p className="text-xl font-bold uppercase">Hard</p>
                <input
                  className="bg-transparent p-1 text-center text-base font-bold uppercase"
                  placeholder="Input Title"
                  onChange={(e) =>
                    setTitles({ ...titles, hardTitle: e.target.value })
                  }
                />
              </div>
            </div>
            {
              //   loop 4 times
              Array.from(Array(4).keys()).map((i) => (
                //add the card id to the selected array
                <div
                  key={i}
                  //if the card id is in the selected array, add the selected class
                  className={`flex  rounded-lg p-2 shadow-lg`}
                >
                  <div className="flex flex-col items-center justify-center p-4 px-3 ">
                    {/* input easy words */}
                    <input
                      className="bg-transparent p-1 text-center text-base font-bold uppercase"
                      placeholder="Input Hard words"
                      onChange={(e) =>
                        setHard([
                          ...hard.slice(0, i),
                          e.target.value,
                          ...hard.slice(i + 1),
                        ])
                      }
                    />
                  </div>
                </div>
              ))
            }
            {/* Super Hard Words */}
            <div
              className={`col-span-1  rounded-lg bg-purple-600 p-4 shadow-lg`}
            >
              <div className="flex flex-col items-center justify-center p-4 px-6 ">
                <p className="text-xl font-bold uppercase">Tricky</p>
                <input
                  className="bg-transparent p-1 text-center text-base font-bold uppercase"
                  placeholder="Input Title"
                  onChange={(e) =>
                    setTitles({ ...titles, trickyTitle: e.target.value })
                  }
                />
              </div>
            </div>
            {
              //   loop 4 times
              Array.from(Array(4).keys()).map((i) => (
                //add the card id to the selected array
                <div
                  key={i}
                  //if the card id is in the selected array, add the selected class
                  className={`flex  rounded-lg p-2 shadow-lg`}
                >
                  <div className="flex flex-col items-center justify-center p-4 px-3 ">
                    {/* input easy words */}
                    <input
                      className="bg-transparent p-1 text-center  text-base font-bold uppercase"
                      placeholder="Input Tricky words"
                      onChange={(e) =>
                        setTricky([
                          ...tricky.slice(0, i),
                          e.target.value,
                          ...tricky.slice(i + 1),
                        ])
                      }
                    />
                  </div>
                </div>
              ))
            }
            <div className="col-span-5 flex items-center justify-center">
              <button className="  rounded-full bg-gray-900 p-2 px-4 text-white ">
                <p className="text-xl" onClick={() => void handleCreateGame()}>
                  {!createdGame ? "Create and Share" : "Share Game"}
                </p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Index;
