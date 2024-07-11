'use client';

import Image from 'next/image'
import { Dispatch, SetStateAction } from "react";
import { raidTiers } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { getTierInfo } from './raidCard';

type RaidFilterProps = {
    setRaidFilter: Dispatch<SetStateAction<RaidFilterType>>
    raidFilter: RaidFilterType
}

export type RaidFilterType = {
    normal: boolean;
    normal_shadow: boolean;
    rare: boolean,
    rare_shadow: boolean,
    legendary: boolean,
    legendary_shadow: boolean,
    mega: boolean,
    mega_shadow: boolean,
    ultra: boolean,
    ultra_shadow: boolean,
    mega_legendary: boolean,
    mega_legendary_shadow: boolean,
    primal: boolean,
    primal_shadow: boolean,
    elite: boolean,
    elite_shadow: boolean,
    raid_4: boolean,
    raid_4_shadow: boolean,
}

export const raidFilterInitValue: RaidFilterType = {
    normal: false,
    normal_shadow: false,
    rare: false,
    rare_shadow: false,
    legendary: false,
    legendary_shadow: false,
    mega: false,
    mega_shadow: false,
    ultra: false,
    ultra_shadow: false,
    mega_legendary: false,
    mega_legendary_shadow: false,
    primal: false,
    primal_shadow: false,
    elite: false,
    elite_shadow: false,
    raid_4: false,
    raid_4_shadow: false,
}

function isRaidActive(tier: string, raidFilter: RaidFilterType) {
    return raidFilter[tier as keyof RaidFilterType]
}

export default function RaidFilter({ setRaidFilter, raidFilter }: RaidFilterProps) {
    return (
        <Card className="m-0.5 rounded-lg border-2 border-accent">
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-accent/80 p-1 m-0">
                <CardTitle className="text-sm sm:text-base">
                    Filtrage par niveau de raid
                </CardTitle>
            </CardHeader>
            <CardContent className="p-1 text-xs sm:text-sm bg-background/40">
                <div className="flex flex-row gap-1 flex-wrap items-center justify-center rounded-lg p-2">
                    {raidTiers.map((tier: string, index: number) => {
                        const tierInfo = getTierInfo(tier);
                        const state = raidFilter[tierInfo.filter as keyof RaidFilterType];
                        const bgColor = isRaidActive(tierInfo.filter, raidFilter) ? `#33729b` : "#42496c";
                        const outlineColor = isRaidActive(tierInfo.filter, raidFilter) ? "#cbd5e1" : "#64748b";
                        return (
                            <div key={`${tier}-raid_filter-${index}`} className="p-1">
                                <TooltipProvider delayDuration={200}>
                                    <Tooltip>
                                        <TooltipTrigger onClick={() => setRaidFilter({
                                            ...raidFilter,
                                            [tierInfo.filter]: !state
                                        })}>
                                            <div className={`relative size-8 sm:size-10 rounded-md outline outline-offset-0`} style={{ backgroundColor: bgColor, outlineColor: outlineColor }}>
                                                <Image
                                                    src={tierInfo.image}
                                                    alt={tierInfo.frenchName}
                                                    fill
                                                    sizes="(max-width: 640px) 32px, 48px"
                                                    className="rounded-full object-cover p-1"
                                                    unoptimized
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{tierInfo.frenchName}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}