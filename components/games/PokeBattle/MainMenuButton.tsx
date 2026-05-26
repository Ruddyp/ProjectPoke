import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type MainMenuButtonProps = {
  children: ReactNode;
  onClick: () => void;
};

export default function MainMenuButton({
  children,
  onClick,
}: MainMenuButtonProps) {
  return (
    <Button
      size={"sm"}
      variant={"ghost"}
      onClick={onClick}
      className="flex w-full h-full items-center gap-1 justify-start pl-4 hover:bg-gray-100 hover:text-black rounded border border-transparent uppercase group"
    >
      <span className="hidden group-hover:inline text-[#C83028]">▶</span>{" "}
      {children}
    </Button>
  );
}
