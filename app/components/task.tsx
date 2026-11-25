"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type TaskProps = {
    title?: string;
    description?: string;
    completed?: boolean;
    onToggle?: (completed: boolean) => void;
    onEdit?: () => void;
    onDelete?: () => void;
};

export default function Task({
    title = "Título",
    description = "Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    completed,
    onToggle,
    onEdit,
    onDelete,
}: TaskProps) {
    const [internalCompleted, setInternalCompleted] = useState(completed ?? false);
    const isCompleted = completed ?? internalCompleted;

    function handleToggle(nextCompleted: boolean) {
        if (completed === undefined) {
            setInternalCompleted(nextCompleted);
        }
        onToggle?.(nextCompleted);
    }

    return (
        <div className="flex min-h-27 w-full max-w-211.75 items-center gap-3 rounded-[8px] border border-[#f6f6f6] bg-[#f8f8f8] px-4 py-4 sm:gap-6 md:gap-14.25 md:pl-6.75 md:pr-5.25">
            <div className="flex min-w-0 flex-1 items-center gap-3.25">
                <Checkbox
                    aria-label={`Marcar ${title} como concluída`}
                    checked={isCompleted}
                    onCheckedChange={handleToggle}
                />
                <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-8.25">
                    <h2 className="shrink-0 whitespace-nowrap text-[20px] font-bold leading-5 text-black">
                        {title}
                    </h2>
                    <p className="min-w-0 flex-1 text-[14px] font-normal leading-5 text-black">
                        {description}
                    </p>
                </div>
            </div>
            <div className="relative h-5 w-14 shrink-0">
                <button
                    aria-label={`Editar ${title}`}
                    className="absolute inset-y-0 left-0 w-5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    onClick={onEdit}
                    type="button">
                    <Pencil className="h-5 w-5 text-black" />
                </button>

                <button
                    aria-label={`Excluir ${title}`}
                    className="absolute inset-y-0 right-0 w-5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    onClick={onDelete}
                    type="button">
                    <Trash className="h-5 w-5 text-red-600" />
                </button>
            </div>
        </div>
    );
}