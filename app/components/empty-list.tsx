import { FolderPlusIcon } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CreateTaskButton, type CreatedTask } from "./create-task-button"

type EmptyListProps = {
  onCreated: (task: CreatedTask) => void;
};

export function EmptyList({ onCreated }: EmptyListProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderPlusIcon />
        </EmptyMedia>
        <EmptyTitle>Sem tarefas cadastradas</EmptyTitle>
        <EmptyDescription>
          Crie novas tarefas e organize suas necessidades.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <CreateTaskButton onCreated={onCreated} />
      </EmptyContent>
    </Empty>
  )
}
