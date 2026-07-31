import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";
import styles from "@/components/LegalLayout.module.scss";

export const metadata = {
  title: "Terms of Use & EULA — Quadra Audio Legal",
  description:
    "End User License Agreement (EULA) and Terms of Use for Quadra Audio software.",
};

export default function TermsOfUsePage() {
  return (
    <LegalLayout
      activeSlug="terms"
      eyebrow="Quadra Software EULA"
      title="Terms of Use & EULA"
      updated="July 2026"
    >
      <section>
        <h2>1. Agreement to Terms</h2>
        <p>
          These Terms of Use and End User License Agreement (&quot;Terms&quot; or
          &quot;EULA&quot;) govern your access to and use of software, services, and
          websites provided by Quadra Audio (&quot;Quadra,&quot; &quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;), including Hydra virtual soundcard software.
          By downloading, installing, or executing Hydra, you agree to be bound by these
          Terms.
        </p>
      </section>

      <section>
        <h2>2. Software License Grant</h2>
        <p>
          Subject to your compliance with these Terms, Quadra grants you a limited,
          non-exclusive, non-transferable, revocable license to install and execute Hydra
          software on up to two (2) Mac computers that you own or control, solely for your
          internal professional or personal audio production, routing, and monitoring
          operations.
        </p>
        <ul>
          <li>Online machine activations are validated using your Quadra ID account.</li>
          <li>Offline activations generated via <code>.qkey</code> files are restricted exclusively to the specific Hardware GUID designated during key generation.</li>
        </ul>
      </section>

      <section>
        <h2>3. Restrictions on Use</h2>
        <p>You agree that you will not, and will not permit any third party to:</p>
        <ul>
          <li>Reverse engineer, decompile, disassemble, modify, or create derivative works of Hydra software or its driver components.</li>
          <li>Bypass, alter, or tamper with license key verification mechanisms, cryptographic signatures, or offline <code>.qkey</code> authorization protocols.</li>
          <li>Rent, lease, sub-license, assign, sell, or commercially re-distribute the software or trial packages without prior written consent.</li>
          <li>Use the software for any unlawful purpose or in violation of applicable local, state, federal, or international laws.</li>
        </ul>
      </section>

      <section>
        <h2>4. 90-Day Evaluation Trial</h2>
        <p>
          Quadra provides a 90-day free trial of Hydra software for evaluation purposes.
          The trial software is provided full-featured with no channel limits or
          watermarks. Upon conclusion of the 90-day evaluation period, continued use of the
          software requires the purchase of a valid commercial license.
        </p>
      </section>

      <section>
        <h2>5. Intellectual Property</h2>
        <p>
          The software, user interface design, driver technology, Matrix Grid routing
          technology, and documentation are protected by copyright, trademark, and
          intellectual property laws of the United States and international treaties.
          NDI® is a registered trademark of Vizrt NDI AB.
        </p>
      </section>

      <section>
        <h2>6. Disclaimer of Warranties</h2>
        <div className={styles.uccCallout}>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SOFTWARE AND SERVICES ARE
          PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; WITH ALL FAULTS AND
          WITHOUT WARRANTY OF ANY KIND. QUADRA EXPRESSLY DISCLAIMS ALL WARRANTIES,
          EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES
          OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </div>
      </section>

      <section>
        <h2>7. Limitation of Liability</h2>
        <div className={styles.uccCallout}>
          TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL QUADRA, ITS OFFICERS,
          EMPLOYEES, OR SUPPLIERS BE LIABLE FOR ANY INCIDENTAL, SPECIAL, INDIRECT,
          PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER — INCLUDING BUT NOT LIMITED TO
          LOSS OF PROFITS, LOSS OF AUDIO DATA, OR SYSTEM DOWN-TIME — ARISING OUT OF OR
          RELATED TO YOUR USE OR INABILITY TO USE THE SOFTWARE.
        </div>
      </section>

      <section>
        <h2>8. Export Compliance (US EAR)</h2>
        <p>
          You agree to comply with all applicable United States and international export
          laws and regulations, including the U.S. Export Administration Regulations
          (EAR). You represent that you are not located in any country subject to U.S.
          government embargoes or designated as a sanction-restricted party.
        </p>
      </section>

      <section>
        <h2>9. Contact Support</h2>
        <p>
          If you have questions regarding these Terms or licensing permissions, please
          contact us via <Link href="/support/contact">Quadra Support</Link>.
        </p>
      </section>
    </LegalLayout>
  );
}
