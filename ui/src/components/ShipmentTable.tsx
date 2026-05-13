"use client";

import { useState } from "react";

type ShipmentStatus = "Created" | "Started" | "InTransit" | "Delivered";

type Shipment = {
  id: number;
  sender: string;
  receiver: string;
  product: string;
  price: number;
  location: string;
  status: ShipmentStatus;
  updated: string;
};

const dummyShipments: Shipment[] = [
  {
    id: 1,
    sender: "addr_test...8cqvc",
    receiver: "addr_test...05f0",
    product: "Laptop",
    price: 1200,
    location: "Colombo",
    status: "Created",
    updated: "2026-05-13 09:30 AM",
  },
  {
    id: 2,
    sender: "addr_test...c7f0",
    receiver: "addr_test...0wle3",
    product: "Mobile Phone",
    price: 850,
    location: "Kandy",
    status: "Started",
    updated: "2026-05-13 10:15 AM",
  },
  {
    id: 3,
    sender: "addr_test...9x2a",
    receiver: "addr_test...a7k9",
    product: "Smart Watch",
    price: 250,
    location: "Galle",
    status: "InTransit",
    updated: "2026-05-13 11:45 AM",
  },
  {
    id: 4,
    sender: "addr_test...4qns",
    receiver: "addr_test...77lp",
    product: "Headphones",
    price: 180,
    location: "Jaffna",
    status: "Delivered",
    updated: "2026-05-13 12:10 PM",
  },
];

export default function ShipmentTable() {
  const [shipments] = useState<Shipment[]>(dummyShipments);

  const getStatusStyle = (status: ShipmentStatus) => {
    switch (status) {
      case "Created":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Started":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "InTransit":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getButtonStyle = (type: "view" | "start" | "update" | "deliver") => {
    const base =
        "rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50";

    switch (type) {
        case "view":
        return `${base} border-blue-200 bg-blue-100 text-slate-700 hover:border-slate-300 hover:bg-blue-200`;

        case "start":
        return `${base} border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100`;

        case "update":
        return `${base} border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100`;

        case "deliver":
        return `${base} border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100`;
    }
    };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Shipment List
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Track shipment status, location, sender, receiver, and delivery
            progress.
          </p>
        </div>

        <button className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800">
          + Create Shipment
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 px-6 py-5">
          <h3 className="text-lg font-semibold text-white">
            📦 Shipment Overview
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Receiver</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {shipments.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="transition hover:bg-blue-50/40"
                >
                  <td className="px-6 py-5">
                    <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {shipment.sender}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {shipment.receiver}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="font-semibold text-gray-900">
                      {shipment.product}
                    </div>
                  </td>

                  <td className="px-6 py-5 font-semibold text-gray-800">
                    ${shipment.price.toLocaleString()}
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-gray-700">
                      {shipment.location}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        shipment.status
                      )}`}
                    >
                      {shipment.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-500">
                    {shipment.updated}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                        <button className={getButtonStyle("view")}>
                            View
                        </button>

                        <button className={getButtonStyle("start")}>
                            Start
                        </button>

                        <button className={getButtonStyle("update")}>
                            Update
                        </button>

                        <button className={getButtonStyle("deliver")}>
                            Deliver
                        </button>
                        </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 text-sm text-gray-500 md:flex-row md:items-center">
          <p>Total Shipments: {shipments.length}</p>
          <p>Powered by Aiken Smart Contracts and Mesh SDK</p>
        </div>
      </div>
    </section>
  );
}