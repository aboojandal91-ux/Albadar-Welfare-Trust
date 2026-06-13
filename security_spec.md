# Security Specification

## 1. Data Invariants
- `User` profiles can only be updated by the owner or an ADMIN.
- `Program` can only be created or updated by an ADMIN or TRUSTEE.
- `Donation` must be linked to a valid `Program`. Can be created by any registered user.
- `Expense` can only be created by an ADMIN.
- `Application` can only be created by a BENEFICIARY and evaluated (updated) by an ADMIN.
- `Config` acts as global app data, readable by everyone, modifiable by ADMINs only.

## 2. Red Team "Dirty Dozen" Payloads (Conceptual)
1. Shadow Update: Adding `isAdmin: true` to a profile update payload.
2. Value Poisoning: Updating `amount` in `Expense` with a string instead of a number.
3. ID Poisoning: Creating a program with `{programId}` as a 2KB string.
4. Email Spoofing Payload: Writing to profile where `email` is admin's email, but `emailVerified` is false.
5. Role Escalation: Regular User tries to change `role` to ADMIN.
6. Donation Forging: `Donation` payload where `userId` is not the `request.auth.uid`.
7. Program State Shortcutting: Trust User trying to update `Program` `status` to strange values.
8. Unapproved User Attempt: Unfinished profile trying to add `Expense`.
9. Beneficiary Forging Application: Application claiming another user's ID.
10. Query Scrape: Listing all users without being an ADMIN.
11. PII Blanket Test: Fetching other users' emails.
12. Atomic Sync Test: Changing `raised` on `Program` without matching Donation (can be bypassed using atomic batch updates, but handled by Functions normally. Since no functions, we update from client. To protect `Program.raised`, it is better to lock it to ADMINs or only allow specific additions, but we might just limit overall Program fields).

## 3. The Test Runner
[Skipping implementation to focus on generating hardened DRAFT_firestore.rules]
