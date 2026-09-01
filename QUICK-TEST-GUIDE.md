# 🚀 Quick Test Guide - Society Code Auto-Fetch

**Version:** 1.7.0 | **Date:** Aug 25, 2026

---

## ⚡ Quick Start (3 Steps)

### 1️⃣ Clear Cache
Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### 2️⃣ Open Application
Open `index.html` → Click **"Register Here"** button

### 3️⃣ Test Auto-Fetch
In **Society Code** field, type: `SOC-003` → Press **Tab**

**Expected:** ✅ All fields auto-fill + success alert + green highlight

---

## 🎯 Quick Test Codes

| Type This | Get This | Status |
|-----------|----------|--------|
| `SOC-003` | **16 fields filled** ✅ | **RECOMMENDED TEST** |
| `SOC-001` | **Warning (duplicate)** ⚠️ | Blocked (Active) |
| `SOC-004` | **2 fields filled** ℹ️ | Basic auto-fill |
| `SOC-999` | **No action** 🔍 | New society (manual entry) |

---

## ✅ Success Checklist

After entering `SOC-003` and pressing Tab:

- [ ] Alert appears: "✓ Society data found for SOC-003!"
- [ ] Society Code field turns **green** for 2 seconds
- [ ] Society Name = "Bargaon Beej Samiti"
- [ ] Registration Number = "REG-MP-2022-015"
- [ ] District = "Narsinghpur"
- [ ] Block = "Harrai"
- [ ] All contact and bank fields filled

**If all checked:** ✅ Feature working correctly!

---

## 🐛 Not Working?

### Problem: No auto-fill
**Fix:** Clear cache harder
- Close browser completely
- Reopen browser
- Try again

### Problem: Still not working
**Fix:** Check version
- Open browser console (F12)
- Look for version: `v=1.7.0` in Network tab
- If showing old version (v=1.5.3), cache not cleared

---

## 📖 Full Documentation

For detailed testing and troubleshooting:
- Open `TEST-SOCIETY-CODE.html` in browser
- Or read `SOCIETY-CODE-AUTO-FETCH.md`

---

**That's it!** Test with `SOC-003` and you should see instant auto-fill. 🎉
