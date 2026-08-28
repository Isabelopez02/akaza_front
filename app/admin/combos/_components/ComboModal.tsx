"use client";

import type { FormEvent } from "react";
import { ComboForm, ComboFormData } from "./ComboForm";
import type { Combo, Plato } from "@/types";

type ComboModalProps = {
  isOpen: boolean;
  editingCombo: Combo | null;
  formData: ComboFormData;
  platoOptions: Plato[];
  isLoading: boolean;
  error: string | null;
  onChange: (field: keyof ComboFormData, value: string | number[]) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
};

export function ComboModal({
  isOpen,
  editingCombo,
  formData,
  platoOptions,
  isLoading,
  error,
  onChange,
  onSubmit,
  onClose,
}: ComboModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-start justify-end p-0">
      <div className="bg-white h-full w-full md:w-[460px] max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-right-4 duration-300">
        <ComboForm
          editingCombo={editingCombo}
          formData={formData}
          platoOptions={platoOptions}
          isLoading={isLoading}
          error={error}
          onChange={onChange}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
