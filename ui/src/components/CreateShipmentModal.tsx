"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type CreateShipmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    price: string;
    receiver: string;
    location: string;
  }) => void;
};

export default function CreateShipmentModal({
  isOpen,
  onClose,
  onCreate,
}: CreateShipmentModalProps) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    receiver: "",
    location: "",
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.receiver || !form.location) {
      toast.error("Please fill all fields");
      return;
    }

    onCreate(form);
    setForm({
      name: "",
      price: "",
      receiver: "",
      location: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">
            📦 Create Shipment
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter shipment details.
          </p>
        </div>

        <div className="space-y-4 px-6 py-6">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Price
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price in USD"
              className="mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Receiver Address
            </label>
            <input
              name="receiver"
              value={form.receiver}
              onChange={handleChange}
              placeholder="addr_test..."
              className="mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Initial Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter a current location of product"
              className="mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-5">
          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Create Shipment
          </button>
        </div>
      </div>
    </div>
  );
}