"use client"

import React from "react"
import Link from "next/link"
import Image from 'next/image'
import { List, Gamepad2 } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function NavBar() {
    return (
        <NavigationMenu className="mx-5 p-4">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <Image
                                src="/pokeball.svg"
                                width={25}
                                height={25}
                                unoptimized
                                alt="Pokeball"
                            />
                            <span className="ml-2 text-lg">Project Poke</span>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/pokemon" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <List /><span className="ml-2 text-lg">Liste des pokémons</span>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <Gamepad2 /><span className="ml-2 text-lg">Jouer</span>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}