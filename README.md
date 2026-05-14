# 🚚 Cardano Shipment Tracking DApp

A decentralized shipment tracking application built on Cardano using Aiken smart contracts, MeshJS, Next.js, and TypeScript.

---

# ✨ Features

- 📦 Create shipment records on-chain
- 🧾 Store shipment data inside Cardano UTxO datum
- 🔍 Fetch real on-chain shipment data
- 🚀 Start shipment lifecycle
- 📍 Update shipment location
- ✅ Mark shipment as delivered
- 👁️ View single shipment details
- 👛 Wallet connection using MeshJS
- 🔔 Toast notifications
- 🎨 Responsive professional UI

---

# 🛠️ Tech Stack

- ⚛️ Next.js
- 🟦 TypeScript
- 🎨 Tailwind CSS
- 🧩 MeshJS
- 🏗️ Aiken
- 🔐 Plutus V3
- 🌐 Blockfrost API
- 🧪 Cardano Testnet

---

# 🔄 Shipment Lifecycle

```text
Created → Started → InTransit → Delivered
```

---

# 🔐 Smart Contract Rules

- 👤 Only the sender can start a shipment
- 📍 Only the sender can update shipment location
- 🚚 Shipment can be updated only after it has started
- ✅ Delivery can happen only after shipment is in transit
- 🧾 Shipment data is stored as inline datum
- 🔁 Each update spends the old UTxO and creates a new UTxO

---

# ⚙️ Environment Variables

Create a `.env.local` file in the frontend project:

```env
NEXT_PUBLIC_BLOCKFROST=your_blockfrost_api_key
```

---

# 📥 Installation

```bash
npm install
```

---

# ▶️ Run Frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🏗️ Build Aiken Contract

```bash
aiken build
```

After building, copy the generated `plutus.json` into the frontend data location used by the app.

---

# 👛 Wallet Setup

Use a Cardano testnet wallet such as:

- 🔹 Lace
- 🔹 Eternl
- 🔹 Nami

Make sure the wallet network matches your Blockfrost network.

---

# 🚀 Main Functionalities

## 📦 Create Shipment

Creates a new shipment UTxO at the script address with inline datum.

Datum includes:

```text
sender
receiver
product name
price
status
location
updated time
```

---

## 🚀 Start Shipment

Consumes the `Created` shipment UTxO and creates a new `Started` shipment UTxO.

---

## 📍 Update Shipment

Consumes the `Started` or `InTransit` shipment UTxO and creates a new `InTransit` UTxO with updated location.

---

## ✅ Deliver Shipment

Consumes the `InTransit` shipment UTxO and creates a new `Delivered` shipment UTxO.

---

# 🔮 Future Improvements

- 🔍 Add search and filter options
- 📜 Add shipment timeline view
- 🗺️ Add map-based tracking
- 🔗 Add transaction explorer links
- 👥 Add role-based wallet validation UI
- 📄 Add pagination

---

# 👨‍💻 Author

**Praveenan**
