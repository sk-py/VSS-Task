# Basic Email Client App

## 📌 Objective
Develop a basic email client that allows users to:
- View a list of email drafts.
- Edit or create a new draft email.
- Send emails using a third-party email API (e.g., SendGrid or a mock backend).

---

## 🚀 Implemented Features
- **Home Screen:**
  - Displays a list of saved draft emails.
  - Shows email subject, recipient(s), and status (Draft/Sent).
  - Dropdown to filter emails by type (Sent/Draft).
  - Logout option in the dropdown.
  - Button to create a new draft.
  - **Search bar** to quickly find emails (Bonus feature).
- **Email Editor Screen:**
  - Single screen dynamically handles:
    - Creating a new draft.
    - Editing an existing draft.
    - Viewing sent emails (non-editable mode).
  - Fields: Recipient email(s), Subject, Body.
  - Save draft locally.
  - Send email via SendGrid API.
- **Email Sending:**
  - Integrated with a Node.js backend using SendGrid.
  - Updates the draft status upon successful sending.
  - Displays confirmation messages.
- **Error Handling:**
  - Gracefully handles API errors.
- **Logout Feature:**
  - Clears user data (simulated authentication).

### 🎯 Bonus Features
- **Dropdown Filter for Emails:** Added a dropdown in the header to filter emails (Sent/Draft).
- **Single Dynamic Screen for Create/Edit/View:** The Email Editor screen adapts based on use case.
- **Search Bar:** Implemented a search bar for filtering emails by subject or recipient.

---

## 🛠️ Tech Stack
- **Framework:** React Native (Latest Version)
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Navigation:** React Navigation
- **Storage:** AsyncStorage
- **Form Handling:** React Hook Form
- **API:** SendGrid (integrated with Node.js backend)

---

## 🔧 Setup & Installation

### 1️⃣ Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- Yarn or npm
- Android Emulator or a Physical Device

### 2️⃣ Clone the Repository
```sh
 git clone https://github.com/sk-py/VSS-Task.git
 cd email-client
```

### 3️⃣ Install Dependencies
```sh
npm install
# or
yarn install
```

### 4️⃣ Start the Application
```sh
# Start Metro Bundler
npm start  # or yarn start

# Run on Android
yarn android  # or npm run android

# Run on iOS (Mac required)
bundle install  # First-time only
bundle exec pod install  # After updating native deps
yarn ios  # or npm run ios
```

---

## ⚙️ Assumptions & Challenges
### ✅ Assumptions
- Added a dropdown for filtering emails (Sent/Draft).
- Used a single screen to handle Create, Edit, and View functionalities dynamically.
- Redux state and AsyncStorage are used for syncing UI and storage.

### ❌ Challenges Faced
- **Managing a single screen for Create, Edit, and View:** Had to dynamically adjust UI and functionality.
- **Syncing Redux with AsyncStorage:** Ensured state updates reflect correctly in local storage.
- **SendGrid Integration:** Configuring email sending with an existing Node.js backend.

---

## 📽️ Demo Video
[Watch Demo](https://drive.google.com/file/d/1nUjNscb0FUei1ofPetGli6iMIai-2f0-/view?usp=drivesdk)

---

## 📥 Download APK
You can download and install the app using the following link:
[Download APK](sandbox:/mnt/data/app-release.apk)

---

## 📢 Feedback
Your feedback is valuable! If you have any suggestions, improvements, or issues, feel free to reach out.

📩 Contact us at: [shaikh56742@gmail.com](mailto:shaikh56742@gmail.com)

I appreciate your time in testing and reviewing is app. Let me know what you think!

