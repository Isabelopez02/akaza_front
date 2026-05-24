"use client";
import type { FormEvent } from "react";
import { DishForm, DishFormData } from "./DishForm";
import type { Plato, Producto } from "@/types";

type DishModalProps = {
  isOpen: boolean;
  editingDish: Plato | null;
  formData: DishFormData;
  productOptions: Producto[];
  isLoading: boolean;
  onChange: (field: keyof DishFormData, value: string | number[]) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
};

export function DishModal({
  isOpen,
  editingDish,
  formData,
  productOptions,
  isLoading,
  onChange,
  onSubmit,
  onClose,
}: DishModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[60] flex items-start justify-end p-0">
      <div className="bg-white h-full w-full md:w-1/2 max-w-3xl shadow-2xl overflow-hidden animate-in slide-in-from-right-4 duration-300">
        <DishForm
          editingDish={editingDish}
          formData={formData}
          productOptions={productOptions}
          isLoading={isLoading}
          onChange={onChange}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
