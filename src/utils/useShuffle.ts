import { useEffect, useState } from "react";

//create a shuffle hook to shuffle any array that gets called
export const useShuffle = (arrayToShuffle: string[]) => {
  const [shuffledArray, setShuffledArray] = useState<string[]>([]);

  useEffect(() => {
    const shuffledArray = arrayToShuffle.sort((a, b) => 0.5 - Math.random());

    setShuffledArray(shuffledArray);
  }, [arrayToShuffle]);

  return shuffledArray;
};
