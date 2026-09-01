# 📍 Code Location Guide - Profile & Forgot Password Features

## Where to Find Everything

All profile update and forgot password code is in **`app.js`**

---

## 🗂️ File Structure

```
📁 Beej Sangh Portal
├── 📄 app.js                    ← ALL CODE IS HERE
├── 📄 styles.css                ← Styling for new features
├── 📄 index.html                ← Main HTML (no changes needed)
└── 📄 PROFILE-AND-PASSWORD-FEATURES.md  ← Documentation
```

---

## 📍 Exact Locations in `app.js`

### **1. State Variables (Lines 88-96)**

**Location:** Near the top of the file, inside `state: { ... }`

```javascript
// Line 88-96 in app.js
state: {
  // ... existing state ...
  
  // ── Forgot Password & Profile Update OTP State ──
  forgotPwdStep: 1,
  forgotPwdMobile: '',
  forgotPwdOTP: '',
  forgotPwdGeneratedOTP: '',
  profileUpdateMode: false,
  profileOTPSent: false,
  profileGeneratedOTP: '',
  changePasswordModal: false,
}
```

---

### **2. Router Update (Lines 110-120)**

**Location:** In the `render()` function

```javascript
// Line 110-120 in app.js
render() {
  const app = document.getElementById('app');
  if (this.state.currentPage === 'login') {
    app.innerHTML = this.renderLogin();
  } else if (this.state.currentPage === 'soc-register') {
    app.innerHTML = this.renderPublicSocRegForm();
  } else if (this.state.currentPage === 'forgot-password') {  // ← NEW
    app.innerHTML = this.renderForgotPassword();              // ← NEW
  } else {
    app.innerHTML = this.renderAppLayout();
  }
  this.bindEvents();
}
```

---

### **3. Login Page Update (Lines 155-156)**

**Location:** In `renderLogin()` function

```javascript
// Line 155-156 in app.js
<div class="forgot-link">
  <a href="#" onclick="App.navigate('forgot-password');return false" style="color:#2E7D32;font-weight:500;">
    Forgot Password?                                     // ← NOW FUNCTIONAL
  </a> &nbsp;|&nbsp;
  <a href="#" onclick="return false">Help & Support</a>
</div>
```

---

### **4. Forgot Password Page (Lines 208-303)**

**Location:** Right after the `login()` function

```javascript
// Lines 208-303 in app.js

// ---- FORGOT PASSWORD PAGE ----
renderForgotPassword() {
  // Complete 3-step forgot password page
  // Step 1: Enter Mobile
  // Step 2: Verify OTP
  // Step 3: Reset Password
}

sendForgotPasswordOTP() {
  // Generate and send OTP
  // Validates mobile number
  // Shows OTP in alert (demo mode)
}

verifyForgotPasswordOTP() {
  // Verify OTP entered by user
  // Moves to step 3 if valid
}

resetPassword() {
  // Reset password after OTP verification
  // Validates password match
  // Redirects to login
}
```

**Detailed Line Numbers:**
- `renderForgotPassword()`: **Lines 208-303**
- `sendForgotPasswordOTP()`: **Lines 304-325**
- `verifyForgotPasswordOTP()`: **Lines 326-341**
- `resetPassword()`: **Lines 342-364**

---

### **5. Enhanced Profile Page (Lines 2408-2541)**

**Location:** In the middle of the file (search for "PROFILE PAGE")

```javascript
// Lines 2408-2541 in app.js

// ============================
// PROFILE PAGE
// ============================
renderProfile() {
  // Enhanced profile page with:
  // - View mode (default)
  // - Edit mode (with OTP)
  // - Change password modal
}
```

**Key Features in renderProfile():**
- Profile card with avatar
- Editable form fields
- OTP verification section (conditional)
- Update/Cancel buttons
- Change password button
- Modal rendering

---

### **6. Profile Update Functions (Lines 2542-2605)**

**Location:** Right after `renderProfile()`

```javascript
// Lines 2542-2605 in app.js

enableProfileUpdate() {
  // Enables edit mode
  // Line 2542-2548
}

cancelProfileUpdate() {
  // Cancels edit and returns to view mode
  // Line 2549-2554
}

sendProfileOTP() {
  // Sends OTP for profile update
  // Validates mobile number
  // Line 2555-2573
}

verifyAndUpdateProfile() {
  // Verifies OTP
  // Updates profile
  // Returns to view mode
  // Line 2574-2605
}
```

**Detailed Line Numbers:**
- `enableProfileUpdate()`: **Lines 2542-2548**
- `cancelProfileUpdate()`: **Lines 2549-2554**
- `sendProfileOTP()`: **Lines 2555-2573**
- `verifyAndUpdateProfile()`: **Lines 2574-2605**

---

### **7. Change Password Modal (Lines 2606-2673)**

**Location:** After profile update functions

```javascript
// Lines 2606-2673 in app.js

openChangePasswordModal() {
  // Opens the modal
  // Line 2606-2610
}

closeChangePasswordModal() {
  // Closes the modal
  // Line 2611-2615
}

renderChangePasswordModal() {
  // Renders the modal HTML
  // Line 2616-2648
}

changePassword() {
  // Changes password
  // Validates current and new passwords
  // Line 2649-2673
}
```

**Detailed Line Numbers:**
- `openChangePasswordModal()`: **Lines 2606-2610**
- `closeChangePasswordModal()`: **Lines 2611-2615**
- `renderChangePasswordModal()`: **Lines 2616-2648**
- `changePassword()`: **Lines 2649-2673**

---

### **8. Router Case for Profile (Line 3342)**

**Location:** In `renderPage()` function switch statement

```javascript
// Line 3342 in app.js
case 'profile': return this.renderProfile();
```

---

## 🎨 Styles Location in `styles.css`

### **New Styles Added (End of File)**

**Location:** Appended at the end of `styles.css`

```css
/* ===== FORGOT PASSWORD & PROFILE OTP STYLES ===== */

/* Step Indicators */
.step-indicator { /* ... */ }
.step-indicator.active { /* ... */ }
.step-line { /* ... */ }
.step-line.active { /* ... */ }

/* Enhanced Input for OTP */
input[type="text"][id*="otp"] { /* ... */ }

/* Animations */
@keyframes slideDown { /* ... */ }
@keyframes fadeIn { /* ... */ }
@keyframes slideUp { /* ... */ }
@keyframes pulse { /* ... */ }

/* Responsive */
@media (max-width: 768px) { /* ... */ }
```

**Approximate Line Range:** Last 100 lines of `styles.css`

---

## 🔍 How to Navigate to Code

### **Method 1: Search by Function Name**

Press `Ctrl+F` (or `Cmd+F` on Mac) in your editor and search for:

**For Forgot Password:**
- `renderForgotPassword`
- `sendForgotPasswordOTP`
- `verifyForgotPasswordOTP`
- `resetPassword`

**For Profile Update:**
- `renderProfile`
- `enableProfileUpdate`
- `sendProfileOTP`
- `verifyAndUpdateProfile`
- `changePassword`

---

### **Method 2: Go to Line Number**

In most editors:
- Press `Ctrl+G` (or `Cmd+G` on Mac)
- Enter line number
- Press Enter

**Quick Access Line Numbers:**
- Forgot Password Page: **Line 208**
- Profile Page: **Line 2408**
- Profile Update Functions: **Line 2542**
- Change Password: **Line 2606**

---

### **Method 3: Search by Comment**

Search for these comments:

```javascript
// ---- FORGOT PASSWORD PAGE ----        (Line 208)
// ============================
// PROFILE PAGE                           (Line 2407)
// ============================
```

---

## 📋 Quick Reference Table

| Feature | Function Name | Start Line | End Line | File |
|---------|--------------|------------|----------|------|
| **Forgot Password Page** | `renderForgotPassword()` | 208 | 303 | app.js |
| Send OTP (Forgot) | `sendForgotPasswordOTP()` | 304 | 325 | app.js |
| Verify OTP (Forgot) | `verifyForgotPasswordOTP()` | 326 | 341 | app.js |
| Reset Password | `resetPassword()` | 342 | 364 | app.js |
| **Enhanced Profile Page** | `renderProfile()` | 2408 | 2541 | app.js |
| Enable Profile Edit | `enableProfileUpdate()` | 2542 | 2548 | app.js |
| Cancel Profile Edit | `cancelProfileUpdate()` | 2549 | 2554 | app.js |
| Send OTP (Profile) | `sendProfileOTP()` | 2555 | 2573 | app.js |
| Verify & Update | `verifyAndUpdateProfile()` | 2574 | 2605 | app.js |
| **Change Password Modal** | `renderChangePasswordModal()` | 2616 | 2648 | app.js |
| Open Modal | `openChangePasswordModal()` | 2606 | 2610 | app.js |
| Close Modal | `closeChangePasswordModal()` | 2611 | 2615 | app.js |
| Change Password | `changePassword()` | 2649 | 2673 | app.js |
| **State Variables** | N/A | 88 | 96 | app.js |
| **Router Update** | `render()` | 110 | 120 | app.js |
| **Profile Route** | `renderPage()` | 3342 | 3342 | app.js |
| **Login Link Update** | `renderLogin()` | 155 | 156 | app.js |
| **CSS Styles** | N/A | ~End | ~End | styles.css |

---

## 🎯 What Each Section Does

### **Forgot Password Flow:**

```
Line 208-303: renderForgotPassword()
├── Renders 3-step UI
├── Step 1: Mobile input
├── Step 2: OTP input
└── Step 3: Password reset

Line 304-325: sendForgotPasswordOTP()
├── Validates mobile number
├── Generates 6-digit OTP
├── Stores OTP in state
└── Shows alert (demo)

Line 326-341: verifyForgotPasswordOTP()
├── Reads OTP input
├── Compares with stored OTP
└── Moves to step 3 if valid

Line 342-364: resetPassword()
├── Validates new password
├── Confirms password match
├── Resets state
└── Redirects to login
```

---

### **Profile Update Flow:**

```
Line 2408-2541: renderProfile()
├── Shows profile card
├── Displays form fields
├── Conditional OTP section
└── Renders modal if open

Line 2542-2548: enableProfileUpdate()
└── Sets edit mode flag

Line 2555-2573: sendProfileOTP()
├── Validates mobile
├── Generates OTP
└── Shows alert

Line 2574-2605: verifyAndUpdateProfile()
├── Verifies OTP
├── Updates profile
└── Resets mode
```

---

### **Change Password Flow:**

```
Line 2606-2610: openChangePasswordModal()
└── Opens modal

Line 2616-2648: renderChangePasswordModal()
├── Renders modal HTML
├── Current password field
├── New password field
└── Confirm password field

Line 2649-2673: changePassword()
├── Validates all fields
├── Checks password length
├── Confirms match
└── Closes modal
```

---

## 🛠️ How to Modify

### **To Change OTP Length:**

**Location:** Search for `100000` in app.js

```javascript
// Line 316 & Line 2564
const otp = Math.floor(100000 + Math.random() * 900000).toString();
// Change to 1000 for 4-digit, or 10000 for 5-digit
```

---

### **To Change Password Minimum Length:**

**Location:** Search for `length < 8` in app.js

```javascript
// Line 348, Line 2655
if (newPwd.length < 8) {
  // Change 8 to desired minimum
}
```

---

### **To Change Step Indicator Colors:**

**Location:** End of `styles.css`

```css
.step-indicator.active {
  background: #4CAF50;  /* Change this color */
  color: #fff;
}
```

---

### **To Add SMS Integration:**

**Location:** Lines 316 & 2564 in app.js

Replace this:
```javascript
alert(`OTP sent to +91 ${mobile}\n\n[Demo Mode] Your OTP is: ${otp}`);
```

With this:
```javascript
// Send SMS via API
fetch('/api/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mobile: mobile, otp: otp })
});
```

---

## 📱 How to Test

### **Test Forgot Password:**
1. Open browser → `index.html`
2. Click "Forgot Password?" (Line 155-156 makes this work)
3. Function `renderForgotPassword()` (Line 208) renders the page
4. Enter mobile → Click "Send OTP" → Calls `sendForgotPasswordOTP()` (Line 304)
5. Enter OTP → Click "Verify" → Calls `verifyForgotPasswordOTP()` (Line 326)
6. Set password → Click "Reset" → Calls `resetPassword()` (Line 342)

### **Test Profile Update:**
1. Login → Navigate to "My Profile"
2. Function `renderProfile()` (Line 2408) renders the page
3. Click "Update Profile" → Calls `enableProfileUpdate()` (Line 2542)
4. Click "Send OTP" → Calls `sendProfileOTP()` (Line 2555)
5. Enter OTP → Click "Verify & Save" → Calls `verifyAndUpdateProfile()` (Line 2574)

### **Test Change Password:**
1. Profile → Click "Change Password" → Calls `openChangePasswordModal()` (Line 2606)
2. Modal rendered by `renderChangePasswordModal()` (Line 2616)
3. Fill fields → Click "Change Password" → Calls `changePassword()` (Line 2649)

---

## 📝 Notes

### **No Separate Files Needed:**
- ❌ No separate `.html` files for forgot password or profile
- ❌ No separate `.js` files
- ✅ Everything is in `app.js` using dynamic rendering

### **Why Single File?**
- Matches existing app architecture
- All pages render dynamically via `render()` function
- Consistent with other pages (login, dashboard, etc.)

### **If You Want Separate Files:**
You can extract functions to separate files like this:

```javascript
// Create: forgot-password.js
App.renderForgotPassword = function() { /* ... */ };
App.sendForgotPasswordOTP = function() { /* ... */ };
// ... etc

// Then in index.html add:
<script src="forgot-password.js"></script>
```

But current approach keeps everything organized in one place!

---

## ✅ Summary

**Everything is in `app.js`:**

| What | Where | Lines |
|------|-------|-------|
| State Variables | Top of file | 88-96 |
| Router | `render()` function | 110-120 |
| Forgot Password | After login | 208-364 |
| Profile Page | Middle of file | 2408-2541 |
| Profile Functions | After profile | 2542-2605 |
| Change Password | After profile functions | 2606-2673 |
| Profile Route | `renderPage()` switch | 3342 |

**Styles in `styles.css`:**
- Step indicators, animations - End of file

---

## 🚀 Quick Access Commands

### **In VS Code:**

```bash
# Open app.js at forgot password
Ctrl+G → Type 208 → Enter

# Open app.js at profile page
Ctrl+G → Type 2408 → Enter

# Search for function
Ctrl+F → Type "renderForgotPassword"
```

### **In Notepad++:**

```bash
# Go to line
Ctrl+G → Enter line number

# Search
Ctrl+F → Enter function name
```

---

**🎯 Now you know exactly where everything is! Happy coding! 🎯**

---

*Last Updated: 2026-08-24*
*All code in: `app.js` and `styles.css`*
