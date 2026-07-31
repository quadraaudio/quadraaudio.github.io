import { Suspense } from "react";
import { googleAuthConfigured } from "@/auth";
import LoginClient from "./LoginClient";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: "6rem 1.5rem" }}>
          <p>Loading…</p>
        </main>
      }
    >
      <LoginClient configured={googleAuthConfigured} />
    </Suspense>
  );
}
