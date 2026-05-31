"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/lib/settings/use-case/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function ConfiguracoesPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getSettings();
        if (res.success) {
          setWhatsappNumber(res.data.whatsappNumber || "");
          setEmail(res.data.email || "");
          setAddress(res.data.address || "");
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateSettings({ whatsappNumber, email, address });
      toast.success("Definições atualizadas com sucesso!");
    } catch (error) {
      console.error("Failed to save settings", error);
      toast.error("Ocorreu um erro ao atualizar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="font-display text-2xl sm:text-4xl">Configurações</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Gerir preferências e dados do sistema.
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <div className="overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border">
                <h2 className="font-display text-xl">Contacto e Integrações</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Configurações para as chamadas de acção públicas.
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">Número do WhatsApp</Label>
                    <div className="flex gap-4">
                      <div className="relative w-full sm:max-w-sm">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          +
                        </span>
                        <Input
                          id="whatsapp"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          placeholder="244923456789"
                          className="pl-7 bg-background"
                          disabled={isLoading || isSaving}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      O número deve incluir o código do país (sem o sinal de
                      mais). Exemplo: 244923456789. Este número receberá todas
                      as mensagens de interesse nos veículos.
                    </p>
                  </div>
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex gap-4">
                      <div className="relative w-full sm:max-w-sm">
                        <Input
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="[EMAIL_ADDRESS]"
                          className="bg-background"
                          disabled={isLoading || isSaving}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      O email receberá todas as mensagens de interesse nos
                      veículos.
                    </p>
                  </div>
                  {/* address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <div className="flex gap-4">
                      <div className="relative w-full sm:max-w-sm">
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Luanda, Angola"
                          className="bg-background"
                          disabled={isLoading || isSaving}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      O endereço receberá todas as mensagens de interesse nos
                      veículos.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center gap-4">
                    <Button
                      type="submit"
                      disabled={isLoading || isSaving || !whatsappNumber}
                      className="w-full sm:w-auto dark:bg-white bg-black dark:hover:bg-white/80 hover:bg-black/50 text-background px-6"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Guardar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
