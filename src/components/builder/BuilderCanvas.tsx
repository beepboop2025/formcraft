"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFormStore } from "@/lib/store";
import FormFieldCard from "./FormFieldCard";
import { MousePointerClick } from "lucide-react";

export default function BuilderCanvas() {
  const { currentForm, reorderFields, selectField } = useFormStore();
  const fields = currentForm?.fields || [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    reorderFields(oldIndex, newIndex);
  }

  return (
    <div
      className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) selectField(null);
      }}
    >
      <div className="mx-auto max-w-xl">
        {/* Form header */}
        {currentForm && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentForm.settings.title}
            </h2>
            {currentForm.settings.description && (
              <p className="text-sm text-gray-500 mt-1">
                {currentForm.settings.description}
              </p>
            )}
          </div>
        )}

        {/* Fields */}
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-2xl bg-brand-50 p-4">
              <MousePointerClick className="h-8 w-8 text-brand-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Start building your form
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm">
              Click on field types from the left panel to add them here, or drag and drop to reorder.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {fields.map((field) => (
                  <FormFieldCard key={field.id} field={field} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Submit button preview */}
        {fields.length > 0 && (
          <div className="mt-8">
            <button
              className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: currentForm?.theme.primaryColor || "#4c6ef5" }}
              disabled
            >
              {currentForm?.settings.submitButtonText || "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
