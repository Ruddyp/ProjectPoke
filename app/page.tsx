import Image from "next/image";

export default async function Page() {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col justify-start items-center gap-10 bg-transparent p-6">
      <Image
        src="/main_background.png"
        className="object-cover -z-10"
        fill
        unoptimized
        alt="main_background"
      />
      <div className="bg-primary/85 p-4 rounded-lg">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
          Bienvenue sur Project Poke
        </h1>
      </div>

      <div className="bg-primary/85 p-4 rounded-lg w-full md:w-2/3">
        <h2 className="text-sm text-center sm:text-base md:text-lg font-semibold text-white">
          {`Plongez dans l'univers Pokémon : consultez les fiches de toutes les générations, comparez les statistiques et découvrez les infos Pokémon GO. Ne manquez aucun Raid en temps réel et relevez le défi de notre mini-jeu 'Devine le Pokémon' pour prouver que vous êtes le meilleur dresseur !`}
        </h2>
      </div>
    </div>
  );
}
