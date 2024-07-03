'use client'

import { PoGoApiEvolution } from '@/app/type'
import { lureToFrench } from '@/lib/utils';
import Image from 'next/image'

type EvolConditionTableProps = {
    evol: PoGoApiEvolution;
}

export default function EvolConditionTable({ evol }: EvolConditionTableProps) {

    return (
        <table className="w-full table-auto">
            <thead>
            </thead>
            <tbody>
                <tr>
                    <td className="text-red-400 p-2 text-right font-medium">Bonbons</td>
                    <td className="p-2">
                        <div className="flex flex-row gap-1.5 items-center">
                            <p className="font-bold">
                                {evol.candy_required}
                            </p>
                            <div className={`relative size-5 sm:size-6`}>
                                <Image
                                    src={"/Sprite_Super_Bonbon_GO.png"}
                                    alt={"Candy"}
                                    fill
                                    className="rounded-full object-cover"
                                    unoptimized
                                />
                            </div>
                        </div>
                    </td>
                </tr>
                {evol.gender_required != undefined ?
                    <tr>
                        <td className="text-red-400 p-2 text-right font-medium">Genre requis</td>
                        <td className="p-2">{evol.gender_required}</td>
                    </tr>
                    : null
                }
                {evol.buddy_distance_required != undefined ?
                    <tr>
                        <td className="text-red-400 p-2 text-right font-medium">Distance copain requis</td>
                        <td className="p-2">{evol.buddy_distance_required} km</td>
                    </tr>
                    : null
                }
                {evol.item_required != undefined ?
                    <tr>
                        <td className="text-red-400 p-2 text-right font-medium">Objet requis</td>
                        <td className="p-2">{evol.item_required}</td>
                    </tr>
                    : null
                }
                {evol.lure_required != undefined ?
                    <tr>
                        <td className="text-red-400 p-2 text-nowrap text-right font-medium">Leurre requis</td>
                        <td className="p-2">{lureToFrench(evol.lure_required)}</td>
                    </tr>
                    : null
                }
                {evol.must_be_buddy_to_evolve != undefined ?
                    <tr>
                        <td className="text-red-400 p-2 text-right font-medium">Doit être copain</td>
                        <td className="p-2">{evol.must_be_buddy_to_evolve ? "Oui" : "Non"}</td>
                    </tr>
                    : null
                }
                {evol.only_evolves_in_daytime != undefined ?
                    <tr>
                        <td className="text-red-400 p-2 text-right font-medium">Évolue de jour</td>
                        <td className="p-2">{evol.only_evolves_in_daytime ? "Oui" : "Non"}</td>
                    </tr>
                    : null
                }
                {evol.only_evolves_in_nighttime != undefined ?
                    <tr>
                        <td className="text-red-400 p-2 text-right font-medium">Évolue de nuit</td>
                        <td className="p-2">{evol.only_evolves_in_nighttime ? "Oui" : "Non"}</td>
                    </tr>
                    : null
                }
                {evol.no_candy_cost_if_traded != undefined ?
                    <tr>
                        <td className="text-red-400 p-2 text-right font-medium">Gratuit après échange</td>
                        <td className="p-2">{evol.no_candy_cost_if_traded ? "Oui" : "Non"}</td>
                    </tr>
                    : null
                }
            </tbody>
        </table>
    )
}