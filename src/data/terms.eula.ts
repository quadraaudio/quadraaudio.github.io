/**
 * Quadra Audio — Terms of Use & End User License Agreement (all products & services).
 * Comprehensive commercial EULA. Bump TERMS_VERSION when material clauses change.
 */

export const TERMS_VERSION = "2026-08-03.2";
export const TERMS_EFFECTIVE_DATE = "August 3, 2026";
export const TERMS_TITLE = "Terms of Use & End User License Agreement";

export type TermsSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export const TERMS_INTRO = [
  `PLEASE READ THIS AGREEMENT CAREFULLY. It is a legally binding contract between you (an individual or the entity you represent) (“you,” “your,” or “Licensee”) and Quadra Audio (“Quadra,” “we,” “us,” or “our”).`,
  `This Agreement governs: (a) your access to and use of Quadra websites, storefronts, knowledge bases, and online portals; (b) Quadra ID accounts and authentication; (c) all Quadra software applications, plugins, drivers, HAL/Core Audio components, utilities, firmware, sample content, presets, documentation, and related materials (collectively, the “Software”); and (d) any trials, updates, upgrades, support, activation, licensing, download, hosting, analytics, or other online or offline services we provide in connection with the foregoing (collectively, the “Services”). Product-specific seat counts, system requirements, pricing, and feature lists stated at purchase or in product documentation form part of this Agreement for that product.`,
  `BY CREATING AN ACCOUNT, SIGNING IN, CLICKING TO ACCEPT, PURCHASING, DOWNLOADING, INSTALLING, ACTIVATING, ACCESSING, OR OTHERWISE USING ANY SOFTWARE OR SERVICES, YOU AGREE TO THIS AGREEMENT. IF YOU DO NOT AGREE, DO NOT USE THE SOFTWARE OR SERVICES, AND DO NOT COMPLETE A PURCHASE.`,
  `If you accept on behalf of a company or other legal entity, you represent that you have authority to bind that entity. If you lack such authority, you may not accept this Agreement for that entity.`,
  `Consumers may have non-waivable rights under the laws of their country of residence. Where those rights apply, they prevail over conflicting terms below to the minimum extent required. Nothing in this Agreement limits liability that cannot lawfully be limited.`,
] as const;

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "definitions",
    heading: "1. Definitions",
    paragraphs: [
      "“Account” means a Quadra ID or other credentials we issue or accept (including sign-in via Google or another identity provider) used to access Services, manage seats, start trials, or redeem licenses.",
      "“Authorized Device” means a computer or other hardware unit on which you are permitted to install or activate the Software under the entitlement you purchased or under a valid trial, as limited by that product’s seat, device, or concurrent-use rules.",
      "“Documentation” means user guides, help articles, release notes, system requirements, and similar materials we publish for the Software or Services.",
      "“Entitlement” means the license type and scope you lawfully obtained (including perpetual, subscription, rent-to-own, evaluation/trial, academic, NFR, complimentary, or promotional licenses), including any seat limits and edition identifiers.",
      "“Major Version” means a Software version line designated by Quadra as a new major release (for example, 1.x versus 2.x), whether or not marketed under a new product name.",
      "“Maintenance Update” means a bug-fix, security, stability, or other minor maintenance release within a licensed Major Version that Quadra designates as an update rather than a new Major Version or separate product.",
      "“Third-Party Materials” means software, libraries, codecs, fonts, host APIs, trademarks, or services owned by third parties that may be distributed with, required by, or used alongside the Software.",
    ],
  },
  {
    id: "eligibility-accounts",
    heading: "2. Eligibility, accounts, and authority",
    paragraphs: [
      "You must be at least eighteen (18) years old, or the age of majority in your jurisdiction, whichever is higher, to create an Account or purchase Software. By using the Services you represent that you meet this requirement.",
      "You must provide accurate Account information and keep it current. We may suspend or terminate Accounts that contain false, incomplete, or misleading information, or that we reasonably believe are used for fraud, abuse, or infringement.",
      "You are responsible for safeguarding Account credentials and for all activity under your Account, whether or not you authorized that activity, except to the extent caused by our proven breach of security obligations. Notify us promptly at support@quadraaudio.com if you suspect unauthorized access.",
      "We may act on instructions that appear to come from your Account. We are not liable for losses arising from unauthorized use if we acted in good faith on those instructions, except where mandatory law provides otherwise.",
      "We may suspend or disable an Account or Entitlement if you fail to comply with this Agreement or if we have reasonable grounds to believe a failure has occurred or is imminent. Where practicable and not inconsistent with fraud prevention or legal obligations, we will provide notice of intended suspension.",
    ],
  },
  {
    id: "license-not-sale",
    heading: "3. License, not sale; reservation of rights",
    paragraphs: [
      "The Software and Services are licensed, not sold. Quadra and its licensors retain all right, title, and interest in and to the Software, Services, Documentation, branding, trademarks, trade dress, source code, object code, architectures, algorithms, and all associated intellectual property. No ownership interest transfers to you.",
      "Except for the limited license expressly granted in Section 4, no rights are granted by implication, estoppel, or otherwise. All rights not expressly granted are reserved by Quadra and its licensors.",
      "You acknowledge that the Software and related materials may contain confidential and proprietary information. You will not disclose such information except to employees or contractors who need it to perform work for you and who are bound by confidentiality obligations at least as protective as this Agreement.",
    ],
  },
  {
    id: "grant",
    heading: "4. Grant of license",
    paragraphs: [
      "Subject to your timely payment of applicable fees (if any), your compliance with this Agreement, and the Entitlement you obtained, Quadra grants you a limited, non-exclusive, non-transferable (except as Section 14 expressly permits), non-sublicensable, revocable license to download, install, and use the object-code form of the Software solely for your personal use or your internal professional/business use, only on Authorized Devices, and only in accordance with the Documentation and the seat, concurrent-use, and edition limits applicable to your Entitlement.",
      "Device / seat licenses. Where a product is sold with a stated number of seats or devices, you may activate the Software on up to that number of Authorized Devices at a time. You may deactivate a device and move a seat as permitted by the product’s tooling and Documentation. Sharing Account credentials to exceed seat limits is prohibited.",
      "Volume or floating licenses. If offered, concurrent or floating use is limited to the number of concurrent sessions or seats purchased and may be restricted to specified territories or networks as stated at purchase.",
      "Bundle licenses. A bundle Entitlement covers only the products and Major Versions included in the bundle on the date of purchase, unless we expressly state otherwise. Products or Major Versions added to a marketing bundle later are not automatically included.",
      "Upgrade licenses. An upgrade Entitlement may be used only if you hold a qualifying prior Entitlement designated by Quadra. Upon upgrading, you may not continue concurrent productive use of both the prior and upgraded editions as separate paid seats unless we expressly permit it.",
      "Server / automated processing. You may not use the Software on a server, in a data center, or for automated multi-user processing (including online mastering, hosting, or SaaS catering to third-party end users) without a separate written agreement from Quadra expressly authorizing that use.",
      "Installation is your responsibility. Your devices must meet published system requirements, which may change over time. Using Software on a device you do not own requires the owner’s permission; you remain responsible for compliance with this Agreement.",
    ],
  },
  {
    id: "entitlement-types",
    heading: "5. Perpetual, subscription, rent-to-own, trial, academic, and NFR entitlements",
    paragraphs: [
      "Perpetual licenses. Unless an offering is expressly described as subscription, rental, trial, or other time-limited access, a paid license grants a perpetual right to use the licensed Major Version subject to this Agreement. “Perpetual” means the license term does not automatically expire; it does not obligate Quadra to provide indefinite updates, support, hosting, activation infrastructure, or compatibility with future operating systems or hosts.",
      "Subscription licenses. If Software or Services are offered on a subscription basis, you may use them only during the paid term. Subscriptions may auto-renew if that is disclosed at checkout. Upon expiration, non-payment, or cancellation under the stated policy, access may be suspended or disabled without further notice to the extent permitted by law. Online connectivity may be required for validation.",
      "Rent-to-own / installments. If offered, use during the payment schedule is subject to timely payments. Failure to complete required payments may suspend or terminate the Entitlement until cured, or as otherwise stated at purchase.",
      "Trials and evaluations. Evaluation, trial, demo, beta, “NFR,” or complimentary Software may be time-limited, feature-limited, watermarked, muted, or otherwise restricted. When a trial ends, functionality may stop or degrade. Trial eligibility may be limited per Account, email address, and/or hardware identifier. Circumventing trial limits is a material breach.",
      "Academic / education licenses. If marked educational (EDU), use is limited to qualifying students, faculty, or staff for educational, non-commercial purposes as we specify. EDU licenses are generally non-transferable.",
      "NFR licenses. Not-for-resale licenses are for review, demonstration, or other limited purposes we designate and may not be transferred or used for ordinary commercial production except as we expressly allow.",
    ],
  },
  {
    id: "updates-support",
    heading: "6. Updates, upgrades, and support (twelve-month entitlement for perpetual purchases)",
    paragraphs: [
      "For perpetual purchases, unless a different plan is expressly stated at checkout, your purchase includes for twelve (12) months from the original purchase date: (a) access to Maintenance Updates for the licensed Major Version that Quadra chooses to release; and (b) reasonable technical support for the original purchaser through channels we publish (for example email or a support site), subject to availability and fair-use limits.",
      "The twelve-month entitlement excludes: new Major Versions; new products; feature releases Quadra designates as upgrades or separate SKUs; custom engineering; on-site support; and guaranteed response times unless a separate support contract says otherwise.",
      "After the twelve-month window: (a) you may continue to use the already-licensed Software “as is” under your perpetual license (if any); (b) Quadra has no obligation to provide further Maintenance Updates, support, or compatibility with future operating systems, DAWs, hosts, drivers, or hardware; and (c) Quadra may offer optional paid upgrades, crossgrades, or renewal plans under separate terms.",
      "Quadra may, in its sole discretion, provide additional fixes or guidance beyond the twelve-month window. Any such courtesy does not create a continuing obligation or waive Section limits.",
      "For subscription Entitlements, update and support rights last only while the subscription remains paid and active, as described at purchase.",
      "We may deliver updates automatically or require you to install them for security or licensing reasons. If you decline required updates, some or all features may become unavailable. We are not liable for issues caused by failure to install updates we make reasonably available.",
      "Support does not include diagnosing third-party hardware, hosts, operating systems, network configuration, or projects damaged by improper use, unauthorized modification, or unsupported environments.",
    ],
  },
  {
    id: "major-versions",
    heading: "7. Major versions",
    paragraphs: [
      "An Entitlement covers the Major Version identified at purchase (and Maintenance Updates for that Major Version during any applicable updates window). A later Major Version is a separate product for licensing purposes unless included by an upgrade plan or new purchase.",
      "Marketing names, edition labels (for example “Start” or “Pro”), and version numbers are determined by Quadra and may change. Renaming alone does not expand your Entitlement.",
    ],
  },
  {
    id: "activation-tpm",
    heading: "8. Activation, licensing technology, and online verification",
    paragraphs: [
      "Software may require Account sign-in, hardware identifiers, signed license files, online activation, periodic online validation, or other technical protection measures. You must not circumvent, disable, reverse, or interfere with those measures except to the limited extent applicable law expressly permits notwithstanding this restriction.",
      "Activation and trial issuance may require internet connectivity and communication with Quadra servers. After successful activation, certain products may permit offline use subject to the signed entitlement stored on the device. You are responsible for completing activation while Services are available.",
      "We may collect device identifiers, Account identifiers, product identifiers, timestamps, and related licensing telemetry reasonably needed to issue, validate, transfer, or revoke Entitlements, prevent fraud and piracy, and operate the Services, as further described in our Privacy Policy.",
      "If we reasonably determine that an Entitlement is used outside its scope (including excess seats, shared credentials used to defeat seat limits, cracked binaries, or forged licenses), we may disable the Entitlement or Account and pursue remedies available at law.",
    ],
  },
  {
    id: "restrictions",
    heading: "9. Restrictions on use",
    paragraphs: [
      "Except as this Agreement expressly allows or applicable law non-waivably permits, you will not, and will not permit others to:",
      "(a) copy the Software except for a reasonable number of backup or archival copies with all proprietary notices intact;",
      "(b) modify, adapt, translate, merge, or create derivative works of the Software;",
      "(c) reverse engineer, decompile, disassemble, or otherwise attempt to derive source code or underlying ideas, except solely where mandatory law allows for interoperability and then only to the minimum extent required and without disclosing resulting information except as that law permits;",
      "(d) rent, lease, lend, sell, sublicense, distribute, publish, or otherwise transfer the Software or Entitlement except as Section 14 allows;",
      "(e) provide the Software as a hosted service, application service provider offering, or shared multi-tenant service to third parties;",
      "(f) separate components that are licensed as a single product, or reconfigure installers to defeat technical limits;",
      "(g) remove, alter, or obscure copyright, trademark, or proprietary notices;",
      "(h) use the Software to infringe intellectual property or privacy rights, violate law, distribute malware, or interfere with others’ networks or systems;",
      "(i) use beta or pre-release Software in production mission-critical workflows without accepting the heightened risk that such Software is provided without warranty; or",
      "(j) publicly perform benchmarks implying Quadra endorsement without our prior written consent where we have published a specific benchmarking policy for a product.",
      "You will comply with all laws applicable to your use, including export, sanctions, privacy, and intellectual-property laws.",
    ],
  },
  {
    id: "acceptable-use-site",
    heading: "10. Website and online services; acceptable use",
    paragraphs: [
      "Website content is provided for general information. It may change without notice and is not a binding offer unless presented as part of a checkout or signed order.",
      "You will not misuse Services, including by attempting unauthorized access, scraping in a manner that impairs service, overloading infrastructure, testing vulnerabilities without authorization, or uploading unlawful or harmful content.",
      "We may change, suspend, or discontinue any website feature, storefront capability, documentation page, Account tool, trial flow, or activation endpoint for business, security, or operational reasons. Where practicable we will provide reasonable notice of material withdrawals.",
    ],
  },
  {
    id: "discontinuation",
    heading: "11. Product and service discontinuation; business wind-down",
    paragraphs: [
      "Quadra may discontinue any Software product line, edition, or Service, in whole or in part, including upon sale of assets, insolvency-related wind-down, or decision to cease operations.",
      "Discontinuation of online Services does not by itself revoke a perpetual license to continue using a copy that was already validly activated for offline use under its Entitlement, except where revocation is permitted for breach, fraud, court order, or legal requirement.",
      "Quadra is not obligated to operate Accounts, downloads, activation servers, payment integrations, or support indefinitely. If we announce a wind-down or final-activation window, you are responsible for activating devices and retaining licenses, backups, and Documentation within that window.",
      "Except as required by mandatory law or an express written commitment at purchase, discontinuation does not entitle you to a pro-rata refund for perpetual licenses already delivered, though subscription fees prepaid for unused future periods may be handled as stated in the Refund Policy or at cancellation.",
    ],
  },
  {
    id: "purchases",
    heading: "12. Orders, fees, taxes, payment processors, and refunds",
    paragraphs: [
      "Prices, currencies, taxes, duties, and fees are as displayed at checkout or in an order form. You authorize the selected payment method for the amounts due. You are responsible for applicable taxes except taxes based on Quadra’s net income.",
      "Payment processing may be performed by third parties (for example PayPal or other processors). Their terms govern the payment transaction. Quadra does not store full payment-card numbers on its servers when such processors handle card data.",
      "You must accept this Agreement (including via the required scroll-and-accept flow where presented) before completing a purchase or claiming a complimentary license. Orders submitted without acceptance are void.",
      "Digital Software purchases are generally final once an Entitlement is issued to your Account. Limited exceptions and procedures are described in the Refund Policy. Mandatory consumer cancellation or refund rights are not excluded where they cannot lawfully be excluded.",
      "We may refuse or cancel orders that appear fraudulent, erroneous, or in violation of this Agreement, and may reclaim Entitlements issued in error.",
    ],
  },
  {
    id: "third-party",
    heading: "13. Third-Party Materials and hosts",
    paragraphs: [
      "The Software may be accompanied by or interoperate with Third-Party Materials (including operating systems, DAWs, plugin formats, drivers, and open-source components). Those materials are licensed under their own terms. Nothing in this Agreement limits rights granted to you by third parties under open-source licenses that accompany the Software distribution.",
      "Quadra does not warrant Third-Party Materials or uninterrupted compatibility with every host, OS version, or hardware configuration. Trademarks of third parties remain the property of their owners and do not imply affiliation except as expressly stated.",
      "Links to third-party sites are provided for convenience. We do not control and are not responsible for third-party content or practices.",
    ],
  },
  {
    id: "transfer",
    heading: "14. Transfer",
    paragraphs: [
      "Device move. Where tooling allows, you may move a seat from one Authorized Device to another you control by deactivating the former device and activating the latter, subject to abuse limits and product rules.",
      "Transfer to another person. Unless a product page or Entitlement expressly forbids it (including EDU and NFR), you may permanently transfer a perpetual Entitlement to another end user only if: (a) you transfer all copies and cease all use; (b) the recipient agrees to this Agreement; (c) you follow any transfer procedure we publish (which may include fees or Account reassignment); and (d) the Entitlement is not part of a bundle that must be transferred only as a whole if we so require.",
      "You may not rent, time-share, or temporarily lend Entitlements. Subscription Entitlements are generally non-transferable except as we expressly allow.",
    ],
  },
  {
    id: "privacy-data",
    heading: "15. Privacy; consent to data use",
    paragraphs: [
      "Our collection and use of personal data is described in the Privacy Policy, which is incorporated by reference. By using the Software or Services you acknowledge that processing described there.",
      "In addition to licensing telemetry, we may collect limited technical and usage information (such as Software version, OS version, crash or diagnostic data you choose to send, and coarse locale) to improve products, secure Services, and prevent fraud. Where we use analytics providers, their processing is as described in the Privacy Policy.",
      "You are responsible for obtaining any consents needed from third parties whose personal data you submit to Services (for example collaborator emails).",
    ],
  },
  {
    id: "feedback",
    heading: "16. Feedback",
    paragraphs: [
      "If you provide ideas, suggestions, or feedback, you grant Quadra a perpetual, irrevocable, worldwide, royalty-free, transferable, sublicensable license to use, reproduce, modify, and commercialize that feedback without restriction or obligation to you. You are not required to provide feedback.",
    ],
  },
  {
    id: "ip-ownership-content",
    heading: "17. Your content and output",
    paragraphs: [
      "As between you and Quadra, you retain rights in audio, sessions, projects, and other content you create with the Software (“Your Content”), subject to third-party rights in samples or libraries you use.",
      "If Services store or transmit Your Content (for example cloud features, if offered), you grant Quadra a limited license to host, process, transmit, and display Your Content solely to operate and improve those Services for you. We do not claim ownership of Your Content.",
      "You represent that you have all rights necessary to use Your Content with the Software and Services and that such use does not violate law or third-party rights.",
    ],
  },
  {
    id: "warranty",
    heading: "18. Limited warranty",
    paragraphs: [
      "Limited warranty for paid Software. For thirty (30) days from the date a paid Entitlement is first made available for download to you, Quadra warrants to the original purchaser that the Software will substantially conform to the applicable Documentation when used on a supported configuration as directed. This limited warranty does not apply to trials, betas, pre-release builds, complimentary copies, misuse, unauthorized modification, accident, or use with unsupported environments.",
      "Exclusive remedy. Quadra’s entire liability and your exclusive remedy for breach of the limited warranty is, at Quadra’s option: (a) repair or replacement of the non-conforming Software; or (b) refund of the amount you paid to Quadra for that Entitlement upon your cessation of use and, if requested, certification of destruction of copies. Refunds are processed through the original payment channel where practicable.",
      "Implied warranties. To the maximum extent permitted by law, any implied warranties, conditions, or guarantees that cannot be disclaimed are limited in duration to the thirty-day limited-warranty period (or the minimum period required by law).",
    ],
  },
  {
    id: "disclaimer",
    heading: "19. Disclaimer of warranties",
    paragraphs: [
      'EXCEPT FOR THE LIMITED WARRANTY IN SECTION 18 AND TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SOFTWARE AND SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE,” WITH ALL FAULTS. QUADRA AND ITS SUPPLIERS DISCLAIM ALL OTHER WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, AND NON-INFRINGEMENT, AND ANY WARRANTIES ARISING FROM COURSE OF DEALING OR USAGE OF TRADE.',
      "QUADRA DOES NOT WARRANT THAT THE SOFTWARE OR SERVICES WILL MEET YOUR REQUIREMENTS; OPERATE WITHOUT INTERRUPTION, ERROR, OR DEFECT; BE COMPATIBLE WITH ALL FUTURE OPERATING SYSTEMS, HOSTS, DRIVERS, OR HARDWARE; OR THAT DEFECTS WILL BE CORRECTED. YOU ASSUME THE ENTIRE RISK AS TO SELECTION, INSTALLATION, AND RESULTS.",
      "PRE-RELEASE, BETA, AND EXPERIMENTAL FEATURES ARE PROVIDED EXCLUSIVELY AS-IS WITHOUT THE LIMITED WARRANTY IN SECTION 18.",
    ],
  },
  {
    id: "liability",
    heading: "20. Limitation of liability",
    paragraphs: [
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL QUADRA OR ITS SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES; OR FOR LOST PROFITS, REVENUE, GOODWILL, DATA, BUSINESS INTERRUPTION, COVER, OR SUBSTITUTE GOODS OR SERVICES; ARISING OUT OF OR RELATED TO THIS AGREEMENT, THE SOFTWARE, OR THE SERVICES, REGARDLESS OF THEORY OF LIABILITY (CONTRACT, TORT INCLUDING NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE), EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, AND EVEN IF A REMEDY FAILS OF ITS ESSENTIAL PURPOSE.",
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, QUADRA’S AND ITS SUPPLIERS’ AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT, THE SOFTWARE, OR THE SERVICES WILL NOT EXCEED THE GREATER OF: (A) THE AMOUNTS YOU PAID TO QUADRA FOR THE SPECIFIC PRODUCT OR SERVICE GIVING RISE TO THE CLAIM DURING THE TWELVE (12) MONTHS BEFORE THE CLAIM; OR (B) FIFTY U.S. DOLLARS (US $50) IF YOU OBTAINED ONLY A FREE TRIAL OR COMPLIMENTARY ENTITLEMENT.",
      "The foregoing limitations do not apply to liability for death or personal injury caused by negligence where such limitation is prohibited, for fraud or fraudulent misrepresentation, or for any other liability that cannot be limited under applicable law.",
      "Some jurisdictions do not allow limitation of certain damages. In those jurisdictions, liability is limited to the fullest extent permitted.",
    ],
  },
  {
    id: "indemnity",
    heading: "21. Indemnity",
    paragraphs: [
      "To the extent permitted by law, if you are a Business User (using the Software in the course of a trade, business, or profession, or on behalf of an entity), you will defend, indemnify, and hold harmless Quadra and its officers, directors, employees, and agents from and against claims, damages, losses, and expenses (including reasonable attorneys’ fees) arising out of: (a) your misuse of the Software or Services; (b) your breach of this Agreement; (c) Your Content; or (d) your violation of law or third-party rights. We may assume exclusive defense of any matter subject to indemnity; you will cooperate.",
    ],
  },
  {
    id: "termination",
    heading: "22. Term and termination",
    paragraphs: [
      "This Agreement remains in effect until terminated. Subscriptions end as described in their terms. Your license terminates automatically if you materially breach this Agreement and, where cure is reasonably possible, fail to cure within thirty (30) days after notice (or immediately for breach of license-scope, payment fraud, or TPM circumvention).",
      "Upon termination you must stop all use of the Software and Services and destroy or permanently delete copies in your possession or control, except copies you are required to retain by law or that remain necessary solely for archival disaster recovery and are not used in production.",
      "Sections that by their nature should survive (including ownership, restrictions, disclaimer, limitation of liability, indemnity, export, governing law, and this survival clause) survive termination.",
      "Termination does not limit other remedies. Fees paid are non-refundable except as the Refund Policy or mandatory law requires.",
    ],
  },
  {
    id: "export-usgov",
    heading: "23. Export controls and U.S. Government rights",
    paragraphs: [
      "You will not export, re-export, or transfer the Software or technical data except in compliance with applicable export-control and sanctions laws (including those of the United States and your jurisdiction). You represent that you are not a prohibited party and are not located in a comprehensively embargoed jurisdiction.",
      "If you are a U.S. Government end user, the Software and Documentation are “commercial computer software” and “commercial computer software documentation” developed exclusively at private expense. Use, duplication, and disclosure by the Government are subject only to the rights granted in this Agreement, consistent with FAR 12.212 and DFARS 227.7202 or successor regulations.",
    ],
  },
  {
    id: "force-majeure",
    heading: "24. Force majeure",
    paragraphs: [
      "Quadra is not liable for delay or failure to perform due to causes beyond its reasonable control, including acts of God, natural disaster, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, shortages of transportation, facilities, fuel, energy, labor, or materials, or failures of public networks or utilities.",
    ],
  },
  {
    id: "governing-law",
    heading: "25. Governing law; disputes; venue",
    paragraphs: [
      "Except where mandatory consumer law of your country of residence requires otherwise, this Agreement is governed by the laws of the State of Delaware, United States of America, without regard to conflict-of-law principles, and without application of the United Nations Convention on Contracts for the International Sale of Goods.",
      "Subject to non-waivable consumer venue rights, the state and federal courts located in Wilmington, Delaware, will have exclusive jurisdiction over disputes arising out of or relating to this Agreement, and each party consents to personal jurisdiction there.",
      "WHERE PERMITTED BY LAW, YOU AND QUADRA WAIVE ANY RIGHT TO A JURY TRIAL AND AGREE THAT DISPUTES WILL BE BROUGHT ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. If this waiver is found unenforceable as to a particular claim, that claim must proceed in court and the remainder of this section continues in effect.",
      "Either party may seek injunctive or other equitable relief in any court of competent jurisdiction to protect intellectual property or confidential information.",
    ],
  },
  {
    id: "miscellaneous",
    heading: "26. Miscellaneous",
    paragraphs: [
      "Entire agreement. This Agreement, together with the Privacy Policy, Refund Policy, and any product-specific terms, order form, or subscription terms presented at purchase, constitutes the entire agreement between you and Quadra regarding the Software and Services and supersedes all prior or contemporaneous oral or written understandings on that subject. Additional or conflicting terms in your purchase order are rejected unless Quadra expressly accepts them in a signed writing.",
      "Amendments. We may update this Agreement by posting a revised version and changing the version identifier. For material changes affecting existing purchasers, we will require renewed acceptance where the website or Software prompts for it, or provide notice by Account email where reasonably available. The version you accepted governs until you accept a newer version or, for continued website use after notice, as permitted by law.",
      "Severability. If any provision is held unenforceable, it will be modified to the minimum extent necessary to make it enforceable, or severed, and the remaining provisions continue in full force.",
      "Waiver. Failure to enforce any provision is not a waiver of future enforcement. Waivers must be in writing to be effective.",
      "Assignment. You may not assign this Agreement without our prior written consent, except to a successor in connection with a permitted Entitlement transfer under Section 14. Quadra may assign this Agreement to an affiliate or in connection with a merger, acquisition, corporate reorganization, or sale of assets. Subject thereto, this Agreement binds permitted successors and assigns.",
      "Notices. We may provide notices via the website, in-product messages, or the email associated with your Account. Legal notices to Quadra must be sent to support@quadraaudio.com with a copy marked for “Legal”, unless we publish an updated address.",
      "Language. The English-language version of this Agreement controls. Translations, if any, are for convenience only.",
      "Relationship. The parties are independent contractors. This Agreement does not create a partnership, joint venture, employment, or agency relationship.",
      "Audit. During the term and for two (2) years thereafter, if you are a Business User, Quadra may upon reasonable notice audit your relevant records and systems solely to verify compliance with Entitlements, remotely or on-site during normal business hours. If an underpayment or excess use exceeding five percent (5%) is found, you will promptly pay the shortfall and reasonable audit costs. This audit right does not apply to Consumer Users using Software solely for personal non-business purposes.",
      "Contact. Questions about this Agreement: support@quadraaudio.com.",
    ],
  },
  {
    id: "consumer",
    heading: "27. Consumer rights not affected",
    paragraphs: [
      "Nothing in this Agreement excludes, restricts, or modifies any consumer guarantee, right, or remedy under laws that cannot be excluded (including, where applicable, European Union consumer law and similar regimes). If you are a consumer in Australia, our goods come with guarantees that cannot be excluded under the Australian Consumer Law; you may be entitled to a replacement or refund for a major failure and compensation for other reasonably foreseeable loss or damage.",
      "If you are a consumer, certain liability caps, warranty limits, class-action waivers, or governing-law clauses may not apply to you to the extent prohibited.",
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
