"use client";
import {
  MemoryDifficulty,
  MemoryGameStatus,
  MemoryTuileType,
  Pokemon,
} from "@/app/type";
import { getTuiles, shuffle, sleep } from "@/lib/utils";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type MemoryContextType = {
  tuiles: MemoryTuileType[];
  gameStatus: MemoryGameStatus;
  nbClick: number;
  startGame: (difficulty: MemoryDifficulty) => void;
  flipCard: (tuile: MemoryTuileType) => void;
};

// 2. Création du contexte
const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export function MemoryProvider({
  children,
  pokemons,
}: {
  children: ReactNode;
  pokemons: Pokemon[];
}) {
  const [tuiles, setTuiles] = useState(getTuiles(pokemons));
  const [gameStatus, setGameStatus] = useState<MemoryGameStatus>("waiting");
  const [flipCardQueue, setFlipCardQueue] = useState<MemoryTuileType[]>([]);
  const [nbClick, setNbClick] = useState(0);

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

  function startGame(mode: MemoryDifficulty = "easy") {
    const tuiles = getTuiles(pokemons, mode);
    setGameStatus("ongoing");
    setTuiles(shuffle(tuiles));
    setFlipCardQueue([]);
  }

  function flipCard(tuile: MemoryTuileType) {
    // Check si on peut flip la carte
    if (flipCardQueue.length >= 0 && flipCardQueue.length < 2) {
      setFlipCardQueue((prevFlipCard) => [...prevFlipCard, tuile]);
      updateTuile(tuile.id);
      setNbClick((prevNb) => prevNb + 0.5);
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

  return (
    <MemoryContext.Provider
      value={{ gameStatus, tuiles, nbClick, startGame, flipCard }}
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
