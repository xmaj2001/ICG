import { Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SettingsService } from "@/lib/settings/services/settings-service";
import Image from "next/image";

export async function ContactSection() {
  const settings = await SettingsService.getSettings();

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
              <Phone className="h-4 w-4 text-muted-foreground" />{" "}
              {settings.whatsappNumber}
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />{" "}
              {settings.email}
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />{" "}
              {settings.address}
            </div>
          </div>
          <div className="mt-8">
            {/* <WhatsAppButton vehicle={vehicle} label="Falar no WhatsApp" /> */}
          </div>
        </div>
        <div className="h-96 rounded-2xl">
          <Image
            className="size-full object-contain rounded-2xl"
            src="/ICG-LOGO-black.png"
            alt="Contact"
            width={600}
            height={600}
            priority
          />
        </div>
      </div>
    </section>
  );
}
