import { Pokemon } from "@/app/type";
import { getGen1 } from "@/lib/fetch";
import { MemoryProvider } from "@/context/MemoryProvider";
import FrontPage from "./FrontPage";

export default async function Page() {
  const pokemons: Pokemon[] = await getGen1();

  return (
    <MemoryProvider pokemons={pokemons}>
      <div className="size-full">
        <FrontPage />
      </div>
    </MemoryProvider>
  );
}
