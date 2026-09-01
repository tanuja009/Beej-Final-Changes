# NCD Registration - Quick Test Guide

## 🧪 Quick Testing Steps

### **Step 1: Access Login Page**
1. Open the application: `index.html` or `http://localhost:8000`
2. You should see the login page

### **Step 2: Verify Login Page Updates**
✅ Check for **"Forgot Password | Login with Mobile"** links
✅ Check for green **"New Society Registration"** button at bottom

### **Step 3: Open Registration Page**
1. Click **"New Society Registration"** button
2. Should navigate to NCD Registration page
3. ✅ Verify header shows "New Society Registration — NCD ID Based"
4. ✅ Verify "Back to Login" button in top-right

### **Step 4: Test Valid NCD ID (NCD001)**
1. Enter: **NCD001** in the NCD ID field
2. Click **"Fetch Society Details"** button
3. ✅ Verify: Success message appears (green)
4. ✅ Verify: Registration form displays below
5. ✅ Verify: All fields are populated with data
6. ✅ Verify: Read-only fields have grey background
7. ✅ Verify: Mobile and Email fields are editable (white background)

**Expected Form Data:**
- **Society Name:** Rampur Farmers Cooperative Society
- **District:** Chhindwara
- **State/UT:** Madhya Pradesh
- **Registration Number:** REG-MP-2020-001
- **Members:** 65
- **Mobile:** 9876543210
- **Email:** rampur.coop@gmail.com

### **Step 5: Test Form Sections**
✅ **Section 1:** Society Identification (5 fields)
✅ **Section 2:** Location Details (6 fields)
✅ **Section 3:** Society Information (4 fields)
✅ **Section 4:** Financial & Audit Information (4 fields)
✅ **Section 5:** Contact Information (2 fields)

**Total:** 21 fields displayed

### **Step 6: Test Form Submission**
1. Update mobile number if desired (e.g., 9999999999)
2. Update email if desired (e.g., test@example.com)
3. Click **"Submit Registration"** button
4. ✅ Verify: Success popup appears with:
   - Society name
   - NCD ID
   - Approval wait message
5. Click OK on popup
6. ✅ Verify: Redirected to Login Page

### **Step 7: Test Invalid NCD ID**
1. Go back to Registration page
2. Enter: **NCD999** (non-existent)
3. Click "Fetch Society Details"
4. ✅ Verify: Red error message appears
5. ✅ Verify: No form is displayed
6. ✅ Verify: Message says "Invalid NCD ID"

### **Step 8: Test Already Registered (NCD003)**
1. Clear NCD ID field
2. Enter: **NCD003**
3. Click "Fetch Society Details"
4. ✅ Verify: Orange warning panel appears
5. ✅ Verify: Shows "already registered" message
6. ✅ Verify: "Go to Login" button appears
7. Click "Go to Login"
8. ✅ Verify: Redirects to login page

### **Step 9: Test Empty NCD ID**
1. Go back to Registration page
2. Leave NCD ID field empty
3. Click "Fetch Society Details"
4. ✅ Verify: Warning message appears
5. ✅ Verify: Message says "Please enter an NCD ID"

### **Step 10: Test Navigation**
1. Enter valid NCD ID (NCD002)
2. Click "Fetch Society Details"
3. Form appears
4. Click "Cancel" button at bottom
5. ✅ Verify: Returns to login page
6. Go to Registration page again
7. Enter NCD ID and fetch
8. Click "← Back to Login" (top right)
9. ✅ Verify: Returns to login page

---

## 📋 Additional Test NCDs

### **NCD002 - Sehora Kisan Sabha**
- District: Seoni
- Members: 72
- Can register: ✅ Yes

### **NCD004 - Patan Krishi Vikas Samiti**
- District: Chhindwara
- Members: 91
- Can register: ✅ Yes

### **NCD005 - Betul Farmers Welfare Society**
- District: Betul
- Members: 55
- Approval Status: Pending
- Can register: ✅ Yes

---

## ✅ All Tests Passed?

If all verifications above show ✅, the implementation is complete and working correctly!

---

## 🔧 Troubleshooting

**Form not appearing after fetch?**
- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R)
- Clear browser cache completely

**Data not populating?**
- Verify NCD ID is uppercase (auto-converts)
- Check ncd-registration.js is loaded
- Check browser console

**Redirect not working?**
- Ensure App.navigate() function works
- Test from login page first
- Check for JavaScript errors

---

**Version:** 1.5.0
**Status:** Ready for Testing ✅
