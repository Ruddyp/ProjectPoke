'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type ComponentIndiceProps = {
    component: JSX.Element;
    title: string;
}

export default function ComponentIndice({ component, title }: ComponentIndiceProps) {
    return (
        <Card className="m-0.5 rounded-md border border-slate-500">
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                <CardTitle className="text-sm sm:text-base">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-1 text-xs sm:text-sm text-center">
                {component}
            </CardContent>
        </Card>
    )
}