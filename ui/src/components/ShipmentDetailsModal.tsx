"use client";

type Shipment = {
  id: number;
  sender: string;
  receiver: string;
  product: string;
  price: number;
  location: string;
  status: string;
  updated: string;
  txHash: string;
  outputIndex: number;
};

type Props = {
  shipment: Shipment | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ShipmentDetailsModal({
  shipment,
  isOpen,
  onClose,
}: Props) {
  if (!isOpen || !shipment) return null;

  const shortText = (value: string) =>
    value ? `${value.slice(0, 12)}...${value.slice(-8)}` : "----";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              📦 Shipment Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Complete shipment information
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-bold text-gray-600 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
          <Detail label="Product" value={shipment.product} />
          <Detail label="Price" value={`$${shipment.price}`} />
          <Detail label="Status" value={shipment.status} />
          <Detail label="Location" value={shipment.location} />
          <Detail label="Updated Time" value={shipment.updated} />
          {/* <Detail label="Output Index" value={String(shipment.outputIndex)} /> */}

          <Detail label="Sender PKH" value={shortText(shipment.sender)} full />
          <Detail label="Receiver PKH" value={shortText(shipment.receiver)} full />
          <Detail label="Transaction Hash" value={shortText(shipment.txHash)} full />

        </div>

        <div className="flex justify-end border-t px-6 py-5">
          <button
            onClick={onClose}
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p
        className={`mt-2 text-sm font-semibold text-gray-900 ${
          full ? "break-all" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}