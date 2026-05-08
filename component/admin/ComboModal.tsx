"use client";
import type { FormEvent } from "react";
import { Combo } from "@/ts/types";
import { ComboForm, ComboFormData } from "./ComboForm";

type ComboModalProps = {
  isOpen: boolean;
  editingCombo: Combo | null;
  formData: ComboFormData;
  isLoading: boolean;
  error: string | null;
  onChange: (field: keyof ComboFormData, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
};

export function ComboModal({
  isOpen,
  editingCombo,
  formData,
  isLoading,
  error,
  onChange,
  onSubmit,
  onClose,
}: ComboModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <ComboForm
          editingCombo={editingCombo}
          formData={formData}
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
