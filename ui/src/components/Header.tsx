"use client";

import Image from "next/image";
import {
  CardanoWallet,
  useWallet,
  useNetwork,
  useLovelace,
} from "@meshsdk/react";

export default function Header() {
  const { connected } = useWallet();
  const network = useNetwork();
  const lovelace = useLovelace();

  const balance = lovelace
    ? (Number(lovelace) / 1_000_000).toFixed(2)
    : "0.00";

  return (
    <header className="w-full border-b border-white/10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <div className="flex items-center gap-4">

          <div className="rounded-full bg-white p-1/2">
            <Image
              src="/cardano.png"
              alt="Cardano"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              Shipment Tracking DApp
            </h1>

            <p className="text-sm text-gray-400">
              Smart Contract Powered Logistics on Cardano
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2">

            <p className="text-xs uppercase tracking-wider text-gray-400">
              Network
            </p>

            <p className="font-semibold text-blue-400">
              {network === 0
                ? "Preprod Testnet"
                : network === 1
                ? "Mainnet"
                : "Unknown"}
            </p>
          </div>

          {connected && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2">

              <p className="text-xs uppercase tracking-wider text-gray-400">
                Wallet Balance
              </p>

              <p className="font-semibold text-green-400">
                ₳ {balance}
              </p>
            </div>
          )}
 
          <div className="rounded-xl border bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-1">
           <CardanoWallet isDark={true} />
          </div>

        </div>
      </div>
    </header>
  );
}