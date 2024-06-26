'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { List, Menu } from "lucide-react"
import Image from 'next/image'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"

export function SheetNavbar() {
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <Link href="/" className="sm:hidden">
                    <Image
                        src="/pokeball.svg"
                        width={25}
                        height={25}
                        alt="Pokeball"
                    />
                </Link>
                <SheetTrigger asChild>
                    <Button size="default_responsive" variant="default" className="sm:hidden m-4 bg-accent">
                        <Menu className="items-center mr-2 h-4 w-4" /><span className="items-center">Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                        <SheetDescription>
                        </SheetDescription>
                    </SheetHeader>
                    <nav className="grid gap-2 text-base font-medium mt-4">
                        <Button
                            className="w-full bg-accent text-secondary hover:bg-accent/60 p-1"
                            size="default_responsive"
                            variant="link"
                            onClick={() => setSheetOpen(false)}
                            asChild
                        >
                            <Link href="/pokemon">
                                <List /><span className="ml-2 text-lg">Liste des pokémons</span>
                            </Link>
                        </Button>
                    </nav>
                </SheetContent>
            </Sheet>
        </>
    )
}