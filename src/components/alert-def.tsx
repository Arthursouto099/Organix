import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Newspaper } from "lucide-react";



interface propsAlert {
    clickContinue: () => void
    title: string;
    content: string
    h1: string

}

export function AlertDialogDef({ clickContinue, title, content, h1}: propsAlert) {

    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="w-[100%] text-sm flex items-center justify-between gap-1">
                    <h1 >{h1}</h1>
                    <Newspaper className="h-4" ></Newspaper>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {content}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clickContinue}>Continue</AlertDialogAction>
                    
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
