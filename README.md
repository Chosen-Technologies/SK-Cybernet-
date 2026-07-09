# SK Cybernet

Product of Chosen Technologies

SK Cybernet is a decentralized subscription and hub-access system for flexible workspace usage. Instead of locking users into rigid subscription plans, the platform lets users fund a wallet, automatically converts verified funding into credits, and allows those credits to be redeemed for Daily, Weekly, or Monthly hub access coupons.

The product is designed as a secure, mobile-first fintech-style experience for users and an operational control system for administrators.

## Product Summary

SK Cybernet gives each user a financial and access identity inside the platform:

- A secure user account.
- A wallet funded through Paystack.
- Automatic conversion of settled wallet funding into platform credits.
- Credit redemption for access coupons.
- Pre-booked hub access with Pass IDs and QR verification.
- Transparent transaction history.
- Admin oversight for accounts, disputes, student verification, bookings, and financial activity.

## App Surfaces

The planned monorepo contains three frontend surfaces and one backend API.

```text
apps/
  web/      # Public marketing and content site
  app/      # Main user PWA
  admin/    # Internal admin console
  api/      # NestJS backend API
```

### `apps/web`

The public web-facing marketing site. It should contain long-form content, SEO-friendly product explanations, pricing education, FAQs, trust/security pages, student discount information, and calls to action into the main PWA.

### `apps/app`

The main installable user PWA. This is the customer-facing product for onboarding, wallet funding, credit balance, coupon redemption, booking, passes, and transaction history.

The UI direction is fintech-first, inspired by Raenest and Moneipoint, with Raenest preferred. The main dashboard should use white and dark blue as primary colors, show a prominent balance card, action icons, recent transactions, quick actions, and bottom navigation. Emojis should not be used in the interface.

### `apps/admin`

The internal admin console for operational staff. It should support user monitoring, wallet and transaction review, student verification, dispute resolution, coupon management, booking visibility, account flagging, and audit logs.

### `apps/api`

The backend API. It owns authentication, wallet logic, payment verification, automatic credit conversion, coupon redemption, bookings, transactions, disputes, uploads, notifications, and admin workflows.

## Core User Flow

1. User signs up with Google OAuth or email/password.
2. Google OAuth users are redirected to set a local account password.
3. User adds and verifies phone number with OTP.
4. User sets a 6-digit login PIN.
5. User sets a 4-digit payment PIN.
6. User funds wallet through Paystack.
7. Verified funding is automatically converted into credits.
8. User redeems credits for Daily, Weekly, or Monthly coupons.
9. User books hub access and receives a Pass ID/QR credential.
10. User and admin can view the transaction trail.

## Technology Direction

- Frontend: Next.js, TypeScript, Tailwind CSS.
- Backend: NestJS, TypeScript.
- Database: PostgreSQL.
- Cache and queues: Redis.
- ORM: Prisma recommended.
- Payments: Paystack.
- UI icons: lucide-react or approved product icons.
- Storage: private object storage for student IDs and sensitive uploads.
- Infrastructure: Docker Compose for local development and staging foundations.

## Security Principles

- Passwords and PINs must be salted and hashed.
- Phone verification is required before PIN setup or PIN changes.
- Google OAuth users must set a local password before onboarding is complete.
- Wallet, credits, bookings, and sensitive profile routes must be blocked until onboarding is complete.
- Paystack webhooks must be verified server-side.
- Wallet funding, automatic credit conversion, and credit redemption must be ledger-backed and transactional.
- Student ID uploads must be private and access-controlled.
- Admin actions must be auditable.

## Documentation

The detailed build plan lives in:

- [`implementation.md`](./implementation.md)

That document covers the full architecture, backend modules, data model, critical flows, frontend screen expectations, testing strategy, deployment direction, and phased implementation workplan.

## Current Status

This repository currently contains the project planning foundation:

- `README.md`
- `implementation.md`
- `.env.example`
- `.gitignore`

Application scaffolding has not been generated yet.

