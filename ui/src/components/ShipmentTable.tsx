"use client";

import { useEffect, useState } from "react";
import CreateShipmentModal from "./CreateShipmentModal";
import { conStr, byteString, integer, stringToHex, resolvePaymentKeyHash,deserializeDatum, hexToString } from "@meshsdk/core";
import { useWallet, useAddress } from "@meshsdk/react";
import { provider, txBuilder } from "@/config/mesh";
import { scriptAddress,scriptCbor } from "@/config/contract";
import ShipmentTableSkeleton from "./ShipmentTableSkeleton";
import ShipmentDetailsModal from "./ShipmentDetailsModal";
import ConfirmationModal from "./ConfirmationModal";
import UpdateShipmentModal from "./UpdateShipmentModal";
import toast from "react-hot-toast";

type ShipmentStatus = "Created" | "Started" | "InTransit" | "Delivered" | "Unknown";

type Shipment = {
  id: number;
  sender: string;
  receiver: string;
  product: string;
  price: number;
  location: string;
  status: ShipmentStatus;
  updated: string;
  txHash: string;
  outputIndex: number;
};


export default function ShipmentTable() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openStartModal, setOpenStartModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeliverModal, setOpenDeliverModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { wallet, connected } = useWallet();
  const address = useAddress();

    const getStatusName = (status: any) => {
        const statusIndex =
            status?.constructor !== undefined
            ? Number(status.constructor)
            : Number(status?.int);

        if (statusIndex === 0) return "Created";
        if (statusIndex === 1) return "Started";
        if (statusIndex === 2) return "InTransit";
        if (statusIndex === 3) return "Delivered";

        return "Unknown";
    };

    const shortAddress = (hash: string) => {
        if (!hash) return "----";
        return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    };

    const formatTime = (timestamp: number) => {
        if (!timestamp) return "----";
        return new Date(timestamp * 1000).toLocaleString();
    };

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
            return `${base} border-blue-200 bg-blue-100 text-slate-700 hover:border-blue-300 hover:bg-blue-200`;

            case "start":
            return `${base} border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100`;

            case "update":
            return `${base} border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100`;

            case "deliver":
            return `${base} border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100`;
        }
    };

    const isStartDisabled = (status: ShipmentStatus) => {
      return status !== "Created";
    };

    const isUpdateDisabled = (status: ShipmentStatus) => {
      return status !== "Started" && status !== "InTransit";
    };

    const isDeliverDisabled = (status: ShipmentStatus) => {
      return status !== "InTransit";
    };

    const fetchShipments = async () => {
        try {
            setLoading(true);

            const utxos = await provider.fetchAddressUTxOs(scriptAddress);

            const shipmentList: Shipment[] = [];

            for (const utxo of utxos) {
            const datum = utxo.output.plutusData;

            if (!datum) continue;

            try {
                const decoded: any = deserializeDatum(datum);

                const sender = decoded.fields[0];
                const receiver = decoded.fields[1];
                const name = decoded.fields[2];
                const price = decoded.fields[3];
                const status = decoded.fields[4];
                const location = decoded.fields[5];
                const updated = decoded.fields[6];

                const senderPkh = sender.fields[0].bytes;
                const receiverPkh = receiver.fields[0].bytes;

                shipmentList.push({
                id: shipmentList.length + 1,

                sender: senderPkh,
                receiver: receiverPkh,

                product: hexToString(name.bytes),
                price: Number(price.int),

                location: hexToString(location.bytes),

                status: getStatusName(status),

                updated: formatTime(Number(updated.int)),

                txHash: utxo.input.txHash,
                outputIndex: utxo.input.outputIndex,
                });
            } catch (error) {
                console.error("Datum decode error:", error);
            }
            }

            setShipments(shipmentList);
        } catch (error) {
            console.error("Fetch shipment error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateShipment = async (data: {
        name: string;
        price: string;
        receiver: string;
        location: string;
    }) => {
        try {
            if (!connected || !wallet || !address) {
                toast.error("Connect wallet first");
                return;
            }

            if (!data.name || !data.price || !data.receiver || !data.location) {
                toast.error("Please fill all fields");
                return;
            }

            const utxos = await wallet.getUtxos();
            const changeAddress = await wallet.getChangeAddress();

            const senderPkh = resolvePaymentKeyHash(address);
            const receiverPkh = resolvePaymentKeyHash(data.receiver);

            const nameHex = stringToHex(data.name);
            const locationHex = stringToHex(data.location);

            const price = Math.floor(Number(data.price));
            const updatedTime = Math.floor(Date.now() / 1000);

            const datum = conStr(0, [
                conStr(0, [byteString(senderPkh)]), // sender credential
                conStr(0, [byteString(receiverPkh)]), // receiver credential
                byteString(nameHex), // product name
                integer(price), // price
                conStr(0, []), // Created status
                byteString(locationHex), // location
                integer(updatedTime), // updated time
            ]);

            const unsignedTx = await txBuilder
                .txOut(scriptAddress, [
                    {
                    unit: "lovelace",
                    quantity: "3000000",
                    },
                ])
                .txOutInlineDatumValue(datum, "JSON")
                .changeAddress(changeAddress)
                .selectUtxosFrom(utxos)
                .complete();

            const signedTx = await wallet.signTx(unsignedTx);
            const txHash = await wallet.submitTx(signedTx);

            toast.success("Shipment created successfully");

            setTimeout(() => {
            fetchShipments();
            }, 15000);
        } catch (error) {
            console.error("Create shipment error:", error);
            toast.error("Create shipment failed");
        }
    };

    const handleStartShipment = async (shipment: Shipment) => {
      try {
        if (!connected || !wallet || !address) {
          toast.error("Connect wallet first");
          return;
        }

        const scriptUtxos = await provider.fetchAddressUTxOs(
          scriptAddress
        );

        const targetUtxo = scriptUtxos.find(
          (utxo: any) =>
            utxo.input.txHash === shipment.txHash &&
            utxo.input.outputIndex === shipment.outputIndex
        );

        if (!targetUtxo) {
          toast.error("Shipment UTXO not found");
          return;
        }

        const datum = targetUtxo.output.plutusData;

        if (!datum) {
          toast.error("Datum not found");
          return;
        }

        const decoded: any = deserializeDatum(datum);

        const sender = decoded.fields[0];
        const receiver = decoded.fields[1];
        const name = decoded.fields[2];
        const price = decoded.fields[3];
        const location = decoded.fields[5];

        const currentWalletPkh = resolvePaymentKeyHash(address);

        const senderPkh = sender.fields[0].bytes;

        if (currentWalletPkh !== senderPkh) {
          toast.error("Only sender can start shipment");
          return;
        }

        // New datum -> Started
        const newDatum = conStr(0, [
          sender,
          receiver,
          name,
          price,
          conStr(1, []), // Started
          location,
          integer(Math.floor(Date.now() / 1000)),
        ]);

        // Redeemer -> Start
        const redeemer = conStr(1, []);

        const walletUtxos = await wallet.getUtxos();

        const collateral = await wallet.getCollateral();

        const changeAddress =
          await wallet.getChangeAddress();

        if (!collateral || collateral.length === 0) {
          toast.error("No collateral found");
          return;
        }

        const unsignedTx = await txBuilder
          .spendingPlutusScriptV3()
          .txIn(
            targetUtxo.input.txHash,
            targetUtxo.input.outputIndex
          )
          .txInInlineDatumPresent()
          .txInRedeemerValue(redeemer, "JSON")
          .txInScript(scriptCbor)
          .requiredSignerHash(senderPkh)
          .txInCollateral(
            collateral[0].input.txHash,
            collateral[0].input.outputIndex,
            collateral[0].output.amount,
            collateral[0].output.address
          )

          // recreate script output
          .txOut(
            scriptAddress,
            targetUtxo.output.amount
          )
          .txOutInlineDatumValue(newDatum, "JSON")
          .changeAddress(changeAddress)
          .selectUtxosFrom(walletUtxos)
          .complete();

        const signedTx = await wallet.signTx(
          unsignedTx,
          true
        );

        const txHash = await wallet.submitTx(
          signedTx
        );

        toast.success("Shipment Started successfully.");

        setTimeout(async () => {
          await fetchShipments();
        }, 15000);

      } catch (error) {
        console.error("Start shipment error:", error);
        toast.error("Start shipment failed");
      }
    };

    const handleUpdateShipment = async (
      shipment: Shipment,
      newLocation: string
    ) => {
      try {
        if (!connected || !wallet || !address) {
          toast.error("Connect wallet first");
          return;
        }

        if (!newLocation.trim()) {
          toast.error("Enter new location");
          return;
        }

        const scriptUtxos = await provider.fetchAddressUTxOs(scriptAddress);

        const targetUtxo = scriptUtxos.find(
          (utxo: any) =>
            utxo.input.txHash === shipment.txHash &&
            utxo.input.outputIndex === shipment.outputIndex
        );

        if (!targetUtxo) {
          toast.error("Shipment UTXO not found");
          return;
        }

        const datum = targetUtxo.output.plutusData;

        if (!datum) {
          toast.error("Datum not found");
          return;
        }

        const decoded: any = deserializeDatum(datum);

        const sender = decoded.fields[0];
        const receiver = decoded.fields[1];
        const name = decoded.fields[2];
        const price = decoded.fields[3];

        const senderPkh = sender.fields[0].bytes;
        const currentWalletPkh = resolvePaymentKeyHash(address);

        if (currentWalletPkh !== senderPkh) {
          toast.error("Only sender can update shipment");
          return;
        }

        const newLocationHex = stringToHex(newLocation);
        const newTime = Math.floor(Date.now() / 1000);

        const newDatum = conStr(0, [
          sender,
          receiver,
          name,
          price,
          conStr(2, []), // InTransit
          byteString(newLocationHex),
          integer(newTime),
        ]);

        const redeemer = conStr(2, [
          byteString(newLocationHex),
          integer(newTime),
        ]);

        const walletUtxos = await wallet.getUtxos();
        const collateral = await wallet.getCollateral();
        const changeAddress = await wallet.getChangeAddress();

        if (!collateral || collateral.length === 0) {
          toast.error("No collateral found");
          return;
        }

        const unsignedTx = await txBuilder
          .spendingPlutusScriptV3()
          .txIn(
            targetUtxo.input.txHash,
            targetUtxo.input.outputIndex
          )
          .txInInlineDatumPresent()
          .txInRedeemerValue(redeemer, "JSON")
          .txInScript(scriptCbor)
          .requiredSignerHash(senderPkh)
          .txInCollateral(
            collateral[0].input.txHash,
            collateral[0].input.outputIndex,
            collateral[0].output.amount,
            collateral[0].output.address
          )
          .txOut(scriptAddress, targetUtxo.output.amount)
          .txOutInlineDatumValue(newDatum, "JSON")
          .changeAddress(changeAddress)
          .selectUtxosFrom(walletUtxos)
          .complete();

        const signedTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);

        toast.success("Shipment Updated successfully.");

        setTimeout(async () => {
          await fetchShipments();
        }, 15000);
      } catch (error) {
        console.error("Update shipment error:", error);
        toast.error("Update shipment failed");
      }
    };

    const handleDeliverShipment = async (
      shipment: Shipment
    ) => {

      try {

        if (!connected || !wallet || !address) {
          toast.error("Connect wallet first");
          return;
        }

        const scriptUtxos = await provider.fetchAddressUTxOs(scriptAddress);

        const targetUtxo = scriptUtxos.find(
          (utxo: any) =>
            utxo.input.txHash === shipment.txHash &&
            utxo.input.outputIndex === shipment.outputIndex
        );

        if (!targetUtxo) {
          toast.error("Shipment UTXO not found");
          return;
        }

        const datum = targetUtxo.output.plutusData;

        if (!datum) {
          toast.error("Datum not found");
          return;
        }

        const decoded: any = deserializeDatum(datum);

        const sender = decoded.fields[0];
        const receiver = decoded.fields[1];
        const name = decoded.fields[2];
        const price = decoded.fields[3];
        const location = decoded.fields[5];

        const senderPkh = sender.fields[0].bytes;

        const currentWalletPkh = resolvePaymentKeyHash(address);

        if (currentWalletPkh !== senderPkh) {
          toast.error("Only sender can deliver shipment");
          return;
        }

        const updatedTime = Math.floor(Date.now() / 1000);

        const newDatum = conStr(0, [
          sender,
          receiver,
          name,
          price,
          conStr(3, []), // Delivered
          location,
          integer(updatedTime),
        ]);

        const redeemer = conStr(3, []); // Deliver

        const walletUtxos = await wallet.getUtxos();

        const collateral = await wallet.getCollateral();

        const changeAddress = await wallet.getChangeAddress();

        if (!collateral || collateral.length === 0) {
          toast.error("Collateral not found");
          return;
        }

        const unsignedTx = await txBuilder
          .spendingPlutusScriptV3()
          .txIn(
            targetUtxo.input.txHash,
            targetUtxo.input.outputIndex
          )
          .txInInlineDatumPresent()
          .txInRedeemerValue(redeemer, "JSON")
          .txInScript(scriptCbor)
          .requiredSignerHash(senderPkh)
          .txInCollateral(
            collateral[0].input.txHash,
            collateral[0].input.outputIndex,
            collateral[0].output.amount,
            collateral[0].output.address
          )
          .txOut(scriptAddress, targetUtxo.output.amount)
          .txOutInlineDatumValue(newDatum, "JSON")
          .changeAddress(changeAddress)
          .selectUtxosFrom(walletUtxos)
          .complete();

        const signedTx = await wallet.signTx(unsignedTx, true);

        const txHash = await wallet.submitTx(signedTx);
        toast.success("Shipment Delivered successfully.");

        setTimeout(async () => {
          await fetchShipments();
        }, 15000);

      } catch (error) {
        console.error("Deliver shipment error:", error);
        toast.error("Deliver shipment failed");
      }
    };

    const filteredShipments = shipments.filter((shipment) => {
      const search = searchTerm.toLowerCase();

      return (
        shipment.product.toLowerCase().includes(search) ||
        shipment.location.toLowerCase().includes(search) ||
        shipment.status.toLowerCase().includes(search) ||
        shipment.sender.toLowerCase().includes(search) ||
        shipment.receiver.toLowerCase().includes(search)
      );
    });

    useEffect(() => {
        fetchShipments();
    }, []);

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

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:w-[320px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="⌕ search by product, location, status"
              className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="flex items-center justify-between gap-4">

            <p className="text-sm text-gray-500 whitespace-nowrap">
              Showing {filteredShipments.length} of {shipments.length} shipments
            </p>

          </div>
        </div>

        <button  onClick={() => setOpenCreateModal(true)} className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800">
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
                <th className="px-6 py-4 text-center">Sender</th>
                <th className="px-6 py-4 text-center">Receiver</th>
                <th className="px-6 py-4 text-center">Product</th>
                <th className="px-6 py-4 text-center">Price</th>
                <th className="px-6 py-4 text-center">Location</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Updated</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
                {loading && <ShipmentTableSkeleton />}
                {filteredShipments.length === 0 && !loading && (
                    <tr>
                        <td
                        colSpan={8}
                        className="px-6 py-10 text-center text-sm text-gray-500"
                        >
                        No shipments found on-chain.
                        </td>
                    </tr>
                )}
              {filteredShipments.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="transition hover:bg-blue-50/40"
                >
                  <td className="px-6 py-5 text-center">
                    <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {shortAddress(shipment.sender)}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {shortAddress(shipment.receiver)}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="font-semibold text-gray-900">
                      {shipment.product}
                    </div>
                  </td>

                  <td className="px-6 py-5 font-semibold text-gray-800 text-center">
                    ${shipment.price.toLocaleString()}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-medium text-gray-700">
                      {shipment.location}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        shipment.status
                      )}`}
                    >
                      {shipment.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-[13px] text-gray-500">
                    {shipment.updated}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                        <button onClick={() => {
                            setSelectedShipment(shipment);
                            setOpenDetailsModal(true);
                         }} className={getButtonStyle("view")}
                        >
                            View
                        </button>

                        <button onClick={() => {
                            setSelectedShipment(shipment);
                            setOpenStartModal(true);
                          }} className={getButtonStyle("start")}
                          disabled={isStartDisabled(shipment.status)}>
                            Start
                        </button>

                        <button onClick={() => {
                            setSelectedShipment(shipment);
                            setOpenUpdateModal(true);
                          }} className={getButtonStyle("update")}  
                          disabled={isUpdateDisabled(shipment.status)}>
                            Update
                        </button>

                        <button onClick={() => {
                          setSelectedShipment(shipment);
                          setOpenDeliverModal(true);
                        }} className={getButtonStyle("deliver")}  disabled={isDeliverDisabled(shipment.status)}>
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

      <CreateShipmentModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreate={handleCreateShipment}
        />
      <ShipmentDetailsModal
        isOpen={openDetailsModal}
        shipment={selectedShipment}
        onClose={() => {
            setOpenDetailsModal(false);
            setSelectedShipment(null);
        }}
        />

        <ConfirmationModal
          isOpen={openStartModal}
          title="Start Shipment"
          message={`Are you sure you want to start shipment "${
            selectedShipment?.product ?? "this shipment"
          }"?`}
          confirmText="Start Shipment"
          cancelText="Cancel"
          onClose={() => {
            setOpenStartModal(false);
            setSelectedShipment(null);
          }}
          onConfirm={async () => {
            if (selectedShipment) {
              await handleStartShipment(selectedShipment);
            }

            setOpenStartModal(false);
            setSelectedShipment(null);
          }}
        />

        <UpdateShipmentModal
          isOpen={openUpdateModal}
          shipment={selectedShipment}
          onClose={() => {
            setOpenUpdateModal(false);
            setSelectedShipment(null);
          }}
          onConfirm={async (location) => {
            if (!selectedShipment) return;

            setOpenUpdateModal(false);

            await handleUpdateShipment(
              selectedShipment,
              location
            );

            setSelectedShipment(null);
          }}
        />

        <ConfirmationModal
          isOpen={openDeliverModal}
          title="Deliver Shipment"
          message={`Are you sure you want to mark "${selectedShipment?.product}" as delivered?`}
          confirmText="Deliver Shipment"
          cancelText="Cancel"
          onClose={() => {
            setOpenDeliverModal(false);
            setSelectedShipment(null);
          }}
          onConfirm={async () => {
            if (!selectedShipment) return;

            setOpenDeliverModal(false);

            await handleDeliverShipment(selectedShipment);

            setSelectedShipment(null);
          }}
        />
    </section>
  );
}