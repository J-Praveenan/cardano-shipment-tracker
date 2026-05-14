"use client";

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {message}
          </p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-5">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            {confirmText}
          </button>

        </div>
      </div>
    </div>
  );
}