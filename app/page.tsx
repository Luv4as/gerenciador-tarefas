import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import { TaskList } from "./components/task-list";
import { serverTrpc } from "@/lib/trpc/server";

async function TasksLoader() {
  await connection();
  const tarefas = await serverTrpc.tarefa.listar();
  const tasksKey = tarefas
    .map((t) => `${t.id}:${t.titulo}:${t.descricao ?? ""}`)
    .join("|");

  return <TaskList key={tasksKey} initialTasks={tarefas} />;
}

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center py-10 px-40 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex flex-row items-center justify-center gap-2">
          <Image src="/icon.svg" alt="Logo" width={58} height={58} />
          <h1 className="text-2xl font-bold">Tarefas</h1>
        </div>
      </div>
      <main className="flex flex-1 w-full flex-col items-center py-32">
        <Suspense
          fallback={
            <p className="mt-8 text-sm text-zinc-500">Carregando tarefas...</p>
          }
        >
          <TasksLoader />
        </Suspense>
      </main>
    </div>
  );
}
