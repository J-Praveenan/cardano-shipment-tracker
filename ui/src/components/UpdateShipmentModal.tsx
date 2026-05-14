"use client";

import { useState } from "react";

type Props = {
  isOpen: boolean;
  shipment: any;
  onClose: () => void;
  onConfirm: (location: string) => void;
};

export default function UpdateShipmentModal({
  isOpen,
  shipment,
  onClose,
  onConfirm,
}: Props) {
  const [location, setLocation] = useState("");

  if (!isOpen || !shipment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">
            Update Shipment
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Update location for{" "}
            <span className="font-semibold text-black">
              {shipment.product}
            </span>
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              New Location
            </label>

            <input
              type="text"
              placeholder="Enter new location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 px-6 py-5">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(location)}
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Update Shipment
          </button>

        </div>
      </div>
    </div>
  );
}