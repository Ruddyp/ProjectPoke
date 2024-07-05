import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { typeFilterInitValue, TypeFilterType } from "./typeFilter";

type SearchParamsHandlerProps = {
    setSearchValue: Dispatch<SetStateAction<string>>,
    setTypeFilter: Dispatch<SetStateAction<TypeFilterType>>,
    typeFilter: TypeFilterType,
    searchValue: string
}

function getActiveTypeFilter(typeFilter: TypeFilterType) {
    return Object.entries(typeFilter)
        .filter(([key, value]) => value === true)
        .map(([key, value]) => key);
}

function getTypeFilterDefaultValue(activeTypes: string | null) {
    if (activeTypes == null) {
        return typeFilterInitValue
    }

    let typefilterDefaultValue = { ...typeFilterInitValue };
    activeTypes.split(',').forEach(type => {
        if (typefilterDefaultValue.hasOwnProperty(type)) {
            typefilterDefaultValue[type as keyof TypeFilterType] = true;
        }
    });
    return typefilterDefaultValue;

}


export default function SearchParamsHandler({ setSearchValue, setTypeFilter, typeFilter, searchValue }: SearchParamsHandlerProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTypes = searchParams.get('types');
    const searchDefaultValue = searchParams.get('search') ?? "";

    useEffect(() => {
        setSearchValue(searchDefaultValue);
        setTypeFilter(getTypeFilterDefaultValue(activeTypes));
    }, [activeTypes, searchDefaultValue, setSearchValue, setTypeFilter]);

    useEffect(() => {
        const activeTypeFilters = getActiveTypeFilter(typeFilter);
        let activeTypeFilterString = "";
        for (let index = 0; index < activeTypeFilters.length; index++) {
            activeTypeFilterString += activeTypeFilters[index];
            if (index + 1 < activeTypeFilters.length) {
                activeTypeFilterString += ",";
            }
        }

        if (activeTypeFilterString === "" && searchValue === "") {
            router.push(`${pathname}`);
        } else if (activeTypeFilterString !== "" && searchValue === "") {
            router.push(`${pathname}?types=${activeTypeFilterString}`);
        } else if (activeTypeFilterString !== "" && searchValue !== "") {
            router.push(`${pathname}?search=${searchValue}&types=${activeTypeFilterString}`);
        } else if (activeTypeFilterString === "" && searchValue !== "") {
            router.push(`${pathname}?search=${searchValue}`);
        }
    }, [pathname, router, typeFilter, searchValue]);

    return null;
}