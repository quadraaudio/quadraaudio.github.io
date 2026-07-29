"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "../hydra/ThemeSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./page.module.scss";

export default function LoginPage() {
  const [signInStep, setSignInStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Registration state for Create Quadra ID / Google Auth0 completion
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regStudio, setRegStudio] = useState("");
  const [regCountry, setRegCountry] = useState("United States");
  const [regPhone, setRegPhone] = useState("");
  const [authProvider, setAuthProvider] = useState<"quadra" | "google">("quadra");

  const { login } = useAuth();
  const router = useRouter();

  const handleSignInEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSignInStep("password");
  };

  const handleSignInPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email.trim(), { authProvider: "quadra" });
    router.push("/account");
  };

  const handleGoogleSignIn = () => {
    // Simulate Auth0 Google login — prefill profile info from Google
    const googleEmail = "user.google@gmail.com";
    const googleName = "Google Account User";
    setRegEmail(googleEmail);
    setRegName(googleName);
    setAuthProvider("google");
    setShowSignUpForm(true);
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = regEmail.trim() || email.trim();
    if (!finalEmail) return;

    login(finalEmail, {
      name: regName.trim() || finalEmail.split("@")[0],
      organization: regStudio.trim(),
      country: regCountry,
      phone: regPhone.trim(),
      authProvider: authProvider,
    });

    router.push("/account");
  };

  return (
    <div className={styles.page}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.container}>

        <h1 className={styles.title}>
          Sign in to Quadra.
        </h1>

        <div className={styles.columns}>

          {/* =========================================
             Left Column: Check in with your Quadra ID
             ========================================= */}
          <div className={styles.column}>
            <h2 className={styles.colTitle}>Sign in with your Quadra ID</h2>
            <p className={styles.colDesc}>
              Your order information, virtual drivers, and licenses will be saved to your account.
            </p>

            {signInStep === "email" ? (
              <form onSubmit={handleSignInEmailSubmit} className={styles.form}>
                <div className={styles.emailRow}>
                  <input
                    id="loginEmail"
                    type="email"
                    placeholder="Email or Quadra ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.emailInput}
                    autoComplete="email"
                    required
                  />
                  <button type="submit" className={styles.arrowBtn} aria-label="Continue">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0L6.59 1.41 12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8z"/>
                    </svg>
                  </button>
                </div>

                <div className={styles.rememberRow}>
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>

                <Link href="#" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </form>
            ) : (
              <form onSubmit={handleSignInPasswordSubmit} className={styles.form}>
                <p className={styles.emailBadge}>{email}</p>
                <div className={styles.emailRow}>
                  <input
                    id="loginPassword"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.emailInput}
                    autoComplete="current-password"
                    required
                    autoFocus
                  />
                  <button type="submit" className={styles.arrowBtn} aria-label="Sign In">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0L6.59 1.41 12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8z"/>
                    </svg>
                  </button>
                </div>
                <button 
                  type="button" 
                  className={styles.backLink} 
                  onClick={() => setSignInStep("email")}
                >
                  Use a different Quadra ID
                </button>
              </form>
            )}
          </div>

          <div className={styles.columnDivider} />

          {/* =========================================
             Right Column: Create a Quadra ID / Google Auth0
             ========================================= */}
          <div className={styles.column}>
            <h2 className={styles.colTitle}>Create your Quadra ID</h2>
            <p className={styles.colDesc}>
              Create an account to manage your Hydra licenses, active Mac devices, and order history.
            </p>

            {/* Google Auth0 Button */}
            <button 
              type="button" 
              onClick={handleGoogleSignIn} 
              className={styles.googleBtn}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

            <div className={styles.orDivider}>
              <span>or create with email</span>
            </div>

            {!showSignUpForm ? (
              <button 
                type="button" 
                onClick={() => setShowSignUpForm(true)} 
                className={styles.createAccountToggleBtn}
              >
                Create Quadra ID Account
              </button>
            ) : (
              <form onSubmit={handleCreateAccountSubmit} className={styles.signUpForm}>
                {authProvider === "google" && (
                  <div className={styles.auth0Notice}>
                    ✓ Signed in with Google. Complete your profile details below:
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="regName">Full Name</label>
                  <input
                    id="regName"
                    type="text"
                    placeholder="e.g. Samuel Bacaro"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="regEmail">Email Address</label>
                  <input
                    id="regEmail"
                    type="email"
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>

                {authProvider !== "google" && (
                  <div className={styles.formGroup}>
                    <label htmlFor="regPassword">Password</label>
                    <input
                      id="regPassword"
                      type="password"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="regStudio">Studio / Organization (Optional)</label>
                  <input
                    id="regStudio"
                    type="text"
                    placeholder="e.g. Quadra Audio Studios"
                    value={regStudio}
                    onChange={(e) => setRegStudio(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="regCountry">Country / Region</label>
                  <select
                    id="regCountry"
                    value={regCountry}
                    onChange={(e) => setRegCountry(e.target.value)}
                  >
                    <option value="United States">United States</option>
                    <option value="Brazil">Brazil</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="regPhone">Phone Number (Optional)</label>
                  <input
                    id="regPhone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>

                <button type="submit" className={styles.submitSignUpBtn}>
                  Create Quadra ID
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer */}
        <footer className={styles.gateFooter}>
          <p>
            Need more help?{" "}
            <Link href="/support">Contact support</Link>
          </p>
        </footer>

      </div>
    </div>
  );
}
