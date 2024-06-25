'use client';

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Dispatch, SetStateAction } from "react";

type SearchBarProps = {
    onChange: Dispatch<SetStateAction<string>>
    value: string
}

export default function SearchBar({ onChange, value }: SearchBarProps) {

    function handleChange(event: any) {
        onChange(event.target.value.toLowerCase());
    };

    return (
        <div className="flex flex-row items-center w-[80%] relative p-1 rounded-lg">
            <Search className="h-4 w-4 ml-2 absolute text-white" />
            <Input
                type="search"
                placeholder="Rechercher un pokémon"
                className="w-full rounded-lg bg-accent/80 pl-8 text-white h-12"
                onChange={handleChange}
                value={value}
            />
        </div>
    );
}