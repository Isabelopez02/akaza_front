"use client";
import { DishForm, DishFormData } from "./DishForm";
import type { Plato } from "@/ts/types";

type DishModalProps = {
  isOpen: boolean;
  editingDish: Plato | null;
  formData: DishFormData;
  isLoading: boolean;
  onChange: (field: keyof DishFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
};

export function DishModal({
  isOpen,
  editingDish,
  formData,
  isLoading,
  onChange,
  onSubmit,
  onClose,
}: DishModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <DishForm
          editingDish={editingDish}
          formData={formData}
          isLoading={isLoading}
          onChange={onChange}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
