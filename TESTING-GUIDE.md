# 🧪 Society Registration Workflow - Testing Guide

## Quick Test Scenarios

### 🎯 Scenario 1: Happy Path (Complete Approval)

**Time**: 5 minutes

**Steps:**
```
1. Login as Society User
2. Navigate: Sidebar → "My Application"
3. Click: "New Registration"
4. Fill form (all * fields are required):
   - Society Name: "Test Society 2024"
   - Society Type: "Farmers Cooperative"
   - Registration Number: "REG-TEST-2024"
   - Registration Date: Today's date
   - Fill all location, contact, and bank details
5. Click: "Submit Application"
6. ✅ Alert: "Application submitted successfully! Application Number: APP-2024-XXX"
7. ✅ See application in list with status "Pending"

8. Logout → Login as Admin
9. Navigate: Sidebar → "Registration List"
10. ✅ See your application in the list
11. Navigate: Sidebar → "Pending Approvals"
12. ✅ See your application with "Waiting Days" badge
13. Click: "Review" button
14. ✅ See complete application details
15. Click: "Approve Application"
16. ✅ See popup with auto-generated Society Code (e.g., SOC-005)
17. Click: "Approve"
18. ✅ Alert: "Application approved successfully! Society Code: SOC-005"
19. ✅ Redirected to Registration List
20. ✅ Application status now "Approved"

21. Logout → Login as Society User
22. Navigate: "My Application"
23. ✅ See status "Approved" with Society Code
24. Click: "View"
25. ✅ See green success alert: "Application Approved!"
26. ✅ See audit history with all actions
```

**Expected Result**: ✅ Complete approval workflow works end-to-end

---

### 🎯 Scenario 2: Rejection Path

**Time**: 3 minutes

**Steps:**
```
1. Login as Admin
2. Navigate: "Pending Approvals"
3. Click: "Review" on any pending application
4. Click: "Reject Application"
5. ✅ Popup opens requiring rejection reason
6. Enter: "Bank account details not verified"
7. Click: "Reject Application"
8. ✅ Alert: "Application rejected successfully!"
9. ✅ Application status → "Rejected"

10. Logout → Login as Society User
11. Navigate: "My Application"
12. ✅ See status "Rejected" (red badge)
13. Click: "View"
14. ✅ See red alert with rejection reason
15. ✅ Edit button NOT available (rejected apps cannot be edited)
```

**Expected Result**: ✅ Rejection workflow works correctly

---

### 🎯 Scenario 3: Resubmission Path (Most Complex)

**Time**: 7 minutes

**Steps:**
```
1. Login as Admin
2. Navigate: "Pending Approvals"
3. Click: "Review" on any pending application
4. Click: "Return for Resubmission"
5. ✅ Popup opens requiring correction remarks
6. Enter: "Please upload PAN card and correct the IFSC code"
7. Click: "Return for Resubmission"
8. ✅ Alert: "Application returned for resubmission!"
9. ✅ Application status → "Resubmission Required"

10. Logout → Login as Society User
11. Navigate: "My Application"
12. ✅ See status "Resubmission Required" (blue badge)
13. ✅ See info alert: "Action Required! Your application has been returned..."
14. Click: "View"
15. ✅ See yellow warning alert with admin remarks
16. ✅ "Edit & Resubmit" button available
17. Click: "Edit & Resubmit"
18. ✅ Form opens pre-filled with existing data
19. ✅ Admin remarks shown at top in warning box
20. Make corrections (change IFSC code)
21. Click: "Resubmit Application"
22. ✅ Alert: "Application resubmitted successfully!"
23. ✅ Status changed back to "Pending"
24. ✅ Resubmission remarks cleared

25. Logout → Login as Admin
26. Navigate: "Pending Approvals"
27. ✅ See resubmitted application back in list
28. Click: "Review"
29. ✅ See audit history showing full journey:
    - Created → Submitted → Returned for Resubmission → Resubmitted
30. Click: "Approve Application"
31. ✅ Application approved with Society Code assigned
32. ✅ Complete audit trail visible
```

**Expected Result**: ✅ Complete resubmission cycle works perfectly

---

### 🎯 Scenario 4: Draft Functionality

**Time**: 3 minutes

**Steps:**
```
1. Login as Society User
2. Navigate: "My Application" → "New Registration"
3. Fill only some fields (e.g., Society Name, Type, Address)
4. Click: "Save as Draft"
5. ✅ Alert: "Draft saved successfully!"
6. ✅ Redirected to "My Application"
7. ✅ Application appears with status "Draft" (gray badge)
8. Click: "Edit" button (pencil icon)
9. ✅ Form opens with previously saved data
10. Complete remaining fields
11. Click: "Submit Application"
12. ✅ Status changed to "Pending"
13. ✅ Application Number generated
```

**Expected Result**: ✅ Draft save and continue works

---

### 🎯 Scenario 5: Filters & Search

**Time**: 3 minutes

**Steps:**
```
1. Login as Admin
2. Navigate: "Registration List"
3. ✅ See all applications (3 sample + any new ones)
4. Filter by Status: "Pending"
5. ✅ Only pending applications shown
6. Click: "Reset" button
7. ✅ All applications shown again
8. Filter by District: Select any district
9. ✅ Only applications from that district shown
10. Filter by Date Range: From date + To date
11. ✅ Only applications in range shown
12. Enter Application Number in search
13. ✅ Only matching application shown
14. Enter Society Name in search
15. ✅ Only matching applications shown
```

**Expected Result**: ✅ All filters work correctly

---

### 🎯 Scenario 6: Audit Trail Verification

**Time**: 2 minutes

**Steps:**
```
1. Login as Society User
2. Navigate: "My Application"
3. Click: "View" on any application (Approved or Resubmission)
4. Scroll to "Application History" section
5. ✅ See timeline with colored icons:
   - Blue circle: Created, Submitted, Resubmitted
   - Green circle: Approved
   - Red circle: Rejected
6. ✅ Each entry shows:
   - Action name
   - Who performed it (name + role)
   - Date & time
   - Previous status → New status
   - Remarks (if any)
7. ✅ Timeline is in reverse chronological order (newest first)
8. ✅ Connecting lines between events
```

**Expected Result**: ✅ Complete audit trail visible

---

## 🔍 What to Look For During Testing

### ✅ **Visual Elements:**
- [ ] Status badges are color-coded:
  - Gray: Draft
  - Yellow/Warning: Pending
  - Green: Approved
  - Red: Rejected
  - Blue/Info: Resubmission Required
- [ ] Material icons display correctly
- [ ] Forms are well-organized in sections
- [ ] Tables are readable with proper spacing
- [ ] Modals open centered with proper styling
- [ ] Buttons have hover effects

### ✅ **Functionality:**
- [ ] Form validation prevents submission with missing required fields
- [ ] Application Number format: APP-YYYY-XXX
- [ ] Society Code format: SOC-XXX
- [ ] Society Code only assigned after approval
- [ ] Society users can't see other societies' applications
- [ ] Society users can't edit Pending/Approved/Rejected applications
- [ ] Admin users see all applications
- [ ] Filters work in combination
- [ ] Navigation works smoothly between pages
- [ ] Back buttons return to correct page

### ✅ **Data Integrity:**
- [ ] Application data persists after navigation
- [ ] Status changes are reflected immediately
- [ ] Audit entries are created for every action
- [ ] Remarks are saved and displayed correctly
- [ ] Dates are formatted consistently
- [ ] No duplicate application numbers

---

## 🐛 Common Issues & Solutions

### Issue 1: "My Application" menu not showing
**Solution**: Make sure you're logged in as Society user, not Admin

### Issue 2: Can't edit application
**Solution**: Applications can only be edited if status is "Draft" or "Resubmission Required"

### Issue 3: Approval popup not showing
**Solution**: Clear browser cache and reload (Ctrl+F5)

### Issue 4: Society Code not showing
**Solution**: Society Code is only assigned AFTER admin approval

### Issue 5: Filters not working
**Solution**: Click "Reset" button first, then try one filter at a time

---

## 📊 Sample Data Pre-loaded

### Application 1: Rampur Krishi Samiti
- **Application Number**: APP-2024-001
- **Status**: ✅ Approved
- **Society Code**: SOC-001
- **District**: Chhindwara

### Application 2: Sehora Kisan Sabha
- **Application Number**: APP-2024-002
- **Status**: ⏳ Pending for Beej Sangh Approval
- **Society Code**: (Not assigned yet)
- **District**: Seoni

### Application 3: Bargaon Beej Samiti
- **Application Number**: APP-2024-003
- **Status**: 📝 Resubmission Required
- **Society Code**: (Not assigned yet)
- **District**: Narsinghpur
- **Admin Remarks**: "Please upload PAN card document and GST certificate. Bank account details need verification."

---

## ⏱️ Full Test Suite

**Total Time**: ~25 minutes

**Order:**
1. ✅ Scenario 4: Draft Functionality (3 min)
2. ✅ Scenario 1: Happy Path (5 min)
3. ✅ Scenario 3: Resubmission Path (7 min)
4. ✅ Scenario 2: Rejection Path (3 min)
5. ✅ Scenario 5: Filters & Search (3 min)
6. ✅ Scenario 6: Audit Trail (2 min)
7. ✅ Visual Check (2 min)

---

## 🎯 Success Criteria

### Application is ready for production if:
- ✅ All 6 test scenarios pass
- ✅ All visual elements display correctly
- ✅ All functionality works as expected
- ✅ Data integrity is maintained
- ✅ Role-based access control works
- ✅ No JavaScript errors in browser console
- ✅ Audit trail is complete and accurate

---

## 📝 Test Results Template

Use this to document your testing:

```
Date: _______________
Tester: _______________

Scenario 1 (Happy Path):        [ ] Pass  [ ] Fail
Scenario 2 (Rejection):         [ ] Pass  [ ] Fail
Scenario 3 (Resubmission):      [ ] Pass  [ ] Fail
Scenario 4 (Draft):             [ ] Pass  [ ] Fail
Scenario 5 (Filters):           [ ] Pass  [ ] Fail
Scenario 6 (Audit Trail):       [ ] Pass  [ ] Fail

Visual Elements:                [ ] Pass  [ ] Fail
Data Integrity:                 [ ] Pass  [ ] Fail
Role-Based Access:              [ ] Pass  [ ] Fail

Issues Found:
1. ___________________________________
2. ___________________________________
3. ___________________________________

Overall Result:                 [ ] Ready  [ ] Needs Work
```

---

## 🚀 Ready to Test!

Open `index.html` in your browser and start with **Scenario 1: Happy Path**

**Happy Testing! 🎉**

---

*Testing Guide - Society Registration Workflow v1.0.0*
*Last Updated: 2026-08-24*
