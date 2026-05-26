"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Vehicle } from "@/lib/vehicles/type";

interface InfoProps {
  vehicle: Vehicle;
}

export function Info({ vehicle }: InfoProps) {
  const [showQr, setShowQr] = useState(false);

  const specs = [
    { label: "Ano", value: vehicle.year },
    {
      label: "Motor",
      value: `${vehicle.engineSize} L`,
    },
    { label: "Combustível", value: vehicle.fuel },
    { label: "Transmissão", value: vehicle.transmission },
    { label: "Categoria", value: vehicle.category },
    { label: "Estado", value: vehicle.status },
  ];

  return (
    <aside>
      <div className="bg-surface border border-border p-7 sticky top-24">
        <span className="label-eyebrow text-gold">{vehicle.brand}</span>
        <h1 className="font-display text-4xl mt-2 leading-tight">
          {vehicle.model}
        </h1>
        <div className="mt-2 text-sm text-muted-foreground">
          {vehicle.year} · {vehicle.category} · {vehicle.transmission}
        </div>

        <div className="mt-7 pt-7 border-t border-border">
          <span className="label-eyebrow text-muted-foreground">Preço</span>
          <div className="font-display text-5xl mt-1 text-foreground tracking-tight">
            {formatPrice(vehicle.price)}
            <span className="text-sm text-muted-foreground font-sans ml-2">
              AOA
            </span>
          </div>
        </div>

        <a
          href={buildWhatsAppUrl(vehicle)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white text-sm font-medium py-3.5 rounded-full transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l.601.96-1.005 3.668 3.383-.887z" />
          </svg>
          Falar no WhatsApp
        </a>

        <div className="mt-3 text-center text-xs text-muted-foreground">
          Resposta em minutos · Luanda
        </div>

        {/* Desktop: QR code always visible */}
        <div className="mt-6 pt-6 border-t border-border hidden md:flex flex-col items-center gap-3">
          <span className="label-eyebrow text-muted-foreground">Scan para WhatsApp</span>
          <div className="bg-white p-3 rounded-xl">
            <QRCodeSVG
              value={buildWhatsAppUrl(vehicle)}
              size={140}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          <p className="text-[11px] text-muted-foreground text-center leading-snug">
            Aponte a câmera do telemóvel<br />para iniciar conversa
          </p>
        </div>

        {/* Mobile: toggle button + collapsible QR */}
        <div className="mt-6 pt-6 border-t border-border flex flex-col items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setShowQr((v) => !v)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <QrCode size={16} />
            {showQr ? "Esconder QR Code" : "Mostrar QR Code"}
          </button>
          {showQr && (
            <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="bg-white p-3 rounded-xl">
                <QRCodeSVG
                  value={buildWhatsAppUrl(vehicle)}
                  size={140}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p className="text-[11px] text-muted-foreground text-center leading-snug">
                Mostre a alguém para scanear
              </p>
            </div>
          )}
        </div>

        <dl className="mt-7 pt-7 border-t border-border grid grid-cols-2 gap-y-5 gap-x-4">
          {specs.map((s) => (
            <div key={s.label}>
              <dt className="label-eyebrow text-muted-foreground">{s.label}</dt>
              <dd className="mt-1 text-sm text-foreground">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
