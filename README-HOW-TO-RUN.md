# 🚀 HOW TO RUN THE APPLICATION

## ⚠️ IMPORTANT: Do NOT Open index.html Directly!

**Opening index.html by double-clicking will NOT work** because:
- Browser security blocks CSS and JavaScript files when using `file://` protocol
- You'll see "Provisional headers are shown" error
- No styles will load (white/blank page)

---

## ✅ CORRECT WAY TO RUN (Choose One Method)

### **METHOD 1: Use the Batch Files (EASIEST)**

#### Step 1: Start the Server
1. Double-click **`START-SERVER.bat`**
2. A black command window will open
3. You'll see: "Serving HTTP on :: port 8000"
4. **Keep this window open** (do NOT close it)

#### Step 2: Open the Application
1. Double-click **`OPEN-APPLICATION.bat`**
2. Your browser will automatically open to `http://localhost:8000/index.html`
3. The application will load with full styling and functionality

#### To Stop:
- Close the browser
- Go back to the black command window
- Press `Ctrl+C` to stop the server
- Or just close the command window

---

### **METHOD 2: Manual Python Server**

1. Open Command Prompt (CMD)
2. Navigate to the project folder:
   ```cmd
   cd "c:\Users\hp\Desktop\Projects Folder\Beej Sangh\Breeder Module Wireframe"
   ```
3. Start Python server:
   ```cmd
   python -m http.server 8000
   ```
4. Open browser and go to:
   ```
   http://localhost:8000/index.html
   ```

---

### **METHOD 3: Using VS Code Live Server Extension**

If you have VS Code:
1. Install "Live Server" extension by Ritwick Dey
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Application will open at `http://127.0.0.1:5500/index.html`

---

### **METHOD 4: Using Node.js (if installed)**

1. Install http-server globally:
   ```cmd
   npm install -g http-server
   ```
2. Navigate to project folder in CMD
3. Run:
   ```cmd
   http-server -p 8000
   ```
4. Open: `http://localhost:8000/index.html`

---

## 🎯 WHAT YOU SHOULD SEE

When correctly running through a server, you should see:

✅ **Login Page:**
- Green gradient background
- White login card in center
- Beej Sangh logo at top
- Role tabs (Society Head / Dept Sangh Admin)
- Properly styled input fields
- Green primary buttons

✅ **Dashboard (after login):**
- Light green background (#f1f8e9)
- Dark green sidebar with white text
- White stat cards with colored borders
- Proper typography and spacing
- All colors vibrant and clear

---

## ❌ TROUBLESHOOTING

### Problem: "This site can't be reached"
**Solution:** Make sure the server is running (START-SERVER.bat window is open)

### Problem: Port 8000 already in use
**Solution:** Change port in START-SERVER.bat:
```batch
python -m http.server 8001
```
Then open: `http://localhost:8001/index.html`

### Problem: Python not found
**Solution:** 
1. Install Python from https://www.python.org/downloads/
2. During installation, check "Add Python to PATH"
3. Restart computer
4. Try again

### Problem: Still no styles loading
**Solution:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Check if styles.css shows Status: 200 OK
5. If not, screenshot the error and report

---

## 📂 FILE STRUCTURE

```
Breeder Module Wireframe/
├── index.html              ← Main application file
├── styles.css              ← All styles (37KB)
├── app.js                  ← Main application logic
├── modules.js              ← Admin modules
├── seed-modules.js         ← Society modules
├── captcha.js              ← Captcha functionality
├── society-registration.js ← Registration forms
├── START-SERVER.bat        ← ⭐ Use this to start server
├── OPEN-APPLICATION.bat    ← ⭐ Use this to open app
└── README-HOW-TO-RUN.md    ← This file
```

---

## 🎨 DEFAULT CREDENTIALS

**Society Head Login:**
- Society Code: `SOC-001`
- Username: `ramesh`
- Password: `password`

**Admin Login:**
- Username: `admin`
- Password: `admin123`

---

## ✅ CHECKLIST

Before reporting issues, verify:
- [ ] Used START-SERVER.bat (not double-clicked index.html)
- [ ] Server window is open and running
- [ ] URL shows `http://localhost:8000` (not `file:///`)
- [ ] Browser console (F12) shows no red errors
- [ ] Network tab shows styles.css loaded (Status: 200)

---

## 📞 SUPPORT

If issues persist after using the server:
1. Take screenshot of browser (showing URL bar)
2. Take screenshot of DevTools Console (F12 → Console)
3. Take screenshot of DevTools Network tab (F12 → Network → styles.css)
4. Report with these screenshots

---

**Remember: ALWAYS use START-SERVER.bat, never open index.html directly!**
