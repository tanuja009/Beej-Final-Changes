# 🎯 NCD Registration Flow - Visual Diagram

**Version:** 2.0.0  
**Implementation:** Simple Clickable Wireframe (NO backend)

---

## Complete Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    LOGIN PAGE (Existing)                     │
│                                                              │
│   ┌────────────────────────────────────────────────────┐   │
│   │  🌾 Beej Sangh Procurement Portal                  │   │
│   │                                                     │   │
│   │  [Username: admin]                                 │   │
│   │  [Password: ••••••]                                │   │
│   │  [Captcha: ABCD]                                   │   │
│   │                                                     │   │
│   │  [Login to Portal]                                 │   │
│   │                                                     │   │
│   │  ─────────────────────────────────────────         │   │
│   │                                                     │   │
│   │  New Society? [New Society Registration] ◄─────────┼───┼── USER CLICKS HERE
│   └────────────────────────────────────────────────────┘   │
│                                                              │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     │ Navigate to 'ncd-entry'
                     ↓
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│               NCD CODE ENTRY PAGE (New Page 1)               │
│                                                              │
│   ┌────────────────────────────────────────────────────┐   │
│   │  🌾 New Society Registration                       │   │
│   │  Enter your NCD ID / Society Code to proceed      │   │
│   │                                                     │   │
│   │  NCD ID / Society Code *                           │   │
│   │  ┌──────────────────────────────────────────────┐ │   │
│   │  │ NCD001                                       │ │   │  ◄── USER TYPES ANY CODE
│   │  └──────────────────────────────────────────────┘ │   │      (NCD001, ABC123, TEST001, etc.)
│   │  💡 Enter any code - no validation required       │   │
│   │                                                     │   │
│   │  [Fetch Details] [Back to Login]                  │   │
│   │         ▲                                          │   │
│   │         └────────────────────────────────────────────────── USER CLICKS HERE
│   │                                                     │   │
│   │  📝 Demo Instructions:                             │   │
│   │  • Enter ANY code (no validation)                 │   │
│   │  • Click "Fetch Details"                          │   │
│   │  • All fields will be pre-filled                  │   │
│   └────────────────────────────────────────────────────┘   │
│                                                              │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     │ App.proceedToRegistrationForm()
                     │ Stores entered code
                     │ Navigate to 'ncd-registration-form'
                     ↓
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│          SOCIETY REGISTRATION FORM (New Page 2)              │
│                 ALL 21 FIELDS PRE-FILLED                     │
│                                                              │
│   ┌────────────────────────────────────────────────────┐   │
│   │ 🌾 Society Registration Form           [Back]     │   │
│   │ NCD Code: NCD001 | Pre-filled with demo data      │   │
│   ├────────────────────────────────────────────────────┤   │
│   │                                                     │   │
│   │ ▼ Basic Information (4 fields)                     │   │
│   │ ┌───────────┐ ┌───────────────────────────────┐   │   │
│   │ │ NCD001    │ │ Indore Cooperative Agri Soc  │   │   │  ◄── ENTERED CODE
│   │ └───────────┘ └───────────────────────────────┘   │   │      + DEMO DATA
│   │ ┌───────────┐ ┌───────────────────────────────┐   │   │
│   │ │ Indore    │ │ Madhya Pradesh               │   │   │
│   │ └───────────┘ └───────────────────────────────┘   │   │
│   │                                                     │   │
│   │ ▼ Geographic Details (4 fields)                    │   │
│   │ [Indore] [Indore] [Indore MC] [452001]            │   │
│   │                                                     │   │
│   │ ▼ Organization Details (4 fields)                  │   │
│   │ [Agriculture] [Agri & Seed Distribution]          │   │
│   │ [SOC/MP/2020/001] [15/06/2020]                    │   │
│   │                                                     │   │
│   │ ▼ Operational Status (3 fields)                    │   │
│   │ [Active] [125] [Approved]                         │   │
│   │                                                     │   │
│   │ ▼ Financial Information (4 fields)                 │   │
│   │ [Completed] [2025] [₹2,50,000] [₹0]              │   │
│   │                                                     │   │
│   │ ▼ Contact Information (2 fields - EDITABLE)        │   │
│   │ ┌────────────────┐ ┌─────────────────────────┐   │   │
│   │ │ 9876543210  ✎ │ │ indore.coop@example.com│   │   │  ◄── EDITABLE FIELDS
│   │ └────────────────┘ └─────────────────────────┘   │   │      (White background)
│   │                                                     │   │
│   │ ℹ️ Demo Prototype                                  │   │
│   │ • All 21 fields pre-filled with demo data          │   │
│   │ • Mobile & Email are editable                      │   │
│   │ • Click Submit Registration to complete            │   │
│   │                                                     │   │
│   │         [Back] [Submit Registration] ◄─────────────┼───┼── USER CLICKS HERE
│   └────────────────────────────────────────────────────┘   │
│                                                              │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     │ App.submitNCDRegistration()
                     ↓
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    SUCCESS ALERT POPUP                       │
│                                                              │
│   ┌────────────────────────────────────────────────────┐   │
│   │  ✅ Society Registration submitted successfully    │   │
│   │     for approval!                                  │   │
│   │                                                     │   │
│   │  Your registration has been received and will be   │   │
│   │  reviewed by the admin team.                       │   │
│   │                                                     │   │
│   │  You will be notified once the approval process    │   │
│   │  is complete.                                      │   │
│   │                                                     │   │
│   │                           [OK] ◄───────────────────┼───┼── USER CLICKS HERE
│   └────────────────────────────────────────────────────┘   │
│                                                              │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     │ Auto-navigate to 'login'
                     ↓
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              BACK TO LOGIN PAGE (Flow Complete)              │
│                                                              │
│   ┌────────────────────────────────────────────────────┐   │
│   │  🌾 Beej Sangh Procurement Portal                  │   │
│   │                                                     │   │
│   │  [Username: admin]                                 │   │
│   │  [Password: ••••••]                                │   │
│   │  [Captcha: ABCD]                                   │   │
│   │                                                     │   │
│   │  [Login to Portal]                                 │   │
│   │                                                     │   │
│   │  ─────────────────────────────────────────         │   │
│   │                                                     │   │
│   │  New Society? [New Society Registration]           │   │  ◄── CAN START AGAIN
│   └────────────────────────────────────────────────────┘   │
│                                                              │
│  ✅ Flow complete! User can register another society       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## User Journey Summary

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | Login Page | Clicks "New Society Registration" | Navigate to NCD Entry |
| 2 | NCD Entry | Types code (e.g., NCD001) | Code appears in input |
| 3 | NCD Entry | Clicks "Fetch Details" | Navigate to Form with pre-filled data |
| 4 | Registration Form | Reviews 21 pre-filled fields | All fields show demo data |
| 5 | Registration Form | (Optional) Edits Mobile/Email | Changes are typed in editable fields |
| 6 | Registration Form | Clicks "Submit Registration" | Success alert appears |
| 7 | Alert Popup | Clicks "OK" | Navigate back to Login Page |
| 8 | Login Page | Flow complete | Can start new registration |

---

## Data Flow

```
┌─────────────┐
│ User enters │
│   NCD001    │
└──────┬──────┘
       │
       │ Stored in App.state.ncdRegistration.enteredCode
       ↓
┌──────────────────────────┐
│ Registration Form Shows: │
│                          │
│ NCD ID = NCD001          │ ◄── From user input
│ Society Name = ...       │ ◄── Static demo data
│ Location = ...           │ ◄── Static demo data
│ ... (19 more fields)     │ ◄── Static demo data
└──────────────────────────┘
       │
       │ User clicks Submit
       ↓
┌──────────────────────────┐
│ Success Alert            │
│ State Reset              │
│ Navigate to Login        │
└──────────────────────────┘
```

---

## Key Technical Details

### Routes:
- `login` → Login Page (existing)
- `ncd-entry` → NCD Code Entry Page (**NEW**)
- `ncd-registration-form` → 21-Field Form Page (**NEW**)

### Functions:
- `App.renderNCDEntry()` → Renders NCD Entry Page
- `App.proceedToRegistrationForm()` → Captures code & navigates
- `App.renderNCDRegistrationForm()` → Renders 21-field form
- `App.submitNCDRegistration()` → Shows alert & returns to login

### State:
```javascript
App.state.ncdRegistration = {
  enteredCode: 'NCD001',  // User's entered code
  formSubmitted: false     // Tracking flag
}
```

---

## 21 Fields Breakdown

| Section | Fields | Status |
|---------|--------|--------|
| **Basic Information** | NCD ID, Society Name, Location, State/UT | Pre-filled (read-only) |
| **Geographic Details** | District, Block, Urban Local Body, Pincode | Pre-filled (read-only) |
| **Organization Details** | Sector Type, Primary Activity, Reg Number, Reg Date | Pre-filled (read-only) |
| **Operational Status** | Functional Status, Members, Approval Status | Pre-filled (read-only) |
| **Financial Info** | Financial Audit, Audit Year, Annual Profit, Annual Loss | Pre-filled (read-only) |
| **Contact Info** | Mobile, Email | Pre-filled (**EDITABLE**) |

**Total:** 21 fields  
**Pre-filled:** All 21 fields  
**Editable:** 2 fields (Mobile & Email)  
**Read-only:** 19 fields (gray background)

---

## Success Criteria Checklist

### Page Navigation
- [ ] Login → NCD Entry (click button)
- [ ] NCD Entry → Registration Form (enter code + click Fetch)
- [ ] Registration Form → Login (submit + alert OK)

### Data Handling
- [ ] Any code accepted (no validation)
- [ ] Entered code appears in NCD ID field
- [ ] All 21 fields contain demo data
- [ ] Mobile & Email can be edited

### User Experience
- [ ] Buttons are clickable (not disabled)
- [ ] Success alert shows clear message
- [ ] Auto-returns to login after submit
- [ ] Flow can be repeated immediately

---

## Testing Scenarios

### Scenario 1: Standard Flow
```
Login → Click Button → Type NCD001 → Fetch → Review Form → Submit → OK → Back to Login
Expected: ✅ All steps work, returns to login
```

### Scenario 2: Custom Code
```
Login → Click Button → Type ABC123 → Fetch → Form shows ABC123 in NCD ID → Submit → OK → Back to Login
Expected: ✅ Works with any code
```

### Scenario 3: Edit Contact
```
... → Registration Form → Change Mobile to 9999999999 → Change Email → Submit → OK → Back to Login
Expected: ✅ Edits are accepted (not validated, just for demo)
```

### Scenario 4: Back Navigation
```
... → NCD Entry → Click Back → Returns to Login ✅
... → Registration Form → Click Back → Returns to NCD Entry ✅
```

---

## Browser Compatibility

Tested on:
- ✅ Chrome 120+
- ✅ Edge 120+
- ✅ Firefox 120+
- ✅ Safari 17+ (Mac)

**Note:** Clear cache before first test (Ctrl+Shift+R)

---

**Visual Flow Complete!** 🎉

This diagram shows the exact user journey from Login to successful registration submission.

---

_Beej Sangh Portal - NCD Registration Flow v2.0.0_
