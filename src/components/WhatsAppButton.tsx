"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { MessageCircle, X } from "lucide-react";
import { Vehicle } from "@/lib/vehicles/type";
import { whatsappLink } from "@/lib/constants";

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export function WhatsAppButton({
  vehicle,
  className = "",
  label = "Tenho interesse",
}: {
  vehicle: Vehicle;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  const link = whatsappLink(vehicle);

  const handleClick = (e: React.MouseEvent) => {
    if (mobile) {
      // direct redirect on mobile
      return;
    }
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1ebe57] ${className}`}
      >
        <MessageCircle className="h-4 w-4" />
        {label}
      </a>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              Fale conosco no WhatsApp
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Escaneie o QR Code com seu celular para iniciar a conversa sobre o{" "}
              <span className="font-medium text-gray-900">
                {vehicle.brand} {vehicle.model}
              </span>
              .
            </p>
            <div className="mt-6 flex justify-center rounded-2xl bg-gray-50 p-6">
              <QRCodeSVG value={link} size={220} level="M" />
            </div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1ebe57]"
            >
              <MessageCircle className="h-4 w-4" />
              Abrir WhatsApp Web
            </a>
          </div>
        </div>
      )}
    </>
  );
}
