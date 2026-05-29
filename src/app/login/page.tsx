"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signRequest } from "@/lib/hmac";
import { SignInPage } from "@/components/sign-in";

// Helper local para fazer requests assinadas a partir do cliente
// (só funciona porque este código corre no servidor via SSR/hydration
//  e API_HMAC_SECRET não é NEXT_PUBLIC_)
async function signedFetch(path: string, body: Record<string, string>) {
  const method = "POST";
  const timestamp = Date.now();
  const rawBody = JSON.stringify(body);
  console.log("body", body);
  // const signature = signRequest(method, path, timestamp, rawBody);
  return fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-timestamp": timestamp.toString(),
      // "x-signature": signature,
    },
    body: rawBody,
  });
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recovered, setRecovered] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    // dados do form
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log("form", email, password);
    try {
      console.log("Signing in with:", email, password);
      const res = await signedFetch("/api/auth/login", { email, password });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao fazer login.");
        return;
      }

      router.push("/system");
      router.refresh();
    } catch {
      setError("Erro de ligação. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRecover() {
    try {
      const timestamp = Date.now();
      const signature = signRequest("POST", "/api/auth/recover", timestamp);
      const res = await fetch("/api/auth/recover", {
        method: "POST",
        headers: {
          "x-timestamp": timestamp.toString(),
          "x-signature": signature,
        },
      });
      if (res.ok) setRecovered(true);
      else setError("Erro ao enviar recuperação.");
    } catch {
      setError("Erro de ligação.");
    }
  }

  if (recovered) {
    return (
      <p>Email de recuperação enviado. Verifica a tua caixa de entrada.</p>
    );
  }

  return (
    <SignInPage
      onSignIn={handleLogin}
      onGoogleSignIn={() => {}}
      onResetPassword={handleRecover}
      onCreateAccount={() => {}}
      error={error}
      loading={loading}
    />
  );
}
