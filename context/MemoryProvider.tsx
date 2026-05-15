"use client";
import {
  MemoryDifficulty,
  MemoryGameStatus,
  MemoryTuileType,
  Pokemon,
} from "@/app/type";
import { getTuiles, shuffle, sleep } from "@/lib/utils";
import { IMemoryLeaderboard } from "@/models/leaderboard";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type MemoryContextType = {
  tuiles: MemoryTuileType[];
  gameStatus: MemoryGameStatus;
  score: number;
  leaderboard: IMemoryLeaderboard[];
  time: number;
  setGameStatus: Dispatch<SetStateAction<MemoryGameStatus>>;
  startGame: (difficulty: MemoryDifficulty) => void;
  updateLeaderboard: (idToUpdate: string, score: IMemoryLeaderboard) => void;
  addToLeaderboard: (score: IMemoryLeaderboard) => void;
  flipCard: (tuile: MemoryTuileType) => void;
};

type MemoryProviderProps = {
  children: ReactNode;
  pokemons: Pokemon[];
  memoryLeaderboard: IMemoryLeaderboard[];
};

// 2. Création du contexte
const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export function MemoryProvider({
  children,
  pokemons,
  memoryLeaderboard,
}: MemoryProviderProps) {
  const [tuiles, setTuiles] = useState(getTuiles(pokemons));
  const [gameStatus, setGameStatus] = useState<MemoryGameStatus>("waiting");
  const [flipCardQueue, setFlipCardQueue] = useState<MemoryTuileType[]>([]);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState(memoryLeaderboard);
  const [time, setTime] = useState(0);

  // Gestion quand 2 cartes sont flips
  useEffect(() => {
    if (flipCardQueue.length === 2) {
      (async () => {
        const firstTuile = flipCardQueue[0].source;
        const secondTuile = flipCardQueue[1].source;
        if (firstTuile !== secondTuile) {
          await sleep(1000);
          updateTuile(flipCardQueue[0].id);
          updateTuile(flipCardQueue[1].id);
        }
        setFlipCardQueue([]);
      })();
    }
  }, [flipCardQueue, tuiles]);

  // Gestion de la victoire
  useEffect(() => {
    if (tuiles.every((tuile) => tuile.flipState === true)) {
      setGameStatus("ending");
    }
  }, [tuiles]);

  //Gestion du timer de la partie
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameStatus === "ongoing") {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameStatus]);

  function startGame(mode: MemoryDifficulty = "easy") {
    const tuiles = getTuiles(pokemons, mode);
    setGameStatus("ongoing");
    setTuiles(shuffle(tuiles));
    setFlipCardQueue([]);
    setScore(0);
    setTime(0);
  }

  function flipCard(tuile: MemoryTuileType) {
    // Check si on peut flip la carte
    if (flipCardQueue.length >= 0 && flipCardQueue.length < 2) {
      setFlipCardQueue((prevFlipCard) => [...prevFlipCard, tuile]);
      updateTuile(tuile.id);
      setScore((prevNb) => prevNb + 0.5);
    }
  }

  function updateTuile(tuileIndex: number) {
    setTuiles((prevTuiles) =>
      prevTuiles.map((prevTuile) => {
        if (prevTuile.id === tuileIndex) {
          return { ...prevTuile, flipState: !prevTuile.flipState };
        } else {
          return prevTuile;
        }
      }),
    );
  }

  function updateLeaderboard(
    scoreToUpdateId: string,
    score: IMemoryLeaderboard,
  ) {
    setLeaderboard((prevLeaderboard) =>
      prevLeaderboard.map((prevLeaderboard) => {
        if (prevLeaderboard._id === scoreToUpdateId) {
          return { ...score };
        } else {
          return prevLeaderboard;
        }
      }),
    );
  }

  function addToLeaderboard(score: IMemoryLeaderboard) {
    setLeaderboard([...leaderboard, score]);
  }

  return (
    <MemoryContext.Provider
      value={{
        gameStatus,
        tuiles,
        score,
        setGameStatus,
        startGame,
        flipCard,
        updateLeaderboard,
        addToLeaderboard,
        leaderboard,
        time,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemory() {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("useMemory doit être utilisé au sein d'un MemoryProvider");
  }
  return context;
}
