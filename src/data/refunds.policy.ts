/**
 * Quadra Audio — Refund & Returns Policy (digital software & store).
 * Aligned with common pro-audio store practices (Avid / Softube-style windows).
 * Bump REFUNDS_VERSION when material clauses change.
 */

export const REFUNDS_VERSION = "2026-08-03.1";
export const REFUNDS_EFFECTIVE_DATE = "August 3, 2026";
export const REFUNDS_TITLE = "Refund & Returns Policy";

export type RefundsSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export const REFUNDS_INTRO = [
  `This Refund & Returns Policy (“Policy”) explains when Quadra Audio (“Quadra,” “we,” “us”) may refund or cancel purchases made through our online store and related channels. It applies to digital Software licenses, trials, promotions, and any subscription or rent-to-own offerings we sell, unless a specific product page states different terms at checkout.`,
  `By completing a purchase you accept our Terms of Use & EULA and this Policy. Mandatory consumer rights in your country of residence are not excluded where they cannot be waived.`,
] as const;

export const REFUNDS_SECTIONS: RefundsSection[] = [
  {
    id: "overview",
    heading: "1. Overview — digital goods",
    paragraphs: [
      "Quadra primarily sells digital software entitlements (licenses), not physical media. Once an Entitlement is issued to your Quadra Account, you generally receive immediate access to download and activate Software.",
      "Because digital licenses can be copied and activated instantly, purchases are generally final after fulfillment, subject to the limited exceptions below and non-waivable consumer law.",
    ],
  },
  {
    id: "perpetual",
    heading: "2. Perpetual software licenses (standard catalog)",
    paragraphs: [
      "Default rule. Perpetual licenses purchased on our store are non-refundable once the license has been issued to your Account, except as stated in this Policy.",
      "Technical-issue exception (14 days). If a defect attributable to Quadra prevents the Software from launching or performing its essential licensed functions on a supported configuration described in our Documentation, contact support@quadraaudio.com within fourteen (14) days of purchase. Include your order number, Account email, product name, OS version, and a clear description of the issue and steps tried.",
      "Under that exception we may, at our option: (a) provide troubleshooting; (b) replace or re-issue the download/Entitlement; or (c) refund the purchase price if we cannot reasonably restore essential functionality.",
      "The technical-issue exception does not cover: buyer’s remorse; change of mind; insufficient system requirements you did not check; incompatibility with unsupported hosts/OS versions; third-party hardware/driver faults; misuse; unauthorized modification; or issues after the 14-day window unless mandatory law requires otherwise.",
    ],
  },
  {
    id: "change-of-mind",
    heading: "3. Change of mind / “no questions asked”",
    paragraphs: [
      "Unlike some vendors that advertise a broad 14-day no-questions-asked return for unused software, Quadra’s standard store policy does not offer change-of-mind refunds after an Entitlement is issued.",
      "We encourage using free trials (where offered) and reviewing system requirements before purchase. If a product page at checkout expressly promises a different courtesy return window, that page controls for that SKU.",
    ],
  },
  {
    id: "eu-digital",
    heading: "4. Consumer cooling-off and digital content (EEA/UK and similar)",
    paragraphs: [
      "Some jurisdictions grant consumers a right to withdraw from distance contracts within 14 days. For digital content not supplied on a tangible medium, that right may be lost if supply began with your prior express consent and acknowledgment that you lose the right once performance begins.",
      "During checkout or activation we may ask you to consent to immediate delivery of digital content and acknowledge loss of withdrawal rights. Where you validly give that consent and the Entitlement is supplied, the statutory cooling-off right may no longer apply.",
      "Where mandatory law still grants a withdrawal or refund right despite the above, that law prevails. Contact us if you believe a statutory right applies to your order.",
    ],
  },
  {
    id: "subscriptions",
    heading: "5. Subscriptions and renewals (if offered)",
    paragraphs: [
      "If we offer subscriptions: you may cancel auto-renewal in your Account (or by contacting support) so you are not charged for the next term. Access typically continues until the end of the paid period.",
      "Initial subscription purchase: you may request a refund within fourteen (14) days of the initial purchase date only, unless the product page states otherwise, and subject to any statutory digital-content rules.",
      "Renewals and upgrade/support plan renewals are generally non-refundable and non-cancelable for the then-current paid period once charged, except where mandatory law requires otherwise. Turning off auto-renewal prevents future charges but does not refund time already paid.",
    ],
  },
  {
    id: "rto",
    heading: "6. Rent-to-own and installments (if offered)",
    paragraphs: [
      "RTO or installment plans are disclosed at checkout. Early payoff, missed payments, and entitlement suspension follow the plan terms shown at purchase.",
      "Refunds of installment payments already made are not available merely because you stop using the Software, except under the technical-issue exception (Section 2), a checkout-specific promise, or mandatory law. Chargebacks for valid completed periods may result in Account/Entitlement suspension.",
    ],
  },
  {
    id: "trials-promos",
    heading: "7. Trials, NFR, academic, and promotional licenses",
    paragraphs: [
      "Free trials, demo, NFR, complimentary, and many promotional entitlements are provided without payment and are not refundable.",
      "Orders totaling $0 (for example 100% promo codes) have no monetary refund. Abuse of promos (duplicate accounts, trial cycling) may result in revocation without compensation.",
      "Academic pricing obtained with false credentials may be cancelled; we may invoice the difference to commercial pricing or revoke the Entitlement.",
    ],
  },
  {
    id: "bundles-upgrades",
    heading: "8. Bundles, upgrades, and crossgrades",
    paragraphs: [
      "Bundle purchases are refunded, if at all, only as a whole under this Policy — not as a la carte components after fulfillment.",
      "Upgrade or crossgrade pricing assumes a qualifying prior Entitlement. Fraudulent upgrade claims may be reversed. Refunds of upgrades follow Section 2 and do not automatically reinstate discounted paths if timelines expire.",
    ],
  },
  {
    id: "reseller",
    heading: "9. Purchases from resellers or third parties",
    paragraphs: [
      "If you bought Quadra Software from an authorized reseller, marketplace, or hardware bundle partner, their return policy governs the purchase transaction. Contact that seller first. We may still assist with technical activation issues for genuine licenses.",
    ],
  },
  {
    id: "how-to",
    heading: "10. How to request a refund",
    paragraphs: [
      "Email support@quadraaudio.com with subject “Refund request” and include: (1) order number or PayPal transaction ID; (2) Account email; (3) product name; (4) purchase date; (5) reason and supporting detail (screenshots, OS/DAW versions for technical claims).",
      "We may ask you to deactivate seats, cease use, and confirm destruction of copies as a condition of refund where permitted.",
      "Approved refunds are issued to the original payment method (for example PayPal). Bank or card reflection timing is controlled by PayPal and your financial institution (often several business days, sometimes longer).",
    ],
  },
  {
    id: "processing",
    heading: "11. Review and processing time",
    paragraphs: [
      "We aim to acknowledge refund requests within three (3) business days and to decide straightforward cases within fourteen (14) days of receiving complete information. Complex technical investigations may take longer; we will communicate status when practicable.",
      "If we approve a refund, associated Entitlements may be revoked and seats deactivated. Continued use after refund is unauthorized.",
    ],
  },
  {
    id: "chargebacks",
    heading: "12. Chargebacks and payment disputes",
    paragraphs: [
      "Please contact us before filing a chargeback so we can help. Chargebacks filed without attempting to resolve a covered technical issue may lead to suspension of your Account and Entitlements while the dispute is pending.",
      "If a chargeback is decided in our favor or reversed, we may reinstate Entitlements when appropriate. Fraudulent chargebacks may be referred for collection or legal action.",
    ],
  },
  {
    id: "price-errors",
    heading: "13. Pricing errors and canceled orders",
    paragraphs: [
      "We may cancel orders that contain obvious pricing or catalog errors, duplicate charges, or suspected fraud, and refund amounts paid if charged. We may refuse or reverse Entitlements issued in error.",
    ],
  },
  {
    id: "currency-taxes",
    heading: "14. Currency, taxes, and fees",
    paragraphs: [
      "Refunds are made in the currency originally charged where the payment processor supports it. Foreign-exchange differences, card issuer fees, or intermediate bank fees are outside our control and may not be reimbursed.",
      "Tax treatment of refunds follows applicable law and processor rules.",
    ],
  },
  {
    id: "warranty-relationship",
    heading: "15. Relationship to limited warranty",
    paragraphs: [
      "The Terms of Use & EULA describe a limited conformity warranty (typically thirty days for paid Software). Remedies under that warranty (repair, replacement, or refund) may overlap with this Policy. You are not entitled to double recovery. Mandatory consumer guarantees remain available where they apply.",
    ],
  },
  {
    id: "changes",
    heading: "16. Changes to this Policy",
    paragraphs: [
      "We may update this Policy by posting a new version on this page. The version that applied on your purchase date governs that order, except where a change is required by law or is more favorable to you and we choose to apply it.",
    ],
  },
  {
    id: "contact",
    heading: "17. Contact",
    paragraphs: [
      "Refund and billing questions: support@quadraaudio.com.",
      `Policy version ${REFUNDS_VERSION}, effective ${REFUNDS_EFFECTIVE_DATE}. Related: Terms of Use (/legal/terms) · Privacy Policy (/legal/privacy).`,
    ],
  },
  {
    id: "consumer",
    heading: "18. Consumer rights not affected",
    paragraphs: [
      "Nothing in this Policy limits rights that cannot be waived under applicable consumer law (including, where applicable, EU consumer rights and Australian Consumer Law guarantees). If those rights require a remedy broader than this Policy, we will honor the mandatory remedy.",
    ],
  },
];
