import { MemoryDifficulty } from "@/app/type";
import { Button } from "@/components/ui/button";
import { useMemory } from "@/context/MemoryProvider";

type WaitingProps = {
  difficulty: MemoryDifficulty;
};

export default function Waiting({ difficulty }: WaitingProps) {
  const { startGame } = useMemory();
  return (
    <Button
      onClick={() => startGame(difficulty)}
      className="mt-10 bg-[#5cb85c] hover:bg-[#4cae4c] text-white text-xl font-black px-12 py-8 rounded-full border-b-[6px] border-[#3d8b3d] shadow-[0_8px_20px_rgba(92,184,92,0.4)] transition-all hover:-translate-y-1 active:translate-y-1 active:border-b-0"
    >
      DÉMARRER LA PARTIE
    </Button>
  );
}
