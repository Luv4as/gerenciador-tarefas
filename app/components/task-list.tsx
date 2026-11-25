"use client";

import { toast } from "@/components/ui/toast";
import type { Tarefa } from "@/server/db";
import { useState } from "react";
import Task from "./task";

type TaskListProps = {
  initialTasks: Tarefa[];
};

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Tarefa[]>(initialTasks);

  function handleUpdated(updated: {
    id: string;
    titulo: string;
    descricao?: string;
  }) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updated.id
          ? { ...task, titulo: updated.titulo, descricao: updated.descricao }
          : task
      )
    );
    toast.add({
      title: "Tarefa atualizada com sucesso!",
      type: "success",
    });
  }

  function handleDeleted(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast.add({
      title: "Tarefa excluída com sucesso!",
      type: "success",
    });
  }

  function handleError(message: string) {
    toast.add({
      title: "Erro na operação",
      description: message,
      type: "error",
    });
  }

  if (tasks.length === 0) {
    return (
      <p className="mt-8 text-sm text-zinc-500">
        Nenhuma tarefa cadastrada.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 mt-8">
      {tasks.map((tarefa) => (
        <Task
          key={tarefa.id}
          id={tarefa.id}
          title={tarefa.titulo}
          description={tarefa.descricao ?? ""}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
          onError={handleError}
        />
      ))}
    </div>
  );
}
