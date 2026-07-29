"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "../hydra/ThemeSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./page.module.scss";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setStep("password");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email.trim());
    router.push("/account");
  };

  return (
    <div className={styles.loginPage}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.loginCard}>

        {/* Logo */}
        <div className={styles.logo}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="56" height="56">
            <path fillRule="evenodd" clipRule="evenodd" d="M 0 25 A 25 25 0 0 1 25 0 L 75 0 A 25 25 0 0 1 100 25 L 100 100 L 25 100 A 25 25 0 0 1 0 75 Z M 35 43 A 8 8 0 0 1 43 35 L 57 35 A 8 8 0 0 1 65 43 L 65 65 L 43 65 A 8 8 0 0 1 35 57 Z" fill="#1d1d1f"/>
          </svg>
        </div>

        {step === "email" ? (
          <>
            <h1 className={styles.title}>Sign in with your Quadra ID</h1>
            <p className={styles.subtitle}>You will be signed in to Quadra Store and all Quadra services.</p>

            <form className={styles.form} onSubmit={handleEmailSubmit}>
              <div className={styles.inputGroup}>
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <label htmlFor="email">Email or Quadra ID</label>
              </div>

              <button type="submit" className={styles.continueButton}>
                Continue
              </button>
            </form>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <Link href="/store/buy-hydra" className={styles.createButton}>
              Create your Quadra ID
            </Link>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Enter your password</h1>
            <p className={styles.subtitle}>{email}</p>

            <form className={styles.form} onSubmit={handlePasswordSubmit}>
              <div className={styles.inputGroup}>
                <input
                  id="password"
                  type="password"
                  placeholder=" "
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  autoFocus
                />
                <label htmlFor="password">Password</label>
              </div>

              <button type="submit" className={styles.continueButton}>
                Sign In
              </button>
            </form>

            <button className={styles.backLink} onClick={() => setStep("email")}>
              Use a different Quadra ID
            </button>
          </>
        )}
      </div>

      {/* Legal footer */}
      <footer className={styles.legalFooter}>
        <Link href="#">Privacy Policy</Link>
        <span className={styles.dot}>·</span>
        <Link href="#">Terms of Use</Link>
        <span className={styles.dot}>·</span>
        <Link href="#">Forgot password?</Link>
      </footer>
    </div>
  );
}
