"use client";

import { MemoryTuileType } from "@/app/type";
import { useMemory } from "@/context/MemoryProvider";
import Image from "next/image";
import { motion } from "framer-motion";

type TuileProps = {
  tuile: MemoryTuileType;
};

export default function Tuile({ tuile }: TuileProps) {
  const { source, flipState } = tuile;
  const { flipCard } = useMemory();

  return (
    <div
      className="relative aspect-square w-full cursor-pointer perspective-1000"
      onClick={() => !flipState && flipCard(tuile)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: flipState ? 180 : 0 }}
        transition={{ duration: 0.6, animationStyle: "easeInOut" }}
      >
        {/* FACE CACHÉE (Dos de la carte) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl md:rounded-2xl border-[3px] md:border-[5px] border-[#ffcb05] bg-[#4a6d9b] shadow-[0_4px_0_0_rgba(0,0,0,0.2)] flex items-center justify-center p-2">
          <div className="relative w-full h-full opacity-95">
            <Image
              src="/pokeball.png"
              fill
              unoptimized
              alt="hideFace"
              className="object-contain"
            />
          </div>
        </div>

        {/* FACE REVELEE (Le Pokemon) */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rounded-xl md:rounded-2xl border-[3px] md:border-[5px] border-[#ffcb05] bg-white shadow-[0_4px_0_0_rgba(0,0,0,0.2)] overflow-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="relative w-full h-full p-1 md:p-2">
            <Image
              src={source}
              fill
              unoptimized
              alt="pokemon"
              className="object-contain p-2"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
