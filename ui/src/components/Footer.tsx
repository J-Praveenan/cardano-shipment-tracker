"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-lg font-semibold tracking-wide">
            Shipment Tracking DApp
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>

        
        <div className="flex flex-col items-center text-sm text-gray-300">
          <span className="mb-1">Built on Cardano Blockchain</span>
          <div className="text-center text-xs text-gray-500 py-4">
            Made with ❤️ on Cardano
          </div>
        </div>

        <div className="flex items-center gap-5 text-sm">

          <a
            href="https://cardano.org"
            target="_blank"
            className="hover:text-blue-400 transition duration-300"
          >
            Cardano
          </a>

          <a
            href="https://meshjs.dev"
            target="_blank"
            className="hover:text-blue-400 transition duration-300"
          >
            MeshJS
          </a>

          <a
            href="#"
            className="hover:text-gray-300 transition duration-300"
          >
            Docs
          </a>

        </div>
      </div>
      
    </footer>
  );
}