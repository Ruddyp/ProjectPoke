import { MemoryTuileType } from "@/app/type";
import { Card } from "@/components/ui/card";
import { useMemory } from "@/context/MemoryProvider";
import Image from "next/image";
type TuileProps = {
  tuile: MemoryTuileType;
};

export default function Tuile({ tuile }: TuileProps) {
  const { source, flipState } = tuile;
  const { flipCard } = useMemory();
  return (
    <Card
      className="relative flex items-center justify-center aspect-square w-full bg-slate-500 cursor-pointer hover:border-slate-300 overflow-hidden"
      onClick={() => !flipState && flipCard(tuile)}
    >
      {flipState ? (
        <Image src={source} fill unoptimized alt={"photo"} />
      ) : (
        <Image src={"/ectoplasma.png"} fill unoptimized alt={"hideFace"} />
      )}
    </Card>
  );
}
