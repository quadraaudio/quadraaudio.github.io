/**
 * Quadra Audio — Terms of Use & End User License Agreement (all products).
 * Bump TERMS_VERSION when material clauses change so clients re-accept.
 */

export const TERMS_VERSION = "2026-08-03";
export const TERMS_EFFECTIVE_DATE = "August 3, 2026";
export const TERMS_TITLE = "Terms of Use & End User License Agreement";

export type TermsSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export const TERMS_INTRO = [
  `These Terms of Use and End User License Agreement (the "Agreement") are a legal agreement between you ("you" or "Licensee") and Quadra Audio ("Quadra," "we," or "us") for access to the Quadra website, Quadra ID accounts, and any Quadra software, plugins, utilities, firmware, documentation, content, trials, subscriptions, online services, and related materials (collectively, the "Software" and "Services").`,
  `By creating an account, signing in, purchasing, downloading, installing, activating, or otherwise using any Software or Services, you accept this Agreement. If you do not agree, do not use the Software or Services.`,
  `If you are a consumer, you may have rights under mandatory local law that this Agreement cannot exclude. Where those rights apply, they prevail over conflicting terms below.`,
] as const;

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "license-not-sale",
    heading: "1. License, not sale",
    paragraphs: [
      "The Software is licensed, not sold. Quadra and its licensors retain all right, title, and interest in and to the Software, Services, branding, and intellectual property. No ownership interest is transferred to you.",
      "Subject to this Agreement and your purchase of the applicable entitlement (or a valid trial), Quadra grants you a limited, non-exclusive, non-transferable (except as expressly allowed), revocable license to install and use the Software for your personal or internal professional use on devices you own or control, solely as permitted by the product SKU you licensed.",
    ],
  },
  {
    id: "accounts-seats",
    heading: "2. Accounts, seats, and activation",
    paragraphs: [
      'Certain Software requires a Quadra ID (for example via Google sign-in) and may bind licenses or trials to hardware identifiers ("seats"). The number of seats, devices, or concurrent activations allowed is stated for each product at purchase or in product documentation.',
      "You are responsible for keeping your account credentials secure and for all activity under your account. Circumventing license, seat, trial, or technical protection measures is prohibited except where applicable law expressly permits.",
      "Activation, trial issuance, seat management, and related web flows may require an internet connection. Once a license has been successfully activated on a device as described for that product, offline use of that activated copy may be permitted subject to the signed entitlement and product rules.",
    ],
  },
  {
    id: "perpetual-use",
    heading: "3. Perpetual use of the purchased edition",
    paragraphs: [
      "Unless the offering is expressly sold as a subscription, rental, trial, or other time-limited entitlement, a paid license grants a perpetual right to use the major edition of the Software you purchased (for example version 1.x of a given product), subject to this Agreement.",
      "Perpetual use means you may continue to run that licensed edition after any included updates or support period ends, provided you remain in compliance and the Software remains compatible with your systems. It does not mean Quadra must maintain, update, host, or support the Software indefinitely.",
    ],
  },
  {
    id: "updates-support",
    heading: "4. Updates and support (maximum twelve months)",
    paragraphs: [
      "For perpetual purchases, unless a different plan is stated at checkout, the purchase includes up to twelve (12) months from the original purchase date of maintenance updates (bug fixes and minor maintenance releases for the licensed major edition) and reasonable technical support for the original purchaser.",
      "That entitlement excludes new major versions, new products, and feature releases that Quadra designates as upgrades or separate SKUs. After the twelve-month window ends, Quadra has no obligation to provide further updates, compatibility with future operating systems or hosts, email or other support, or new features.",
      "Quadra may, at its sole discretion, provide additional fixes or support beyond that window, or offer paid upgrades, crossgrades, or renewal plans. Any such offering is optional and may be governed by additional terms.",
      "If Software is provided on a subscription or other recurring plan, access to updates and the Software itself lasts only for the paid term, as described at purchase.",
    ],
  },
  {
    id: "majors",
    heading: "5. Major versions",
    paragraphs: [
      "A license covers the specified major version line identified at purchase. Future major versions may require a new license, upgrade fee, or plan renewal. Minor updates within the licensed major version may be provided during the updates window described above.",
    ],
  },
  {
    id: "trials-rto",
    heading: "6. Trials, demos, and rent-to-own",
    paragraphs: [
      "Evaluation, trial, NFR, or demo Software may be time-limited, feature-limited, or otherwise restricted, and may disable or mute functionality when the period ends. Trial eligibility may be limited per account, email, and/or hardware as published for each product.",
      "Rent-to-own or installment offerings, if available, grant use according to the payment schedule stated at purchase. Failure to complete required payments may suspend or terminate the entitlement until cured or as otherwise stated.",
    ],
  },
  {
    id: "restrictions",
    heading: "7. Restrictions",
    paragraphs: [
      "Except to the extent applicable law expressly allows, you may not: (a) reverse engineer, decompile, or disassemble the Software; (b) modify, adapt, or create derivative works; (c) rent, lease, lend, sublicense, host, or provide the Software as a service to third parties; (d) redistribute, resell, or publicly share license keys, activation codes, or signed license files; (e) remove proprietary notices; or (f) use the Software for any unlawful purpose.",
      "You may make a reasonable number of backup copies solely for archival purposes. Academic or education SKUs, if offered, are limited to qualifying non-commercial educational use.",
    ],
  },
  {
    id: "online-services",
    heading: "8. Website, online services, and discontinuation",
    paragraphs: [
      "Quadra may change, suspend, or discontinue websites, accounts, storefront features, trials, activation endpoints, analytics, or other online Services with reasonable notice when practicable. Quadra may sunset a product line entirely.",
      "Discontinuation of online Services does not by itself revoke a perpetual license to use an already activated copy of Software that is designed to run offline after activation. Quadra is not obligated to operate activation, account, or download infrastructure indefinitely.",
      "If Quadra provides a wind-down period for final activation or license export, you are responsible for completing activation within that period.",
    ],
  },
  {
    id: "purchases",
    heading: "9. Purchases, taxes, and refunds",
    paragraphs: [
      "Prices, currencies, taxes, and fees are as shown at checkout. Payment processors (such as PayPal) handle payment credentials under their own terms. Digital Software purchases are generally final once a license is issued; see the Refund Policy for limited exceptions.",
      "You must accept this Agreement before completing a purchase. Completing checkout without acceptance is not permitted.",
    ],
  },
  {
    id: "privacy-data",
    heading: "10. Privacy and data",
    paragraphs: [
      "Account, order, hardware-binding, and diagnostic data may be processed as described in our Privacy Policy. The Software or Services may communicate with Quadra servers for licensing, fraud prevention, updates checks, or service improvement. Do not use the Software if you do not agree to those practices as described in the Privacy Policy.",
    ],
  },
  {
    id: "feedback",
    heading: "11. Feedback",
    paragraphs: [
      "If you provide suggestions or feedback, you grant Quadra a royalty-free, worldwide, perpetual, irrevocable license to use and incorporate that feedback without obligation to you.",
    ],
  },
  {
    id: "warranty",
    heading: "12. Limited warranty and disclaimer",
    paragraphs: [
      "For thirty (30) days from the date the Software is first made available to you for download after a paid purchase, Quadra warrants that the Software will substantially conform to the applicable user documentation when used as directed on supported configurations. Your exclusive remedy for breach of this limited warranty is, at Quadra's option, repair, replacement, or refund of the amount you paid for the non-conforming Software.",
      'EXCEPT FOR THE LIMITED WARRANTY ABOVE AND TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SOFTWARE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, UNINTERRUPTED OR ERROR-FREE OPERATION, OR COMPATIBILITY WITH ALL FUTURE OPERATING SYSTEMS, HOSTS, OR HARDWARE. Third-party software bundled with or used alongside Quadra Software is not warranted by Quadra.',
    ],
  },
  {
    id: "liability",
    heading: "13. Limitation of liability",
    paragraphs: [
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, QUADRA AND ITS SUPPLIERS WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, DATA, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY. QUADRA'S TOTAL LIABILITY ARISING OUT OF OR RELATED TO THE SOFTWARE OR SERVICES WILL NOT EXCEED THE AMOUNT YOU PAID TO QUADRA FOR THE SPECIFIC PRODUCT GIVING RISE TO THE CLAIM IN THE TWELVE MONTHS BEFORE THE CLAIM.",
      "Some jurisdictions do not allow certain limitations; in those cases, the limits apply to the fullest extent permitted.",
    ],
  },
  {
    id: "termination",
    heading: "14. Termination",
    paragraphs: [
      "This Agreement remains in effect until terminated. Your license terminates automatically if you materially breach it. Upon termination you must stop using the Software and destroy copies in your possession, except where mandatory law requires otherwise. Sections that by nature should survive (including ownership, warranty disclaimer, liability limits, and governing law) survive termination.",
    ],
  },
  {
    id: "export-law",
    heading: "15. Export and governing law",
    paragraphs: [
      "You must comply with applicable export control and sanctions laws.",
      "Except where mandatory consumer law of your country of residence requires otherwise, this Agreement is governed by the laws of the State of Delaware, United States, without regard to conflict-of-law rules. Courts in that jurisdiction shall have exclusive jurisdiction over disputes arising from this Agreement, subject to any non-waivable consumer venue rights.",
    ],
  },
  {
    id: "general",
    heading: "16. General",
    paragraphs: [
      "This Agreement, together with the Privacy Policy, Refund Policy, and any product-specific terms presented at purchase, is the entire agreement between you and Quadra regarding the Software and Services and supersedes prior or contemporaneous understandings on that subject.",
      "If any provision is unenforceable, the remainder stays in effect. Quadra's failure to enforce a provision is not a waiver. Quadra may update this Agreement by posting a new version and changing the version identifier; material changes will require renewed acceptance where the website or Software so prompts. Continued use after you accept an updated version constitutes agreement to the update.",
      "Contact: support@quadraaudio.com.",
    ],
  },
];

export function getTermsPlainText(): string {
  const parts = [
    TERMS_TITLE,
    `Version ${TERMS_VERSION} · Effective ${TERMS_EFFECTIVE_DATE}`,
    "",
    ...TERMS_INTRO,
    "",
  ];
  for (const section of TERMS_SECTIONS) {
    parts.push(section.heading, "");
    for (const p of section.paragraphs) {
      parts.push(p, "");
    }
  }
  return parts.join("\n").trim();
}
