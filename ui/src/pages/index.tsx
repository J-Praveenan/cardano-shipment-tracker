import Head from "next/head";
import { CardanoWallet, MeshBadge } from "@meshsdk/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full  mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
      </main>
      <Footer/>
    </div>
  );
}
