/**
 * Quadra Audio — Privacy Policy (all products & services).
 * Structured similarly to FabFilter / Softube-style vendor policies.
 * Bump PRIVACY_VERSION when material clauses change.
 */

export const PRIVACY_VERSION = "2026-08-03.1";
export const PRIVACY_EFFECTIVE_DATE = "August 3, 2026";
export const PRIVACY_TITLE = "Privacy Policy";

export type PrivacySection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export const PRIVACY_INTRO = [
  `This Privacy Policy explains how Quadra Audio (“Quadra,” “we,” “us,” or “our”) collects, uses, stores, shares, and protects personal data when you visit our websites (including quadraaudio.com), create or use a Quadra ID, purchase or activate software, contact support, or otherwise interact with our products and services (collectively, the “Services”).`,
  `It is intended to meet the transparency expectations of professional audio software vendors and modern privacy laws (including the EU/UK GDPR where applicable, and similar regimes). By using the Services, you acknowledge the practices described here. Where we rely on consent, you may withdraw it as described below.`,
  `This Policy forms part of our relationship with you together with the Terms of Use & EULA and the Refund Policy.`,
] as const;

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "controller",
    heading: "1. Who is responsible (data controller)",
    paragraphs: [
      "Quadra Audio is the controller of personal data processed for the purposes described in this Policy, except where a third party (such as a payment processor or identity provider) acts as an independent controller of data you provide directly to them.",
      "Privacy contact: support@quadraaudio.com (subject line: “Privacy”). We do not currently appoint a statutory Data Protection Officer; if that changes we will publish contact details here.",
    ],
  },
  {
    id: "scope",
    heading: "2. Scope",
    paragraphs: [
      "This Policy covers personal data relating to website visitors, account holders, purchasers, trial users, newsletter recipients (if any), and people who contact us.",
      "It does not cover third-party websites, DAWs, operating systems, app stores, or services that we do not control, even if linked from our site or used alongside our Software.",
    ],
  },
  {
    id: "definitions",
    heading: "3. What is personal data",
    paragraphs: [
      "“Personal data” means information relating to an identified or identifiable natural person — for example name, email address, online identifiers, hardware identifiers when linked to an account, IP address, and purchase history.",
      "“Processing” means any operation performed on personal data, including collection, storage, use, disclosure, and deletion.",
    ],
  },
  {
    id: "sources",
    heading: "4. Where we obtain personal data",
    paragraphs: [
      "Directly from you: when you sign in, check out, start a trial, activate software, submit forms, or email support.",
      "Automatically: when you browse our site or use Software that contacts our servers (device/licensing telemetry, logs, cookies or similar technologies).",
      "From identity and payment partners: Google (for Quadra ID sign-in) provides profile identifiers such as Google subject ID, email, and name; PayPal (or other processors) provides payment status, payer identifiers, and order references needed to fulfill purchases. We do not receive your full payment card number when PayPal processes the card.",
      "From service providers that host our infrastructure (for example database and edge hosting) acting on our instructions as processors.",
    ],
  },
  {
    id: "categories",
    heading: "5. Categories of personal data we process",
    paragraphs: [
      "Account and identity data: Google account subject ID, email address, display name, profile image URL (if provided), and Account preferences.",
      "Order and commerce data: product SKUs, quantities, prices, currency, coupons, order numbers, purchase timestamps, fulfillment status, and PayPal (or other processor) transaction identifiers.",
      "Licensing and activation data: product identifiers, license/trial status, seat bindings, hardware identifiers (HWID), activation and deactivation timestamps, redemption codes, and signed entitlement metadata needed to operate Quadra Guard or similar licensing.",
      "Technical and usage data: IP address, approximate location derived from IP, browser type, device/OS type, referring URLs, pages viewed, timestamps, error/crash reports you send, and Software version strings.",
      "Support communications: the content of emails or tickets, and related diagnostics you choose to provide.",
      "Marketing preferences: newsletter subscription status and unsubscribe records, if you opt in.",
      "Cookie and similar data: as described in Section 12.",
    ],
  },
  {
    id: "purposes-bases",
    heading: "6. Purposes and legal bases",
    paragraphs: [
      "We process personal data only where we have a lawful basis. Depending on your location, bases include performance of a contract, legitimate interests, legal obligation, and consent.",
      "Account and Quadra ID. Create and administer your Account; authenticate you; show entitlements. Legal basis: contract; legitimate interests in securing Accounts.",
      "Purchases and fulfillment. Process orders, issue licenses, prevent duplicate fulfillment, handle invoices/receipts via payment partners. Legal basis: contract; legal obligations (tax/accounting where applicable).",
      "Licensing, trials, and fraud prevention. Bind seats, enforce trial limits, detect shared or cracked Entitlements, protect Software and other users. Legal basis: contract; legitimate interests in protecting intellectual property and preventing abuse (balanced against your privacy interests; we limit data to what is needed for licensing integrity).",
      "Customer support. Respond to requests and troubleshoot. Legal basis: contract; legitimate interests in assisting users.",
      "Product improvement and analytics. Understand aggregate usage, fix bugs, and improve site and Software. Legal basis: legitimate interests; consent where required for non-essential cookies/analytics.",
      "Security and misuse prevention. Detect attacks, unauthorized access, and abuse of Services. Legal basis: legitimate interests; legal obligations.",
      "Marketing. Send product updates or offers only where permitted (consent and/or soft opt-in / legitimate interests with easy unsubscribe, as allowed by local law).",
      "Legal compliance. Respond to lawful requests, establish or defend claims, comply with accounting and consumer rules. Legal basis: legal obligation; legitimate interests.",
    ],
  },
  {
    id: "account-google",
    heading: "7. Quadra ID and Google sign-in",
    paragraphs: [
      "We use Google as an identity provider. When you sign in, Google authenticates you and, with your authorization, shares limited profile data with us. Google’s processing as an independent service is governed by Google’s privacy policy and your Google account settings.",
      "If you do not want Google to share that data with us, do not sign in. Without an Account we generally cannot sell, activate, or manage licenses tied to Quadra ID.",
    ],
  },
  {
    id: "payments",
    heading: "8. Payments (PayPal and similar)",
    paragraphs: [
      "Checkout payments are processed by PayPal (or another processor we designate at checkout). The processor is typically the merchant of record or payment facilitator for the card transaction and processes payment data under its own privacy notice and terms.",
      "We receive confirmation of payment, payer email or account identifiers, transaction IDs, and amounts needed to fulfill your order and prevent fraud. We do not store full payment card numbers on Quadra servers when the processor handles card entry.",
    ],
  },
  {
    id: "licensing-hwid",
    heading: "9. Licensing telemetry and hardware identifiers",
    paragraphs: [
      "To issue, redeem, validate, move, or revoke licenses and trials, Software and our activation Services may process hardware identifiers, Account identifiers, product SKUs, and timestamps. This is analogous to device/license checks used by other pro-audio vendors to prevent fraud and seat abuse.",
      "Legal basis: performance of the license contract and our legitimate interest in protecting Software. We retain seat/activation records for as long as needed to administer Entitlements and for a reasonable period thereafter for fraud prevention and dispute handling (see Section 14).",
      "Offline-activated Software may store a signed license locally (for example in the macOS Keychain). That local copy is under your control on the device; deletion of local licenses does not automatically erase server-side Entitlement history.",
    ],
  },
  {
    id: "sharing",
    heading: "10. How we share personal data",
    paragraphs: [
      "We do not sell your personal data. We share data only as follows:",
      "Service providers (processors). Hosting, databases, email delivery, analytics, error monitoring, and similar vendors process data on our instructions under contracts that require appropriate safeguards. Examples may include cloud infrastructure providers (such as Supabase and Cloudflare), and identity/payment partners noted above.",
      "Professional advisors and authorities. Lawyers, auditors, or authorities where required by law or to protect rights, safety, and property.",
      "Corporate transactions. In a merger, acquisition, financing, or sale of assets, personal data may be transferred subject to appropriate confidentiality and this Policy’s protections, with notice where required.",
      "With your direction or consent. When you ask us to share information or otherwise consent.",
      "Aggregated or de-identified data. We may share statistics that do not identify you.",
    ],
  },
  {
    id: "transfers",
    heading: "11. International transfers",
    paragraphs: [
      "We may process and store personal data in the United States and other countries where we or our processors operate. Those countries may have data-protection laws different from your home country.",
      "Where required (including transfers from the EEA/UK/Switzerland), we use appropriate safeguards such as Standard Contractual Clauses, processor certifications, or other lawful transfer mechanisms, and supplementary measures where appropriate.",
    ],
  },
  {
    id: "cookies",
    heading: "12. Cookies and similar technologies",
    paragraphs: [
      "We use cookies and similar technologies that are:",
      "Strictly necessary: session, authentication, security, load balancing, and cart/checkout state.",
      "Preferences: remembering UI or locale choices.",
      "Analytics (if enabled): understanding aggregate traffic and feature usage. Where required by law, non-essential analytics cookies are used only with consent, and you may withdraw consent by browser settings or any cookie banner controls we provide.",
      "You can configure your browser to refuse cookies. Blocking strictly necessary cookies may break sign-in, checkout, or Account features.",
      "Local storage may also store Terms-acceptance records (version and timestamp) on your device so we know you completed required acceptance flows.",
    ],
  },
  {
    id: "security",
    heading: "13. Security",
    paragraphs: [
      "We implement technical and organizational measures appropriate to the risk, including HTTPS/TLS in transit, access controls, least-privilege practices for staff and systems, and signed licensing artifacts where applicable.",
      "No method of transmission or storage is completely secure. You are responsible for protecting Account access on your devices and for signing out of shared computers.",
      "If a personal data breach is likely to result in a high risk to your rights and freedoms, we will notify you and competent authorities as required by applicable law.",
    ],
  },
  {
    id: "retention",
    heading: "14. Retention",
    paragraphs: [
      "We retain personal data only as long as needed for the purposes above, including:",
      "Account data: for the life of the Account, then a reasonable wind-down period unless longer retention is required.",
      "Orders and invoices: for the period required by tax, accounting, and consumer law (often several years).",
      "Licensing/seat records: for the life of the Entitlement and a subsequent period for fraud prevention, support, and legal claims.",
      "Support tickets: for a period needed to resolve issues and improve support quality.",
      "Server logs: typically for shorter operational windows unless needed for security investigation.",
      "Marketing lists: until you unsubscribe or we delete inactive contacts.",
      "When retention ends, we delete or irreversibly anonymize data where feasible.",
    ],
  },
  {
    id: "rights",
    heading: "15. Your rights",
    paragraphs: [
      "Depending on your location, you may have rights to: access your data; rectify inaccuracies; erase data; restrict or object to certain processing; data portability; withdraw consent; and lodge a complaint with a supervisory authority.",
      "To exercise rights, email support@quadraaudio.com with enough detail to verify your identity and locate your records. We will respond within the time required by law (typically one month under GDPR, extendable where permitted).",
      "We may decline requests that are unlawful, excessive, or that would impair others’ rights, fraud prevention, or licensing integrity, to the extent allowed by law.",
      "EEA/UK users may complain to their local data protection authority. California residents may have additional rights under the CCPA/CPRA (including to know, delete, and opt out of “sale”/“sharing” as those terms are defined — we do not sell personal information as commonly understood). We will not discriminate against you for exercising privacy rights.",
    ],
  },
  {
    id: "marketing",
    heading: "16. Marketing communications",
    paragraphs: [
      "Transactional messages (receipts, activation, security, material product notices) are not marketing and may still be sent when needed to perform the contract or secure the Account.",
      "Promotional emails are sent only where lawful. You can unsubscribe via the link in the message or by contacting us. Unsubscribing from marketing does not delete your Account or Entitlements.",
    ],
  },
  {
    id: "children",
    heading: "17. Children",
    paragraphs: [
      "Our Services are directed to adults and professionals. We do not knowingly collect personal data from children under 16 (or higher age required locally). If you believe a child provided data, contact us and we will take appropriate steps to delete it.",
      "If you are under 18, use the Services only with involvement of a parent or guardian where required by law.",
    ],
  },
  {
    id: "automated",
    heading: "18. Automated decision-making",
    paragraphs: [
      "We may use automated checks for fraud, payment risk, trial abuse, and seat limits. These checks may automatically refuse a duplicate trial or flag an order. They are not used to produce legal or similarly significant effects about you beyond administering Entitlements and security. You may contact us to contest a decision that blocked a legitimate purchase or activation.",
    ],
  },
  {
    id: "third-party-links",
    heading: "19. Third-party sites and software",
    paragraphs: [
      "Our site may link to third parties. Their privacy practices are their own. Plugin hosts, operating systems, and Google/PayPal accounts remain under those providers’ policies.",
    ],
  },
  {
    id: "changes",
    heading: "20. Changes to this Policy",
    paragraphs: [
      "We may update this Policy by posting a new version and changing the version identifier. Material changes will be highlighted by updated effective date and, where appropriate, notice via the site or Account email.",
      "We will not materially reduce protections for personal data collected in the past without providing required notice or obtaining consent where the law requires it.",
    ],
  },
  {
    id: "contact",
    heading: "21. Contact",
    paragraphs: [
      "Questions or privacy requests: support@quadraaudio.com.",
      `Policy version ${PRIVACY_VERSION}, effective ${PRIVACY_EFFECTIVE_DATE}. Related: Terms of Use (/legal/terms) · Refund Policy (/legal/refunds).`,
    ],
  },
];
