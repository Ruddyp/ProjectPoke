import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

type DiaglogSuccessProps = {
    setCongrats: Dispatch<SetStateAction<boolean>>
}

export default function DialogSuccess({ setCongrats }: DiaglogSuccessProps) {
    const [open, setOpen] = useState(true);

    function handleClick() {
        setOpen(false);
        setCongrats(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader className="text-center">
                    <AlertDialogTitle>Bravo vous avez trouvé l&apos;identité du pokémon</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="flex flex-col items-center justify-center">
                    <Button size="default_responsive" variant="default" onClick={handleClick}>
                        <p className="mr-2">Recommencer</p><RotateCcw />
                    </Button>
                </AlertDialogDescription>
            </AlertDialogContent>
        </AlertDialog>
    )
}