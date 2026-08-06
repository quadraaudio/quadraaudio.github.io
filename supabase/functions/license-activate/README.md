# license-activate

Quadra Guard for Mac apps (`quadra-matrix`).

Site auth is **Google Identity Services** (`googleAccessToken`). Do not use Supabase Auth.

## Actions

| action | Who | Input | Result |
|--------|-----|-------|--------|
| `issue` | Site (logged-in) | `googleAccessToken`, `hardwareId`, `productSlug` | one-time `code` (5 min) + seat bind |
| `issue-trial` | Site (logged-in) | same | one-time `code` for 14-day trial (one per **email** and per **HWID**) |
| `redeem` | Matrix app | `code`, `hardwareId`, `productSlug` | signed qkey (`claimsJSON` + `signatureHex`) — paid or trial |
| `deactivate` / `status` | Site / tools | Google token + hwid | seats / signed status |

### Trial error codes

| code | Meaning |
|------|---------|
| `trial_email_used` | This account already started a trial on another Mac |
| `trial_hwid_used` | This Mac already ran a trial under another account |
| `trial_expired` | Trial window ended |
| `has_license` | Account already has a full license — use `issue` instead |

## Deploy

```bash
# Migrations: license_activations, license_redeem_codes, product_trials
supabase db push   # or apply supabase/migrations/20260801_*.sql
supabase functions deploy license-activate --project-ref accvrbqjndibljfpsspc
supabase secrets set LICENSE_ED25519_PRIVATE_KEY=<64-char-hex>
```

## Sandbox keypair

Private (server only): `d9c61f0c1897d8342748cff144b29c042f6dc628b74879c5cc7405c1c712de78`  
Public (Matrix `LicenseCrypto.publicKeyHex`): `078d4f1bab828d55766b69db972a37e7006b589e08749429fb48e2e6ebe2b383`

## Web flow

1. App opens `https://quadraaudio.com/activate?hwid=…&product=quadra-matrix&mode=trial|paid&return=com.quadraaudio.matrix://activate`
2. Site calls `issue-trial` or `issue` → redirect `com.quadraaudio.matrix://activate?code=…`
3. App redeems → Keychain (signed trial or paid entitlement)
