import { PokeBattlePokemonDetails } from "@/app/type";

type StatusBadgesProps = {
  pokemon: PokeBattlePokemonDetails;
};

export default function StatusBadges({ pokemon }: StatusBadgesProps) {
  const activeStatus: { label: string; className: string }[] = [];

  // Statuts principaux
  if (pokemon.isParalyze) {
    activeStatus.push({
      label: "PAR",
      className: "bg-[#F0D040] text-black border-[#C0A020]",
    });
  }
  if (pokemon.isAsleep) {
    activeStatus.push({
      label: "SOM",
      className: "bg-[#A0A0A0] text-white border-[#707070]",
    });
  }
  if (pokemon.isFrozen) {
    activeStatus.push({
      label: "GEL",
      className: "bg-[#98D8D8] text-black border-[#68A8A8]",
    });
  }
  if (pokemon.isBurnt) {
    activeStatus.push({
      label: "BRU",
      className: "bg-[#F08030] text-white border-[#C05010]",
    });
  }
  if (pokemon.isPoisoned) {
    activeStatus.push({
      label: "PSN",
      className: "bg-[#A040A0] text-white border-[#702070]",
    });
  }

  // Statuts secondaires / volatils
  if (pokemon.isConfused) {
    activeStatus.push({
      label: "CON",
      className: "bg-[#9F5BBA] text-white border-[#733A8C]",
    });
  }
  if (pokemon.isSeeded) {
    activeStatus.push({
      label: "VAMP",
      className: "bg-[#78C850] text-white border-[#4E982D]",
    });
  }

  // Si aucun statut n'est actif, on ne retourne rien
  if (activeStatus.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
      {activeStatus.map((status, index) => (
        <span
          key={index}
          className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black rounded border uppercase tracking-wide shadow-sm select-none ${status.className}`}
          style={{ fontFamily: "monospace" }}
        >
          {status.label}
        </span>
      ))}
    </div>
  );
}
