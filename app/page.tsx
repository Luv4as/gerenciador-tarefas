'use client'

// import Image from "next/image";
import Task from "./components/task";
import { Filter } from "./components/filter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center py-10 px-40 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          {/* <Image src="" alt="Logo" width={100} height={100} /> */}
          <h1 className="text-2xl font-bold">Tarefas</h1>
        </div>
      </div>
      <main className="flex flex-1 w-full flex-col items-center py-32">
        <div className="flex flex-row items-center justify-between w-full">
          <Button
            onClick={() => {

            }}
          >Criar tarefa</Button>
          <Filter></Filter>
        </div>
        <div className="flex flex-col items-center justify-center w-full gap-4 mt-8">
          <Task></Task>
        </div>
      </main>
    </div>
  );
}
