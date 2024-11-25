"use client";

import { Pokemon, Raid } from "@/app/type";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import PokemonTypesComponent from "../generic/pokemonTypesComponent";
import { useRouter } from "next/navigation";

type RaidCardProps = {
  raid: Raid;
  pokemon: Pokemon;
};

export function getTierInfo(tier: string) {
  switch (tier) {
    case "1st Tier":
      return {
        image: "/Egg_Raid_Normal.webp",
        frenchName: "Raid 1 étoile",
        filter: "normal",
      };
    case "1st Tier Shadow Raids":
      return {
        image: "/Egg_Raid_Normal_shadow.webp",
        frenchName: "Raid obscur 1 étoile",
        filter: "normal_shadow",
      };
    case "3rd Tier":
      return {
        image: "/Egg_Raid_Rare.webp",
        frenchName: "Raid 3 étoiles",
        filter: "rare",
      };
    case "3rd Tier Shadow Raids":
      return {
        image: "/Egg_Raid_Rare_shadow.webp",
        frenchName: "Raid obscur 3 étoiles",
        filter: "rare_shadow",
      };
    case "5th Tier":
      return {
        image: "/Egg_Raid_Legendary.webp",
        frenchName: "Raid 5 étoiles",
        filter: "legendary",
      };
    case "Legendary Shadow Raids":
      return {
        image: "/Egg_Raid_Legendary_shadow.webp",
        frenchName: "Raid obscur légendaire",
        filter: "legendary_shadow",
      };
    case "Mega Raids":
      return {
        image: "/Egg_Raid_Mega.webp",
        frenchName: "Raid méga",
        filter: "mega",
      };
    case "Mega Legendary":
      return {
        image: "/Egg_Raid_Mega_Legendary.webp",
        frenchName: "Raid méga légendaire",
        filter: "mega_legendary",
      };
    case "Ultra Beast":
      return {
        image: "/Egg_Raid_Ultra.webp",
        frenchName: "Raid ultra chimère",
        filter: "ultra",
      };
    default:
      return {
        image: "No image",
        frenchName: "No name",
        filter: "none",
      };
  }
}

export default function RaidCard({ raid, pokemon }: RaidCardProps) {
  const router = useRouter();
  const tierInfo = getTierInfo(raid.tier);

  return (
    <Card className="m-0.5 rounded-md border border-slate-500 w-[315px]">
      <CardHeader className="flex flex-row items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
        <CardTitle className="flex flex-row items-center justify-center gap-2 text-base sm:text-lg">
          <p>{tierInfo.frenchName}</p>
          <div className="relative size-8 sm:size-10">
            <Image
              src={tierInfo.image}
              alt={tierInfo.frenchName}
              fill
              sizes="(max-width: 640px) 32px, 48px"
              className="object-cover"
              unoptimized
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center p-1">
        <div className="flex flex-row justify-center items-center gap-2 p-1.5 border-b border-slate-500 w-full">
          <p className="text-base sm:text-lg font-bold text-center text-red-400">
            {pokemon.name.fr}
          </p>
          <PokemonTypesComponent pokemon={pokemon} />
        </div>
        <div
          onClick={() => router.push(`/pokemon/${raid.pokemon_id}`)}
          className="relative size-48 xs:size-56 sm:size-64 cursor-pointer"
        >
          <Image
            src={`https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${raid.pokemon_id}/regular.png`}
            alt={pokemon.name.fr}
            fill
            className="object-cover"
            sizes="(max-width: 475px) 192px, (max-width: 640px) 224px, 256px"
            unoptimized
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center bg-muted/80 p-1 m-0 rounded-b-md">
        <CardContent className="p-0">
          <table className="w-full table-fixed">
            <thead></thead>
            <tbody>
              <tr className="border-b border-slate-500">
                <td className="text-red-400 p-2 text-right font-medium">
                  PC du boss :
                </td>
                <td className="p-2">
                  {raid.boss_cp != undefined ? (
                    <span className="font-bold">{raid.boss_cp}</span>
                  ) : (
                    "Inconnu"
                  )}
                </td>
              </tr>
              <tr className="border-b border-slate-500">
                <td className="text-red-400 p-2 text-right font-medium">
                  PC max :
                </td>
                <td className="p-2">
                  {raid.max_cp != undefined ? (
                    <span className="font-bold">{raid.max_cp}</span>
                  ) : (
                    "Inconnu"
                  )}
                </td>
              </tr>
              <tr
                className={`${
                  raid.additional_info != undefined
                    ? "border-b border-slate-500"
                    : ""
                } `}
              >
                <td className="text-red-400 p-2 text-right font-medium">
                  PC max boost météo :
                </td>
                <td className="p-2">
                  {raid.max_cp_boost != undefined ? (
                    <span className="font-bold">{raid.max_cp_boost}</span>
                  ) : (
                    "Inconnu"
                  )}
                </td>
              </tr>
              {raid.additional_info != undefined ? (
                <tr>
                  <td className="text-red-400 p-2 text-right font-medium">
                    Information :
                  </td>
                  <td className="p-2 font-bold text-sm">
                    {raid.additional_info}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </CardFooter>
    </Card>
  );
}
