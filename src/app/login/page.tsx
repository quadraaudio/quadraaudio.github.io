import { Suspense } from "react";
import LoginPage from "./LoginClient";

export const metadata = {
  title: "Sign in",
};

export default function LoginRoute() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: "6rem 1.5rem" }}>
          <p>Loading…</p>
        </main>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
