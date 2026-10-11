# phoneG - Coin Buy & Coin Send Application

**phoneG** is a modern, mobile-first fintech web application for buying, transferring, and managing digital coins securely with real-time Firebase Cloud Firestore backend, Firebase Storage, and Firebase Authentication.

---

## 🌟 Key Application Features

1. **Splash / Welcome Screen**
   - Branded header, animated wallet illustration, and "Get Started" entry.
2. **Login & Registration Screen**
   - Dual-login support using either **Public User ID (e.g. PL18753)** or **Gmail Address**.
   - Show/Hide password toggle, password reset link, and terms acceptance.
3. **Three-Step Registration Wizard**
   - **Step 1: Personal Details** - First Name, Last Name, Mobile, Email, Password strength validator.
   - **Step 2: KYC Details** - PAN Card number & photo upload, Aadhaar Card 12-digit number & front/back photo uploads, Selfie upload.
   - **Step 3: Address Details** - Indian States & Districts dropdown dataset, 6-digit PIN code validation, City.
4. **Unique User ID & UID Generation**
   - Generates unique public **PL + 5 digits** ID (e.g. `PL18753`) verified for uniqueness on Firestore.
   - Maintains separate internal Firebase Auth `uid`.
5. **Registration Success Modal**
   - Animated celebration modal showing `PL18753` Public User ID and internal UID with copy buttons.
6. **Home Dashboard**
   - Total Coin Balance card with **500 Welcome Bonus Coins** initialized.
   - Quick Actions grid (Buy Coins, Send Coins, Receive Coins, Transaction History, Profile, KYC Status).
7. **Buy Coins**
   - Amount entry in INR (1 INR = 1 phoneG Coin), payment method selection (BHIM UPI, Debit/Credit Card, NetBanking, Instant PG Simulator).
   - Atomic wallet balance credit and payment order log.
8. **Send Coins**
   - Public User ID lookup (`PL18753`) with instant verification of recipient name.
   - 0.5% transaction fee calculation (minimum 1 coin fee).
   - Atomic Firestore transaction (debits sender, credits recipient, logs transaction).
9. **Receive Coins & QR Code**
   - Displays User ID with one-click copy button.
   - Dynamically generated QR Code for scanning and sharing.
10. **Transaction History**
    - Real-time `onSnapshot` updates.
    - Filter by All, Credits (+), and Debits (-), with search capability.

---

## 📁 Repository Structure

```
phoneg-app/
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firebase.json
├── security_spec.md
├── .github/
│   └── workflows/
│       └── deploy.yml
├── firebase/
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── storage.rules
├── functions/
│   ├── package.json
│   └── src/
│       └── index.ts
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── PasswordInput.tsx
│   │   └── TermsCheckbox.tsx
│   ├── common/
│   │   ├── AppButton.tsx
│   │   ├── AppHeader.tsx
│   │   ├── AppInput.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── LoadingOverlay.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ToastMessage.tsx
│   ├── dashboard/
│   │   ├── QuickActions.tsx
│   │   ├── RecentTransactions.tsx
│   │   └── WalletBalanceCard.tsx
│   ├── registration/
│   │   ├── AddressDetailsForm.tsx
│   │   ├── DocumentUpload.tsx
│   │   ├── KycDetailsForm.tsx
│   │   ├── PersonalDetailsForm.tsx
│   │   ├── RegistrationStepper.tsx
│   │   └── RegistrationSuccessModal.tsx
│   └── wallet/
│       ├── BuyCoinsForm.tsx
│       ├── ReceiveCoinsCard.tsx
│       ├── SendCoinsForm.tsx
│       └── TransactionList.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── WalletContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useFirestoreDocument.ts
│   └── useWallet.ts
├── lib/
│   ├── constants.ts
│   ├── firebase.ts
│   ├── firebaseErrors.ts
│   ├── formatters.ts
│   └── validators.ts
├── pages/
│   ├── BuyCoinsPage.tsx
│   ├── HomePage.tsx
│   ├── KycStatusPage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   ├── ProfilePage.tsx
│   ├── ReceiveCoinsPage.tsx
│   ├── RegisterPage.tsx
│   ├── SendCoinsPage.tsx
│   ├── SplashPage.tsx
│   └── TransactionsPage.tsx
├── routes/
│   └── AppRoutes.tsx
├── services/
│   ├── authService.ts
│   ├── kycService.ts
│   ├── storageService.ts
│   ├── transactionService.ts
│   ├── userService.ts
│   └── walletService.ts
└── types/
    ├── kyc.ts
    ├── transaction.ts
    ├── user.ts
    └── wallet.ts
```

---

## 🔒 Security Rules & Database Schema

The app enforces Attribute-Based Access Control (ABAC) in `firebase/firestore.rules` and `firebase/storage.rules`:
- Default deny all unauthenticated operations.
- `/users/{userId}`: Only document owner can read/write profile.
- `/userPrivate/{userId}`: PII (address) restricted strictly to owner.
- `/userIds/{publicUserId}`: Uniqueness lookup map for `PL18753`.
- `/kycRecords/{userId}` & `/wallets/{userId}`: Private to account owner.
- `/transactions/{transactionId}`: Accessible only if user is sender or recipient.

---

## 🚀 How to Upload and Deploy to GitHub

### Option A: Uploading via Terminal / Git CLI
1. Initialize git and add remote:
   ```bash
   git init
   git add .
   git commit -m "Initial phoneG commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/phoneG.git
   git push -u origin main
   ```

### Option B: Uploading via GitHub Website (Without Terminal)
1. Go to [GitHub.com](https://github.com) and create a new repository named `phoneG`.
2. On the empty repository page, click **"uploading an existing file"**.
3. Drag and drop all files and folders from your local project into the upload box.
4. Commit changes directly to `main`.

---

## ⚙️ Enabling GitHub Pages Deployment
1. Navigate to your GitHub repository **Settings** tab.
2. Click **Pages** in the left sidebar.
3. Under **Source**, select **GitHub Actions**.
4. The `.github/workflows/deploy.yml` workflow will trigger automatically and publish the app to `https://YOUR_USERNAME.github.io/phoneG`.
