"use client";

import { toast } from "@/components/ui/toast";
import type { Tarefa } from "@/server/db";
import { useEffect, useRef, useState } from "react";
import { CreateTaskButton } from "./create-task-button";
import { Filter, type SortOption } from "./filter";
import Task from "./task";

type TaskListProps = {
  initialTasks: Tarefa[];
};

const TASKS_PER_PAGE = 10;

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Tarefa[]>(initialTasks);
  const [sortOrder, setSortOrder] = useState<SortOption>("date-desc");
  const [visibleCount, setVisibleCount] = useState(TASKS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  function handleCreated(created: {
    id: string;
    titulo: string;
    descricao?: string;
    dataCriacao: string | Date;
  }) {
    setTasks((prev) => [
      ...prev,
      {
        id: created.id,
        titulo: created.titulo,
        descricao: created.descricao,
        completada: false,
        dataCriacao: new Date(created.dataCriacao),
      },
    ]);
  }

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

  function handleStatusUpdated(id: string, completada: boolean) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completada } : task
      )
    );
    toast.add({
      title: "Status da tarefa atualizado com sucesso!",
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

  function handleSortChange(nextSortOrder: SortOption) {
    setSortOrder(nextSortOrder);
    setVisibleCount(TASKS_PER_PAGE);
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOrder === "date-desc") {
      return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
    }
    if (sortOrder === "date-asc") {
      return new Date(a.dataCriacao).getTime() - new Date(b.dataCriacao).getTime();
    }
    if (sortOrder === "title-desc") {
      return b.titulo.localeCompare(a.titulo, "pt-BR", { sensitivity: "base" });
    }
    return a.titulo.localeCompare(b.titulo, "pt-BR", { sensitivity: "base" });
  });

  const visibleTasks = sortedTasks.slice(0, visibleCount);
  const hasMoreTasks = visibleCount < sortedTasks.length;

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMoreTasks) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((currentCount) =>
            Math.min(currentCount + TASKS_PER_PAGE, sortedTasks.length)
          );
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreTasks, sortedTasks.length]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between w-full">
        <CreateTaskButton onCreated={handleCreated} />
        <Filter value={sortOrder} onChange={handleSortChange} />
      </div>

      {sortedTasks.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          Nenhuma tarefa cadastrada.
        </p>
      ) : (
        <div className="flex flex-col items-center justify-center w-full gap-4 mt-8">
          {visibleTasks.map((tarefa) => (
            <Task
              key={tarefa.id}
              id={tarefa.id}
              title={tarefa.titulo}
              description={tarefa.descricao ?? ""}
              createdAt={tarefa.dataCriacao}
              completed={tarefa.completada}
              onToggle={(completada) =>
                handleStatusUpdated(tarefa.id, completada)
              }
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
              onError={handleError}
            />
          ))}
          {hasMoreTasks && (
            <div
              aria-hidden="true"
              className="h-px w-full"
              ref={loadMoreRef}
            />
          )}
        </div>
      )}
    </div>
  );
}
