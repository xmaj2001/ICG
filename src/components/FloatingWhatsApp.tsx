"use client";

import * as React from "react";
import { MessageCircle, X } from "lucide-react";
import { buildGeneralWhatsAppUrl } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

interface FloatingWhatsAppProps {
  className?: string;
  whatsAppNumber: string;
}

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export function FloatingWhatsApp({
  className,
  whatsAppNumber,
}: FloatingWhatsAppProps) {
  const [whatsappUrl, setWhatsappUrl] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    // Generate the URL on the client to avoid hydration mismatches
    setWhatsappUrl(buildGeneralWhatsAppUrl(whatsAppNumber));
    setMobile(isMobile());
  }, [whatsAppNumber]);

  if (!whatsappUrl) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (mobile) return; // direct redirect on mobile
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={cn(
          "fixed bottom-6 left-6 z-50 flex items-center opacity-50 justify-center rounded-full text-white shadow-lg transition-all hover:opacity-100 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-whatsapp focus:ring-offset-2",
          className,
        )}
        aria-label="Entrar em contacto pelo WhatsApp"
      >
        <Image src="/whatsapp.svg" alt="WhatsApp" width={50} height={50} />
      </a>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
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
              Fale connosco no WhatsApp
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Escaneie o QR Code com seu celular para iniciar a conversa com a
              nossa equipa.
            </p>
            <div className="mt-6 flex justify-center rounded-2xl bg-gray-50 p-6">
              <QRCodeSVG value={whatsappUrl} size={220} level="M" />
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1ebe57]"
            >
              <Image
                src="/whatsapp.svg"
                alt="WhatsApp"
                width={20}
                height={20}
              />
              Abrir WhatsApp Web
            </a>
          </div>
        </div>
      )}
    </>
  );
}
