# Security Specification & Threat Model for phoneG

## 1. Data Invariants
1. A User profile in `/users/{userId}` can only be created or modified by the authenticated user matching `userId`.
2. Public User IDs (`/userIds/{publicUserId}`) map to `uid`. Creation is permitted during registration for the authenticated user, but cannot be modified once set.
3. `/userPrivate/{userId}` and `/kycRecords/{userId}` are strictly isolated PII collections accessible ONLY by `request.auth.uid == userId`.
4. Coin balances in `/wallets/{userId}` can only be read by the owner `request.auth.uid == userId`. Direct updates to `coinBalance` by clients are disallowed, except through server transactions or validated self-registration bonus setup.
5. Transactions in `/transactions/{transactionId}` can only be created if `request.auth.uid` is either the `senderUid` or `recipientUid`, and users can only list/read transactions where `senderUid == request.auth.uid || recipientUid == request.auth.uid`.

## 2. Dirty Dozen Security Payloads
1. Spoofed User ID creation: Modifying another user's profile path `/users/victimUid`.
2. User ID hijacking: Modifying `/userIds/PL12345` mapping to point to attacker's UID.
3. Arbitrary Balance Modification: Overwriting `coinBalance` directly from `100` to `999999`.
4. PII Data Harvesting: Reading `/kycRecords` or `/userPrivate` for another user.
5. Anonymous Write Attack: Attempting to create user or transaction without authentication.
6. Transaction Forgery: Creating a transaction with `senderUid` set to another user.
7. Unbounded Payload Injection: Injecting a 1MB string in `firstName` or `note`.
8. Unverified Email Spoofing: Attempting admin or elevated bypass without email verification if required.
9. Ghost Field Injection: Adding `isAdmin: true` or `role: "superadmin"` into user document.
10. System Identifier Overwrite: Changing `createdAt` or `userId` on existing user profile.
11. Cross-User Document Upload: Accessing another user's PAN or Aadhaar card images in Firebase Storage.
12. Status Shortcutting: Arbitrarily setting `kycStatus` to `"verified"` directly from client SDK.
