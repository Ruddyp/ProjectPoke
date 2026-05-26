import { Dispatch, SetStateAction } from "react";
import MainMenuButton from "./MainMenuButton";

type MainMenuProps = {
  setCurrentMenu: Dispatch<SetStateAction<CurrentMenuType>>;
};

type CurrentMenuType = "main" | "moves" | "pokemon" | "object" | "retreat";

export default function MainMenu({ setCurrentMenu }: MainMenuProps) {
  return (
    <div className="grid grid-cols-2 gap-1 size-full">
      <MainMenuButton onClick={() => setCurrentMenu("moves")}>
        ATTAQUE
      </MainMenuButton>
      <MainMenuButton onClick={() => setCurrentMenu("object")}>
        SAC
      </MainMenuButton>
      <MainMenuButton onClick={() => setCurrentMenu("pokemon")}>
        POKéMON
      </MainMenuButton>
      <MainMenuButton onClick={() => setCurrentMenu("retreat")}>
        FUITE
      </MainMenuButton>
    </div>
  );
}
