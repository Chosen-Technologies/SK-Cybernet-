# SK Cybernet Implementation Guide

Product of Chosen Technologies  
Status: Draft v1.0  
Date: July 2026  
Document purpose: Engineering implementation reference

## 1. Overview

SK Cybernet is a mobile-first Progressive Web App (PWA) for flexible hub and workspace access. The platform replaces rigid subscription plans with a wallet-funded credit system. Users fund a wallet, settled balances are automatically converted into platform credits, users redeem those credits for Daily, Weekly, or Monthly access coupons, and receive booking passes that can be scanned or verified at the hub.

The system has three primary surfaces:

- Marketing Site: public web-facing site with long-form content, product education, pricing explanation, FAQs, trust pages, and calls to action into the PWA.
- User PWA: fintech-style application for onboarding, wallet funding, automatic credit balance, coupon redemption, booking, pass management, transaction history, and account security.
- Admin Console: internal operations system for account monitoring, student verification, wallet and transaction oversight, dispute resolution, booking visibility, and account flagging or suspension.

The system must be implemented with security, traceability, payment reliability, and operational control as first-class concerns.

## 2. Product Rules To Implement

### 2.1 Identity And Onboarding

Users can start onboarding with either:

- Google OAuth signup.
- Custom email and password signup.

For Google OAuth signup, OAuth only creates the initial trusted identity. After OAuth callback, the user must be redirected into onboarding completion before accessing the main dashboard:

1. Set an account password.
2. Add a phone number.
3. Verify the phone number through OTP/2FA.
4. Set a 6-digit login PIN.
5. Set a 4-digit payment PIN.
6. Optionally request student discount status by uploading a student ID.

For custom email/password signup, the user already has a password but must still verify phone number and set both PINs.

Phone verification is mandatory before any PIN setup or PIN change.

### 2.2 Wallet Funding

Users can fund wallets through:

- Paystack card payments.
- Paystack direct debit where supported.
- Paystack Dedicated Virtual Account assigned one-to-one to the user's profile.

Wallet funding must be confirmed through trusted Paystack webhooks before value is made available to the user. Once settlement is verified, the naira value is automatically converted into credits using the configured credit-to-naira exchange rate. Pending or disputed money should stay in escrow until the platform confirms settlement or an admin resolves the dispute.

### 2.3 Credits

Credits are the platform's internal access currency. Users do not manually buy credits as a separate checkout step. Instead, every verified wallet funding event automatically increases the user's available credit balance, similar to how a banking ledger posts settled value into an account.

Each auto-converted funding bundle should receive a unique human-readable credit reference code. The charter repeatedly references 6-digit credit codes, so implementation should default to 6 digits unless the business finalizes a different length.

Credit status values:

- `active`
- `partially_redeemed`
- `redeemed`
- `expired`
- `voided`

### 2.4 Coupons

Coupons define access tiers:

- Daily
- Weekly
- Monthly

Each coupon has:

- Type.
- Credit cost.
- Validity duration.
- Student discount rule.
- Expiry policy.
- Redemption limits.

Coupon pricing should be managed from the backend or admin console, not hardcoded into the frontend.

### 2.5 Booking And Passes

When a user redeems credits for a coupon, the system creates a booking and issues a Pass ID.

Each booking must include:

- User reference.
- Coupon reference.
- Credits consumed.
- Start date and end date.
- Pass ID.
- QR payload.
- Booking status.

Booking status values:

- `pending`
- `confirmed`
- `checked_in`
- `cancelled`
- `expired`
- `refunded`

### 2.6 Transaction History

Every wallet, credit, coupon, booking, refund, and dispute action must be recorded in a unified ledger.

The transaction ledger must support:

- User-facing transaction history.
- Admin-wide transaction visibility.
- Reconciliation with Paystack references.
- Audit trail for disputes, naira settlement, credit conversion, and credit balance changes.

Ledger records should be append-only. Corrections should be represented by reversal or adjustment records, not by silently mutating previous financial history.

## 3. Recommended Architecture

## 3.1 Monorepo Layout

```text
sk-cybernet/
  apps/
    web/                 # Next.js public marketing and content site
    app/                 # Next.js installable user PWA
    admin/               # Next.js admin console
    api/                 # NestJS backend API
  packages/
    ui/                  # Shared UI primitives and app components
    types/               # Shared DTOs, API contracts, enums
    config/              # Shared TypeScript, ESLint, Tailwind config
    utils/               # Shared validation, formatting, constants
  infra/
    docker/
    nginx/
    scripts/
  docs/
    architecture.md
    api.md
    security.md
  docker-compose.yml
  turbo.json
  package.json
  implementation.md
```

This structure keeps the product organized from the start while allowing the marketing site, user PWA, admin console, backend, and shared packages to evolve together without mixing public content concerns with authenticated product workflows.

## 3.2 Frontend: Next.js

Use Next.js for all three frontend apps because it provides:

- File-based routing for public, user, and admin screens.
- Server-side rendering where useful.
- Strong TypeScript support.
- Mature ecosystem for SEO, authentication, forms, dashboards, and PWA tooling.
- Easy deployment to modern Node hosting platforms.

Recommended frontend structure:

```text
apps/web/
  src/
    app/
      page.tsx
      about/
      pricing/
      how-it-works/
      students/
      faq/
      contact/
      legal/
    components/
    content/
    lib/
    styles/

apps/app/
  src/
    app/
      (auth)/
      (onboarding)/
      (dashboard)/
    components/
    features/
      auth/
      wallet/
      credits/
      coupons/
      bookings/
      transactions/
      profile/
    lib/
    styles/

apps/admin/
  src/
    app/
      (auth)/
      (console)/
    components/
    features/
      auth/
      users/
      wallets/
      disputes/
      bookings/
      coupons/
      verification/
      admin/
    lib/
    styles/
```

Frontend boundaries:

- `apps/web` is the public marketing and content site. It should prioritize SEO, fast page loads, long-form explainers, trust content, and conversion into signup.
- `apps/app` is the main installable PWA. It should feel like a modern fintech dashboard, with a clean wallet-first interface inspired by Raenest more than a generic SaaS dashboard.
- `apps/admin` is the internal console. It should be dense, operational, searchable, auditable, and optimized for staff workflows rather than marketing polish.

## 3.3 Styling: Tailwind CSS

Use Tailwind CSS for:

- Fast, consistent mobile-first design.
- Small design system primitives.
- Responsive dashboards.
- Easy dark/light mode support if required.

Validation:

Tailwind is a strong fit because this project needs speed, maintainability, and mobile responsiveness more than a heavily bespoke design framework. It also pairs well with shared component packages.

## 3.4 Backend: NestJS

Use NestJS for the API because it provides:

- Modular architecture.
- Dependency injection.
- Guards, interceptors, pipes, and filters.
- Strong validation workflows.
- Clean organization for complex domains like auth, payments, wallet ledgers, and admin controls.

Recommended backend structure:

```text
apps/api/
  src/
    modules/
      auth/
      users/
      wallet/
      payments/
      credits/
      coupons/
      bookings/
      transactions/
      disputes/
      uploads/
      notifications/
      admin/
    common/
      guards/
      decorators/
      filters/
      pipes/
      interceptors/
    config/
    database/
```

Validation:

NestJS is a good fit because SK Cybernet has clear business domains and strict security requirements. The framework encourages separation of concerns and makes it easier to enforce authorization, validation, and audit logging across modules.

## 3.5 Database: PostgreSQL

Use PostgreSQL as the primary database.

PostgreSQL should store:

- Users.
- Wallets.
- Credit bundles.
- Coupon definitions.
- Bookings.
- Transactions.
- Disputes.
- Student verification records.
- Auth credentials.
- OTP and session metadata.

Validation:

PostgreSQL is the right default because wallet and booking systems require transactional consistency. Naira settlement, automatic credit conversion, credit redemption, and booking creation must happen atomically to prevent double-spend bugs.

## 3.6 ORM: Prisma Or TypeORM

Use Prisma unless the team strongly prefers TypeORM.

Prisma advantages:

- Excellent TypeScript developer experience.
- Clear schema migrations.
- Generated typed client.
- Good fit for monorepos.

TypeORM advantages:

- Closer integration with some NestJS patterns.
- Entity-based model familiar to many backend teams.

Recommendation:

Use Prisma for speed, type safety, and easier onboarding. Wrap Prisma access inside NestJS services so the ORM can be changed later if needed.

## 3.7 Redis

Use Redis for:

- OTP rate limiting.
- Login and PIN attempt throttling.
- Short-lived verification state.
- Background job queues.
- Temporary idempotency locks.

Validation:

Redis is appropriate because these workloads are fast, temporary, and high-frequency. It should not be used as the source of truth for money, credits, bookings, or identity.

## 3.8 Payments: Paystack

Use Paystack for:

- Card funding.
- Direct debit where available.
- Dedicated Virtual Accounts.
- Payment webhooks.
- Transaction verification.

Validation:

Paystack is suitable for a Nigerian naira-based product because it supports local payment rails and virtual accounts. The backend must still verify every funding event server-side and reconcile webhook data before crediting wallets.

## 3.9 Storage

Use a private object storage layer for:

- Student ID uploads.
- Profile images.
- Verification documents.

For local development, use Docker-backed storage or a local volume. For production, use an S3-compatible provider or cloud object storage with private access.

Validation:

Student IDs are sensitive documents. They must not be stored in publicly readable buckets or served through predictable URLs.

## 3.10 Background Jobs

Use a Redis-backed job queue such as BullMQ for:

- Sending OTP messages.
- Sending email notifications.
- Processing Paystack webhook follow-up jobs.
- Expiring credits, coupons, and bookings.
- Reconciliation jobs.
- Booking reminders.

Validation:

Payment and notification workflows should not depend on long-running HTTP requests. Background jobs improve reliability and make retries easier.

## 4. Core Backend Modules

### 4.1 Auth Module

Responsibilities:

- Google OAuth signup as an onboarding entry point.
- Email/password registration and login.
- Post-OAuth password setup.
- Onboarding completion state tracking.
- JWT access token issuance.
- Refresh token rotation.
- Phone number OTP verification.
- Login PIN setup and validation.
- Payment PIN setup and validation.
- Password reset.
- Device/session tracking.

Security requirements:

- Passwords and PINs must be salted and hashed.
- Google OAuth users must set a local account password before onboarding is considered complete.
- Users must not access wallet, credits, bookings, or profile-sensitive areas until required onboarding steps are complete.
- PINs must never be logged.
- OTPs must expire quickly.
- OTP resend attempts must be rate-limited.
- PIN attempts must be rate-limited and lockable.
- Refresh tokens should be rotated and revocable.

### 4.2 Users Module

Responsibilities:

- User profile.
- Role management.
- Student discount status.
- Account flags.
- Suspension state.
- KYC/student verification status.

Suggested roles:

- `user`
- `admin`
- `super_admin`
- `support`

### 4.3 Wallet Module

Responsibilities:

- Wallet creation.
- Settled naira funding records.
- Available credit balance.
- Escrowed naira value.
- Escrowed credit value where needed.
- Balance holds.
- Wallet funding status.
- Credit spend validation.

Critical rule:

Wallet funding, credit conversion, and credit spend updates must be performed inside database transactions and must always create corresponding ledger entries.

### 4.4 Payments Module

Responsibilities:

- Paystack transaction initialization.
- Dedicated Virtual Account creation.
- Webhook verification.
- Funding confirmation.
- Automatic credit conversion after verified settlement.
- Idempotency handling.
- Payment reconciliation.

Webhook rules:

- Verify webhook signature.
- Store raw event payload.
- Ignore duplicate events through idempotency keys.
- Confirm transaction with Paystack where necessary.
- Post credits to the wallet only after verified settlement.

### 4.5 Credits Module

Responsibilities:

- Automatic credit issuance from settled wallet funding.
- 6-digit code generation.
- Credit ownership.
- Credit status.
- Credit ledger.
- Expiry rules.

Code generation:

- Generate a numeric code.
- Check uniqueness among active codes.
- Retry on collision.
- Store only after a verified settlement event is ready to be posted to the user's credit balance.

For stronger uniqueness, pair the 6-digit public code with an internal UUID.

### 4.6 Coupons Module

Responsibilities:

- Daily, Weekly, and Monthly coupon definitions.
- Credit cost rules.
- Student discount handling.
- Coupon activation/deactivation.
- Redemption policy.

Implementation note:

Coupon pricing should be data-driven. Admins should eventually be able to update coupon costs without deploying code.

### 4.7 Booking Module

Responsibilities:

- Coupon redemption into bookings.
- Pass ID generation.
- QR payload generation.
- Booking validity windows.
- Cancellation and refund rules.
- Check-in verification.

Pass ID recommendation:

Use a short alphanumeric public Pass ID backed by an internal UUID. This makes hub-desk lookup easier while keeping database references globally unique.

### 4.8 Transactions Module

Responsibilities:

- Unified ledger records.
- User transaction history.
- Admin transaction feed.
- Reversal and adjustment records.
- Reconciliation metadata.

Transaction categories:

- `wallet_funding`
- `wallet_escrow_hold`
- `wallet_escrow_release`
- `credit_conversion`
- `coupon_redemption`
- `booking_creation`
- `booking_refund`
- `admin_adjustment`
- `dispute_resolution`

### 4.9 Disputes Module

Responsibilities:

- Funding dispute creation.
- Failed webhook review.
- Double charge handling.
- Chargeback tracking.
- Admin resolution notes.
- Refund or release actions.

Dispute status values:

- `open`
- `under_review`
- `resolved_approved`
- `resolved_rejected`
- `refunded`

### 4.10 Uploads Module

Responsibilities:

- Student ID upload.
- Private file storage.
- File validation.
- Secure file retrieval for admins.
- Verification status updates.

Validation requirements:

- Enforce file size limits.
- Allow only safe image or PDF formats.
- Scan or validate uploaded files where possible.
- Do not expose files publicly.

### 4.11 Notifications Module

Responsibilities:

- OTP delivery.
- Funding confirmations.
- Credit conversion receipts.
- Booking confirmations.
- Booking reminders.
- Dispute status updates.

Channels:

- SMS.
- Email.
- PWA push notifications.

## 5. High-Level Data Model

### 5.1 User

Fields:

- `id`
- `email`
- `phone`
- `fullName`
- `role`
- `authProvider`
- `onboardingStatus`
- `studentStatus`
- `isSuspended`
- `createdAt`
- `updatedAt`

### 5.2 AuthCredential

Fields:

- `userId`
- `passwordHash`
- `passwordSetAt`
- `loginPinHash`
- `paymentPinHash`
- `phoneVerifiedAt`
- `loginPinSetAt`
- `paymentPinSetAt`
- `lastPinChangedAt`
- `failedLoginAttempts`
- `failedPaymentPinAttempts`

### 5.3 Wallet

Fields:

- `id`
- `userId`
- `availableCredits`
- `escrowedCredits`
- `totalSettledFundingKobo`
- `totalEscrowedFundingKobo`
- `currency`
- `creditExchangeRate`
- `paystackCustomerCode`
- `virtualAccountReference`
- `createdAt`
- `updatedAt`

### 5.4 CreditBundle

Fields:

- `id`
- `userId`
- `publicCode`
- `sourceTransactionId`
- `fundingAmountKobo`
- `initialCredits`
- `remainingCredits`
- `exchangeRate`
- `status`
- `expiresAt`
- `createdAt`

### 5.5 Coupon

Fields:

- `id`
- `type`
- `name`
- `creditCost`
- `studentCreditCost`
- `validityDays`
- `isActive`
- `createdAt`

### 5.6 Booking

Fields:

- `id`
- `userId`
- `couponId`
- `passId`
- `qrPayload`
- `startsAt`
- `endsAt`
- `status`
- `createdAt`

### 5.7 Transaction

Fields:

- `id`
- `userId`
- `walletId`
- `type`
- `direction`
- `amount`
- `creditAmount`
- `currency`
- `status`
- `provider`
- `providerReference`
- `metadata`
- `createdAt`

### 5.8 Dispute

Fields:

- `id`
- `transactionId`
- `userId`
- `status`
- `reason`
- `resolutionNotes`
- `handledByAdminId`
- `createdAt`
- `resolvedAt`

## 6. Critical Transaction Flows

### 6.1 Google OAuth Onboarding Flow

1. User selects Google signup in `apps/app`.
2. Google returns OAuth profile to the backend callback.
3. Backend creates or links the user account.
4. Backend marks onboarding as incomplete.
5. User is redirected to post-OAuth password setup.
6. User sets account password.
7. User adds phone number.
8. Backend sends OTP.
9. User verifies phone number with OTP.
10. User sets 6-digit login PIN.
11. User sets 4-digit payment PIN.
12. Backend marks required onboarding as complete.
13. User is allowed into the main dashboard.

Required route behavior:

- If password is missing, redirect to password setup.
- If phone is unverified, redirect to phone verification.
- If login PIN is missing, redirect to login PIN setup.
- If payment PIN is missing, redirect to payment PIN setup.
- Wallet, funding, credits, coupons, bookings, and profile-sensitive routes must reject incomplete onboarding server-side, not only through frontend navigation.

### 6.2 Wallet Funding Flow

1. User selects funding method.
2. Backend creates Paystack transaction or confirms virtual account mapping.
3. User completes payment.
4. Paystack sends webhook.
5. Backend verifies webhook signature.
6. Backend verifies event idempotency.
7. Backend confirms settlement status.
8. Backend starts a database transaction.
9. Backend records the naira funding transaction.
10. Backend converts the settled amount into credits using the active exchange rate.
11. Backend generates a unique credit reference code.
12. Backend creates the credit bundle.
13. Backend updates the user's available credit balance.
14. Backend records the credit conversion ledger entry.
15. Database transaction commits.
16. User receives funding and credit-posting confirmation.

### 6.3 Automatic Credit Conversion Rules

1. Credits are posted only after verified settlement.
2. The exchange rate used for each conversion is stored with the credit bundle and transaction record.
3. If funding is placed in escrow, credits must either remain unavailable or be posted as escrowed credits until release.
4. Duplicate Paystack events must not create duplicate credits.
5. Refunded or reversed funding must create reversal ledger entries and reduce available or escrowed credits according to the refund policy.
6. Manual admin adjustments must include a reason, actor, and audit record.

### 6.4 Booking Flow

1. User selects coupon tier.
2. Backend calculates credit cost.
3. User chooses booking date window.
4. User confirms with payment PIN.
5. Backend validates available credits.
6. Backend consumes credit value.
7. Backend creates booking.
8. Backend generates Pass ID and QR payload.
9. Ledger transaction is recorded.
10. Booking appears in the user's passes.

### 6.5 Admin Dispute Resolution Flow

1. Admin opens dispute queue.
2. Admin reviews transaction, wallet state, Paystack metadata, and user history.
3. Admin selects resolution.
4. Backend writes resolution notes.
5. Backend releases escrow, rejects dispute, refunds, or creates adjustment.
6. Transaction ledger is updated.
7. User is notified.

## 7. Security Implementation

### 7.1 Authentication

- Use short-lived JWT access tokens.
- Use refresh token rotation.
- Store refresh token hashes, not plaintext tokens.
- Revoke refresh tokens on password reset or suspicious activity.
- Protect admin routes with role-based guards.

### 7.2 PIN Handling

- Hash login PIN and payment PIN with a strong password hashing algorithm.
- Never store plaintext PINs.
- Never send PINs back to the client.
- Require verified phone number before setup or change.
- Require OTP confirmation before changing either PIN.
- Lock or cool down accounts after repeated failed PIN attempts.

### 7.3 Payment Security

- Verify Paystack webhooks with signature validation.
- Use idempotency checks for all payment events.
- Never trust client-side payment success alone.
- Reconcile provider references against Paystack.
- Keep raw webhook payloads for audit and debugging.

### 7.4 Wallet And Ledger Safety

- Use database transactions for wallet debit/credit operations.
- Store money as integer minor units, for example kobo, not floating-point values.
- Use append-only ledger records.
- Require admin adjustments to include reason and actor.
- Prevent negative credit balances at database and service levels.

### 7.5 Upload Security

- Store uploaded IDs privately.
- Use signed URLs or authenticated proxy downloads.
- Validate file type and size.
- Restrict access to authorized admin roles.
- Log admin document access where possible.

## 8. Frontend Apps And Screens

### 8.1 Marketing Site: `apps/web`

Core pages:

- Home.
- How it works.
- Wallet and credits explainer.
- Coupon tiers and pricing.
- Student discount.
- Hub access and booking.
- Security and trust.
- FAQs.
- About Chosen Technologies.
- Contact.
- Terms, privacy, and acceptable use.

Content requirements:

- Use clear long-form sections that explain wallet funding, automatic credit conversion, coupons, bookings, Pass IDs, student verification, and security.
- Include strong calls to action into `apps/app` signup and login.
- Keep public pricing and credit explanations consistent with backend coupon configuration.
- Optimize metadata, page titles, descriptions, and structured content for search visibility.

### 8.2 User PWA: `apps/app`

Core screens:

- Welcome and auth.
- Post-OAuth password setup.
- Phone verification.
- PIN setup.
- Student verification upload.
- Dashboard.
- Wallet.
- Fund wallet.
- Credit balance.
- Credit history.
- Coupon selection.
- Booking calendar.
- My passes.
- Pass QR detail.
- Transaction history.
- Security settings.
- Profile.

UI direction:

- Use a fintech-style dashboard inspired by Raenest: calm, trustworthy, account-first, and transaction-heavy.
- Make the credit balance the primary dashboard signal.
- Show funding methods, virtual account details, recent transactions, active passes, and quick booking actions without clutter.
- Use compact summary cards, clear transaction rows, status badges, and secure confirmation flows.
- Avoid marketing-style hero sections inside the app. The signed-in experience should feel like a focused financial product.
- Use white and dark blue as the primary color system. White should carry the main surfaces, while dark blue should anchor navigation, primary actions, active states, and trust/security moments.
- Do not use emojis in the app interface. Use lucide-react icons or approved product icons for actions and navigation.

Home dashboard reference:

- The first signed-in screen should follow the attached fintech mobile reference: greeting at the top, main balance card, action icons, recent transactions, quick actions, and bottom navigation.
- The main card should show the user's available credit balance prominently, with a visibility toggle for hiding/showing sensitive balance values.
- The balance card should also expose important account details such as virtual account bank/name/reference, masked where appropriate.
- Primary action icons should include Add Money, Send or Transfer where supported, Convert or Credit Details, Book Space, My Passes, and Transactions. Use icon buttons with short text labels.
- Quick actions should include Pay/Book Access, Payment Link or Funding Reference where relevant, Rewards or Student Discount, Support, and Security.
- Recent transactions should appear directly below the main card with amount, type, date, and status.
- Bottom navigation should prioritize Home, Wallet or Credits, Bookings/Passes, Transactions, and Account.
- Keep the dashboard mobile-first, card-based, and compact, but avoid nesting cards inside cards.

### 8.3 Admin Console: `apps/admin`

Core screens:

- Admin login.
- Dashboard overview.
- Users table.
- User detail.
- Wallet and transaction detail.
- Student verification queue.
- Dispute queue.
- Booking monitor.
- Coupon pricing management.
- Account flags and suspension.
- Audit log.

## 9. API Design Standards

Use versioned REST endpoints first:

```text
/api/v1/auth
/api/v1/users
/api/v1/wallet
/api/v1/payments
/api/v1/credits
/api/v1/coupons
/api/v1/bookings
/api/v1/transactions
/api/v1/disputes
/api/v1/admin
```

Standards:

- Use DTO validation on every request.
- Return consistent error shapes.
- Use pagination for lists.
- Use server-side authorization checks.
- Use OpenAPI/Swagger documentation during development.
- Keep frontend and backend types synchronized through `packages/types`.

## 10. Environment Configuration

Required environment variables:

```text
DATABASE_URL=
REDIS_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
PAYSTACK_WEBHOOK_SECRET=
WEB_BASE_URL=
APP_BASE_URL=
ADMIN_BASE_URL=
API_BASE_URL=
UPLOAD_STORAGE_PATH=
SMS_PROVIDER_API_KEY=
EMAIL_PROVIDER_API_KEY=
```

Rules:

- Do not commit real secrets.
- Provide `.env.example` files.
- Use different secrets for local, staging, and production.
- Rotate production secrets when exposed or when team members change.

## 11. Testing Strategy

### 11.1 Unit Tests

Cover:

- Post-OAuth onboarding status transitions.
- Coupon pricing.
- Credit code generation.
- PIN validation.
- Funding-to-credit conversion calculations.
- Credit balance calculations.
- Transaction status transitions.
- Booking validity windows.

### 11.2 Integration Tests

Cover:

- Google OAuth callback to password setup redirect.
- Onboarding route guards.
- Wallet funding webhook handling.
- Automatic credit conversion transaction.
- Coupon redemption.
- Booking creation.
- Dispute resolution.
- Admin authorization.

### 11.3 End-To-End Tests

Cover:

- Google OAuth signup to password setup.
- Password setup to phone verification.
- PIN setup.
- Wallet funding mock flow.
- Automatic credit posting.
- Booking and pass generation.
- Admin student verification.
- Admin dispute resolution.

### 11.4 Security Tests

Cover:

- Rate limiting.
- Unauthorized admin access.
- Invalid webhook signatures.
- PIN brute-force limits.
- Upload validation.
- Negative credit balance prevention.

## 12. Deployment Architecture

### 12.1 Local Development

Use Docker Compose for:

- PostgreSQL.
- Redis.
- Local storage volume.
- API.
- Web app.

### 12.2 Staging

Staging should mirror production as closely as possible:

- Separate database.
- Separate Paystack test keys.
- Separate storage bucket.
- Seeded test accounts.
- Admin test flows.

### 12.3 Production

Production should include:

- Managed PostgreSQL or a properly backed-up database server.
- Managed Redis or monitored Redis instance.
- HTTPS termination through reverse proxy or platform provider.
- Private object storage.
- Centralized logs.
- Error tracking.
- Database backups.
- Uptime monitoring.
- CI/CD pipeline.

## 13. Implementation Workplan

## Phase 0: Project Setup

Goal: Create the foundation for development.

Tasks:

- Initialize monorepo.
- Create `apps/web` with Next.js, TypeScript, Tailwind CSS, and public marketing/content routes.
- Create `apps/app` with Next.js, TypeScript, Tailwind CSS, and PWA setup.
- Create `apps/admin` with Next.js, TypeScript, Tailwind CSS, and protected admin routes.
- Create `apps/api` with NestJS and TypeScript.
- Create shared packages for `types`, `utils`, `ui`, and `config`.
- Configure ESLint, Prettier, TypeScript, and path aliases.
- Add Docker Compose for PostgreSQL and Redis.
- Add `.env.example` files.
- Add basic CI checks for lint, typecheck, and tests.

Deliverable:

- Developers can clone the repo, run setup, and start the marketing site, user PWA, admin console, API, database, and Redis locally.

## Phase 1: Database And Core API Foundation

Goal: Establish data persistence and backend structure.

Tasks:

- Configure Prisma.
- Define initial schema.
- Add migrations.
- Create base NestJS modules.
- Add global validation pipe.
- Add error handling.
- Add request logging.
- Add Swagger/OpenAPI docs.
- Seed initial coupon definitions.

Deliverable:

- Backend has a working database connection, migrations, seed data, and documented base endpoints.

## Phase 2: Identity And Security

Goal: Implement account creation and secure access.

Tasks:

- Implement email/password registration.
- Implement Google OAuth signup.
- Redirect Google OAuth users to required password setup after callback.
- Implement post-OAuth password setup.
- Implement JWT access tokens.
- Implement refresh token rotation.
- Implement phone OTP flow.
- Implement login PIN setup.
- Implement payment PIN setup.
- Track onboarding completion state.
- Block dashboard, wallet, credits, coupons, bookings, and profile-sensitive routes until password, phone verification, and PIN setup are complete.
- Enforce phone verification before PIN setup or change.
- Add auth guards and role guards.
- Build `apps/app` auth, post-OAuth password, OTP, and PIN screens.

Deliverable:

- Users can create accounts, complete required password, phone, OTP, and PIN setup, then access the app securely.

## Phase 3: Wallet And Paystack Funding

Goal: Enable users to fund wallets safely and receive credits automatically after settlement.

Tasks:

- Create wallet on user registration.
- Integrate Paystack customer creation.
- Implement card funding initialization.
- Implement Dedicated Virtual Account provisioning.
- Implement webhook endpoint.
- Verify Paystack signatures.
- Add idempotency handling.
- Add wallet funding ledger entries.
- Add configurable credit-to-naira exchange rate.
- Add automatic funding-to-credit conversion.
- Generate credit reference codes after verified settlement.
- Post available or escrowed credits based on settlement state.
- Add escrow balance support.
- Build `apps/app` wallet dashboard and funding UI.

Deliverable:

- Users can fund wallets through Paystack, and verified payments automatically post credits through server-side ledger logic.

## Phase 4: Credits And Coupons

Goal: Manage credit balances and redeem credits for access coupons.

Tasks:

- Implement credit balance views and history.
- Implement credit bundle lifecycle rules.
- Record credit conversion and redemption ledger entries.
- Record ledger entries.
- Implement coupon definitions.
- Implement coupon pricing and student discount logic.
- Build `apps/app` credit wallet UI.
- Build `apps/app` coupon selection UI.

Deliverable:

- Users can view posted credits and redeem them against active coupon options based on current pricing.

## Phase 5: Booking And Pass IDs

Goal: Allow users to redeem credits for access bookings.

Tasks:

- Implement booking creation.
- Implement credit consumption.
- Generate Pass IDs.
- Generate QR payloads.
- Add booking status lifecycle.
- Add booking cancellation policy hooks.
- Build `apps/app` booking calendar.
- Build `apps/app` My Passes screen.
- Build `apps/app` Pass QR detail screen.

Deliverable:

- Users can redeem credits for Daily, Weekly, or Monthly bookings and receive scannable passes.

## Phase 6: Admin Console

Goal: Give operations staff control and visibility.

Tasks:

- Build `apps/admin` dashboard.
- Build `apps/admin` user search and detail views.
- Build `apps/admin` wallet and transaction views.
- Build `apps/admin` student verification queue.
- Build `apps/admin` dispute queue.
- Build `apps/admin` account flagging and suspension.
- Build `apps/admin` coupon pricing management.
- Add `apps/admin` audit log views.

Deliverable:

- Admins can monitor users, verify students, resolve disputes, manage coupon pricing, and control account status.

## Phase 7: Marketing Site And Content

Goal: Build the public web-facing site for education, trust, and conversion.

Tasks:

- Build `apps/web` home page.
- Build long-form how-it-works content.
- Build wallet and automatic credit conversion explainer.
- Build coupon tier and pricing pages.
- Build student discount content.
- Build FAQ, contact, terms, and privacy pages.
- Add SEO metadata and Open Graph tags.
- Add calls to action into `apps/app` signup and login.

Deliverable:

- The public site explains SK Cybernet clearly, ranks well for relevant searches, and routes users into the PWA.

## Phase 8: Notifications And Background Jobs

Goal: Make operational events reliable.

Tasks:

- Add BullMQ or equivalent job queue.
- Send OTP through SMS provider.
- Send email receipts.
- Add funding confirmation notifications.
- Add booking confirmation notifications.
- Add booking reminders.
- Add credit and booking expiry jobs.
- Add Paystack reconciliation jobs.

Deliverable:

- Time-sensitive and retryable work runs through background jobs instead of blocking API requests.

## Phase 9: PWA Polish And Offline Support

Goal: Improve mobile usability and installability.

Tasks:

- Add web app manifest.
- Add service worker.
- Cache safe static assets.
- Make pass details available offline after booking.
- Add install prompt support.
- Optimize low-bandwidth loading.
- Add responsive layout QA.
- Add accessibility checks.

Deliverable:

- `apps/app` behaves like a polished installable PWA and works well on mobile devices.

## Phase 10: Testing, Hardening, And QA

Goal: Prepare for real users and real money.

Tasks:

- Add unit tests for core business logic.
- Add integration tests for wallet, payments, credits, and bookings.
- Add E2E tests for key user and admin journeys.
- Run security tests for auth, PINs, uploads, and webhooks.
- Add load testing for auth and booking endpoints.
- Add database backup and restore testing.
- Validate payment reconciliation.

Deliverable:

- The platform has enough coverage and operational confidence for staging and pilot usage.

## Phase 11: Deployment

Goal: Launch a production-ready system.

Tasks:

- Provision production database.
- Provision production Redis.
- Configure object storage.
- Configure production environment variables.
- Configure HTTPS.
- Configure domain and DNS.
- Configure CI/CD deployment pipeline.
- Run migrations.
- Seed production coupon data.
- Configure Paystack live keys and webhook URL.
- Enable monitoring and alerts.
- Run smoke tests.

Deliverable:

- SK Cybernet is deployed to production with payment, booking, admin, and monitoring systems active.

## 14. Recommended MVP Scope

The first usable MVP should include:

- Email/password auth.
- Google OAuth.
- Phone OTP verification.
- Login PIN and payment PIN.
- Wallet creation.
- Paystack card funding.
- Paystack webhook verification.
- Automatic credit conversion after verified funding.
- Daily, Weekly, and Monthly coupons.
- Booking and Pass ID generation.
- User transaction history.
- Public marketing site with home, how-it-works, pricing, student discount, FAQ, and trust/security pages.
- Basic admin dashboard.
- Student ID upload and manual review.

Dedicated Virtual Accounts, direct debit, push notifications, advanced reconciliation, and offline pass caching can follow after the first controlled pilot if delivery time becomes tight.

## 15. Key Decisions Still Needed

Before implementation, the business should finalize:

- Credit-to-naira exchange rate.
- Whether credit public codes are 6 digits, 10 digits, or another format.
- Daily, Weekly, and Monthly coupon costs.
- Student discount percentage or fixed discounted price.
- Credit expiry policy.
- Coupon expiry policy.
- Booking cancellation and refund policy.
- Escrow release rules.
- Whether student verification is manual, automated, or hybrid.
- Pass ID format.
- Admin role hierarchy.
- SMS and email providers.
- Production hosting provider.

## 16. Implementation Priorities

Priority order:

1. Correct financial ledger.
2. Secure auth and PIN flows.
3. Reliable Paystack verification.
4. Atomic wallet, credit, and booking transactions.
5. Admin visibility.
6. Mobile-first user experience.
7. PWA polish.

The product should not launch publicly until payment webhooks, automatic credit conversion, credit redemption, booking creation, and transaction logging are tested together under realistic failure conditions.
