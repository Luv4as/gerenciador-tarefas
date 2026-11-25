"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc";

const items: { label: string; value: SortOption }[] = [
  { label: "Mais recentes", value: "date-desc" },
  { label: "Mais antigos", value: "date-asc" },
  { label: "Título (A-Z)", value: "title-asc" },
  { label: "Título (Z-A)", value: "title-desc" },
];

type FilterProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export function Filter({ value, onChange }: FilterProps) {
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onChange(nextValue);
        }
      }}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Ordenar por</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
