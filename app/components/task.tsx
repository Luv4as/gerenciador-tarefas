"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc/client";
import { Pencil, Trash } from "lucide-react";
import { useState, type SubmitEvent } from "react";

type UpdatedTask = {
  id: string;
  titulo: string;
  descricao?: string;
};

type TaskProps = {
  id: string;
  title?: string;
  description?: string;
  createdAt?: Date | string;
  completed?: boolean;
  onToggle?: (completed: boolean) => void;
  onUpdated?: (task: UpdatedTask) => void;
  onDeleted?: (id: string) => void;
  onError?: (message: string) => void;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function Task({
  id,
  title = "Título",
  description = "",
  createdAt,
  completed,
  onToggle,
  onUpdated,
  onDeleted,
  onError,
}: TaskProps) {
  const [internalStatus, setInternalStatus] = useState(completed ?? false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const isCompleted = completed ?? internalStatus;
  const formattedCreatedAt = createdAt
    ? dateFormatter.format(new Date(createdAt))
    : null;

  async function handleToggle(nextCompleted: boolean) {
    setStatusError(null);
    setIsUpdatingStatus(true);

    try {
      await trpc.tarefa.atualizarStatus.mutate({
        id,
        completada: nextCompleted,
      });

      if (completed === undefined) {
        setInternalStatus(nextCompleted);
      }
      onToggle?.(nextCompleted);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao atualizar o status da tarefa.";
      if (onError) {
        onError(message);
      } else {
        setStatusError(message);
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  function handleStartEdit() {
    setEditTitle(title);
    setEditDescription(description);
    setValidationError(null);
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setValidationError(null);
    setIsEditing(false);
  }

  async function handleSaveEdit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      setValidationError("O título não pode estar vazio.");
      return;
    }

    setValidationError(null);
    setIsSaving(true);

    try {
      const updated = await trpc.tarefa.atualizar.mutate({
        id,
        titulo: trimmedTitle,
        descricao: editDescription.trim(),
      });
      setIsEditing(false);
      onUpdated?.(updated);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar tarefa.";
      setValidationError(message);
      onError?.(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await trpc.tarefa.deletar.mutate({ id });
      onDeleted?.(id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir tarefa.";
      onError?.(message);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isEditing) {
    return (
      <form
        onSubmit={handleSaveEdit}
        className="flex w-full flex-col gap-3 rounded-lg border border-[#e5e5e5] bg-[#f8f8f8] px-4 py-4"
      >
        <div className="flex flex-col gap-2">
          <div className="grid gap-1">
            <Input
              aria-label="Título da tarefa"
              aria-invalid={Boolean(validationError)}
              className="bg-white font-semibold text-black"
              disabled={isSaving}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Título da tarefa"
              type="text"
              value={editTitle}
            />
            <span className="text-right text-xs text-zinc-500">
              {editTitle.length}/100
            </span>
          </div>
          <div className="grid gap-1">
            <Textarea
              aria-label="Descrição da tarefa"
              className="resize-none bg-white text-black"
              disabled={isSaving}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Descrição (opcional)"
              rows={2}
              value={editDescription}
            />
            <span className="text-right text-xs text-zinc-500">
              {editDescription.length}/500
            </span>
          </div>
        </div>

        {validationError && (
          <p className="text-xs font-medium text-red-600">{validationError}</p>
        )}

        <div className="flex items-center justify-end gap-2">
          <Button
            disabled={isSaving}
            onClick={handleCancelEdit}
            size="sm"
            type="button"
            variant="outline"
          >
            Cancelar
          </Button>
          <Button disabled={isSaving} size="sm" type="submit">
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="w-full">
      <div
        className={`flex min-h-27 w-full items-center gap-3 rounded-lg border px-4 py-4 transition-colors duration-200 ${
          isCompleted
            ? "border-zinc-200 bg-zinc-100"
            : "border-[#f6f6f6] bg-[#f8f8f8]"
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3.25">
          <Checkbox
            aria-label={`Marcar ${title} como concluída`}
            checked={isCompleted}
            disabled={isDeleting || isUpdatingStatus}
            onCheckedChange={handleToggle}
          />
          <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-8.25">
            <h2
              className={`max-w-64 shrink-0 wrap-break-word text-2xl font-bold leading-snug transition-colors duration-200 ${
                isCompleted ? "text-zinc-500" : "text-black"
              }`}
            >
              {title}
            </h2>
            <p
              className={`min-w-0 flex-1 wrap-break-word text-sm font-normal leading-5 transition-colors duration-200 ${
                isCompleted ? "text-zinc-500" : "text-black"
              }`}
            >
              {description}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3">
          <div className="relative h-5 w-14">
            <button
              aria-label={`Editar ${title}`}
              className="absolute inset-y-0 left-0 w-5 cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              disabled={isDeleting || isUpdatingStatus}
              onClick={handleStartEdit}
              type="button"
            >
              <Pencil className="h-5 w-5 text-black" />
            </button>

            <button
              aria-label={`Excluir ${title}`}
              className="absolute inset-y-0 right-0 w-5 cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              disabled={isDeleting || isUpdatingStatus}
              onClick={handleDelete}
              type="button"
            >
              <Trash className="h-5 w-5 text-red-600" />
            </button>
          </div>

          {formattedCreatedAt && (
            <span className="whitespace-nowrap text-xs text-zinc-400">
              {formattedCreatedAt}
            </span>
          )}
        </div>
      </div>
      {statusError && !onError && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {statusError}
        </p>
      )}
    </div>
  );
}
