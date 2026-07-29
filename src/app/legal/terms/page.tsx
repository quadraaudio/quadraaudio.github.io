import Link from "next/link";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import styles from "./page.module.scss";

export const metadata = {
  title: "Terms of Use & EULA — Quadra Audio",
  description: "End User License Agreement (EULA) and Terms of Use for Quadra Audio software and services.",
};

export default function TermsOfUsePage() {
  return (
    <div className={styles.page}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Terms of Use &amp; End User License Agreement</h1>
          <p className={styles.lastUpdated}>Effective Date: July 2026</p>
        </header>

        <main className={styles.content}>
          <h2>1. Agreement to Terms</h2>
          <p>
            These Terms of Use and End User License Agreement ("Terms" or "EULA") govern your access to and use of software, services, websites, and applications provided by Quadra Audio ("Quadra," "we," "us," or "our"), including Hydra virtual soundcard software. By downloading, installing, or using Hydra, you agree to be bound by these Terms.
          </p>

          <h2>2. Software License Grant</h2>
          <p>
            Subject to your compliance with these Terms, Quadra grants you a limited, non-exclusive, non-transferable, revocable license to install and execute the Hydra software on up to two (2) Mac computers that you own or control, solely for your internal professional or personal audio production, routing, and monitoring operations.
          </p>
          <ul>
            <li>Online activations are validated using your Quadra ID account.</li>
            <li>Offline activations generated via <code>.qkey</code> files are restricted exclusively to the specific Hardware GUID designated during key generation.</li>
          </ul>

          <h2>3. Restrictions on Use</h2>
          <p>
            You agree that you will not, and will not permit any third party to:
          </p>
          <ul>
            <li>Reverse engineer, decompile, disassemble, modify, or create derivative works of Hydra software, Core Audio driver extensions, kernel extensions, or system audio capture components.</li>
            <li>Bypass, alter, or tamper with digital rights management, license key verification mechanisms, cryptographic signatures, or offline <code>.qkey</code> authorization protocols.</li>
            <li>Rent, lease, sub-license, assign, sell, or commercially re-distribute the software or trial packages without prior written consent.</li>
            <li>Use the software for any unlawful purpose or in violation of applicable local, state, federal, or international laws.</li>
          </ul>

          <h2>4. Free Trial</h2>
          <p>
            Quadra provides a 90-day free trial of Hydra software for evaluation purposes. The trial software is provided full-featured with no channel limits. Upon conclusion of the 90-day evaluation period, continued use of the software requires the purchase of a valid commercial license.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            The software, user interface design, logos, driver technology, GroundControl Interface Fusion technology, and documentation are protected by copyright, trademark, and intellectual property laws of the United States and international treaties. NDI® is a registered trademark of Vizrt NDI AB. Dolby, Dolby Atmos, and the double-D symbol are registered trademarks of Dolby Laboratories.
          </p>

          <h2>6. Disclaimer of Warranties (UCC)</h2>
          <p style={{ textTransform: "uppercase", fontSize: "14px", fontWeight: 600, color: "#1d1d1f" }}>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SOFTWARE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND. QUADRA EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, QUIET ENJOYMENT, AND NON-INFRINGEMENT. QUADRA DOES NOT WARRANT THAT THE OPERATION OF THE SOFTWARE WILL BE UNINTERRUPTED, LATENCY-FREE, OR ERROR-FREE, OR THAT THE SOFTWARE WILL BE COMPATIBLE WITH ALL PHYSICAL AUDIO INTERFACES OR THIRD-PARTY DAWS.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p style={{ textTransform: "uppercase", fontSize: "14px", fontWeight: 600, color: "#1d1d1f" }}>
            TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL QUADRA, ITS OFFICERS, EMPLOYEES, OR SUPPLIERS BE LIABLE FOR ANY INCIDENTAL, SPECIAL, INDIRECT, PUNITIVE, COVER, OR CONSEQUENTIAL DAMAGES WHATSOEVER—INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF AUDIO DATA, PROJECT CORRUPTION, SYSTEM DOWN-TIME, OR HARDWARE CLOCK DESYNCHRONIZATION—ARISING OUT OF OR RELATED TO YOUR USE OR INABILITY TO USE THE SOFTWARE, REGARDLESS OF THE THEORY OF LIABILITY. IN NO CASE SHALL QUADRA'S TOTAL LIABILITY EXCEED THE TOTAL AMOUNT ACTUALLY PAID BY YOU FOR THE SOFTWARE LICENSE GIVING RISE TO THE CLAIM.
          </p>

          <h2>8. Export Compliance</h2>
          <p>
            You agree to comply with all applicable United States and international export laws and regulations, including the U.S. Export Administration Regulations (EAR). You represent that you are not located in any country subject to U.S. government embargoes or designated as a terrorist-supporting country.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the United States and the laws of the applicable state jurisdiction, without giving effect to any principles of conflicts of law.
          </p>

          <h2>10. Contact Information</h2>
          <p>
            If you have questions regarding these Terms or licensing permissions, please contact us via <Link style={{ color: '#0071e3', textDecoration: 'none' }} href="/support/contact">Quadra Support</Link>.
          </p>
        </main>
      </div>
    </div>
  );
}
