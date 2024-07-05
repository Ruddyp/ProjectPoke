'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { title } from "process";

type TextIndiceProps = {
    text: string;
    title: string;
}

export default function TextIndice({ text, title }: TextIndiceProps) {
    return (
        <Card className="m-0.5 rounded-md border border-slate-500">
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                <CardTitle className="text-sm sm:text-base">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-1 text-xs sm:text-sm text-center">
                {text}
            </CardContent>
        </Card>
    )
}