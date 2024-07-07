"use client"

import React from "react"
import Link from "next/link"
import Image from 'next/image'
import { List, Gamepad2 } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils";

const games: { title: string; href: string; description: string }[] = [
    {
        title: "Trouve le pokémon",
        href: "/games/find_pokemon",
        description:
            "L'objectif de ce jeu est de trouver le pokémon",
    },
    {
        title: "A venir ...",
        href: "/docs/primitives/hover-card",
        description:
            "A venir soon :D",
    },
]

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
                <NavigationMenuItem className="relative">
                    <NavigationMenuTrigger className={navigationMenuTriggerStyle()}><Gamepad2 /><span className="ml-2 text-lg">Jouer</span></NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-2 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {games.map((game) => (
                                <ListItem
                                    key={game.title}
                                    title={game.title}
                                    href={game.href}
                                >
                                    {game.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}


const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"