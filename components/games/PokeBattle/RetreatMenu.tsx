import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { sleep } from "@/lib/utils";

type RetreatMenuProps = {
  setCurrentMenu: Dispatch<SetStateAction<CurrentMenuType>>;
};

type CurrentMenuType = "main" | "moves" | "pokemon" | "object" | "retreat";

export default function RetreatMenu({ setCurrentMenu }: RetreatMenuProps) {
  const { goToWaitingScreen, setTextBox } = usePokeBattle();

  async function handleRetreat() {
    setTextBox("Vous prenez la fuite !");
    await sleep(3000);
    goToWaitingScreen();
  }

  return (
    <div className="size-full flex flex-row items-center justify-around">
      <p>Voulez vous vraiment prendre la fuite ? </p>
      <div className="flex flex-row gap-2 sm:gap-4">
        <Button
          size={"sm"}
          variant={"ghost"}
          onClick={async () => await handleRetreat()}
          className="flex items-center gap-1 justify-center hover:bg-gray-100 hover:text-black rounded border text-xs uppercase group w-16"
        >
          <div>
            <span className="hidden group-hover:inline text-[#C83028]">▶</span>{" "}
            Oui
          </div>
        </Button>
        <Button
          size={"sm"}
          variant={"ghost"}
          onClick={() => setCurrentMenu("main")}
          className="flex items-center gap-1 justify-center  hover:bg-gray-100 hover:text-black rounded border text-xs uppercase group w-16"
        >
          <div>
            <span className="hidden group-hover:inline text-[#C83028]">▶</span>{" "}
            Non
          </div>
        </Button>
      </div>
    </div>
  );
}
