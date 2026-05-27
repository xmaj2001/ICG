import { Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="mt-24 scroll-mt-20 rounded-3xl border border-border bg-card p-10 md:p-14"
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Contato
          </p>
          <h2 className="mt-2 text-4xl font-bold">Entre em contato</h2>
          <p className="mt-4 text-muted-foreground">
            Tire dúvidas, solicite simulações ou agende uma visita. Respondemos
            pelo WhatsApp em poucos minutos.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" /> +55 (11)
              99999-9999
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" /> contato@icg.com
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" /> Av. Paulista,
              1000 — São Paulo, SP
            </div>
          </div>
          <div className="mt-8">
            {/* <WhatsAppButton vehicle={vehicle} label="Falar no WhatsApp" /> */}
          </div>
        </div>
        <div className="rounded-2xl bg-muted p-8">
          <h3 className="text-lg font-semibold">Horário de atendimento</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex justify-between">
              <span>Segunda — Sexta</span>
              <span>09:00 — 19:00</span>
            </li>
            <li className="flex justify-between">
              <span>Sábado</span>
              <span>09:00 — 17:00</span>
            </li>
            <li className="flex justify-between">
              <span>Domingo</span>
              <span>Fechado</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
