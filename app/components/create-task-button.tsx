"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";

type CreatedTask = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: string | Date;
};

type CreateTaskButtonProps = {
  onCreated?: (task: CreatedTask) => void;
};

export function CreateTaskButton({ onCreated }: CreateTaskButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTitulo("");
      setDescricao("");
      setValidationError(null);
    }
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedTitle = titulo.trim();
    const trimmedDescription = descricao.trim();

    if (!trimmedTitle) {
      setValidationError("O título é obrigatório.");
      return;
    }

    if (trimmedTitle.length > 100) {
      setValidationError("O título pode ter no máximo 100 caracteres.");
      return;
    }

    if (trimmedDescription.length > 500) {
      setValidationError("A descrição pode ter no máximo 500 caracteres.");
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      const created = await trpc.tarefa.criar.mutate({
        titulo: trimmedTitle,
        descricao: trimmedDescription || undefined,
      });

      toast.add({
        title: "Tarefa criada com sucesso!",
        type: "success",
      });

      onCreated?.(created);
      handleOpenChange(false);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar tarefa.";
      setValidationError(message);
      toast.add({
        title: "Erro ao criar tarefa",
        description: message,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button>Criar tarefa</Button>} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova tarefa</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar uma nova tarefa.
          </DialogDescription>
        </DialogHeader>

        <form id="create-task-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <label htmlFor="task-title" className="text-sm font-medium">
              Título <span className="text-red-600">*</span>
            </label>
            <Input
              id="task-title"
              aria-invalid={Boolean(validationError)}
              disabled={isSubmitting}
              maxLength={100}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título da tarefa"
              type="text"
              value={titulo}
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="task-description" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="task-description"
              className="resize-none"
              disabled={isSubmitting}
              maxLength={500}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição opcional da tarefa"
              rows={3}
              value={descricao}
            />
          </div>

          {validationError && (
            <p className="text-xs font-medium text-red-600">
              {validationError}
            </p>
          )}

          <DialogFooter>
            <Button
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancelar
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Criando..." : "Criar tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
