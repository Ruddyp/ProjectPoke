'use client';

import { Generation } from "@/app/type";
import { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type GenerationFilterProps = {
    setGenerationFilter: Dispatch<SetStateAction<Generation[]>>
    generationFilter: Generation[]
}

export default function GenerationFilter({ setGenerationFilter, generationFilter }: GenerationFilterProps) {

    function handleClick(index: number) {
        const generationFilterModified = [...generationFilter];
        const isActiveValue = generationFilterModified[index].isActive
        generationFilterModified[index].isActive = !isActiveValue;
        setGenerationFilter(generationFilterModified);
    }

    return (
        <>
            <Card className="m-0.5 rounded-lg border-2 border-accent">
                <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-accent/80 p-1 m-0">
                    <CardTitle className="text-sm sm:text-base">
                        Filtrage des générations
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-1 text-xs sm:text-sm bg-background/40">
                    <div className="flex flex-row gap-1 flex-wrap items-center justify-center rounded-lg p-2">
                        {generationFilter.map((generation: Generation, index: number) => {

                            return (
                                <div key={`${generation.generation}-gen`} className={`p-1`}>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => handleClick(index)}
                                        className={`
                                            ${generation.isActive ? "bg-accent" : "bg-background"}
                                            ${generation.isActive ? "border border-green-700" : "border border-red-900/65"}
                                        `}
                                    >
                                        <p className="font-bold">{generation.generation}</p>
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}