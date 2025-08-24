# Fixing React Backend

A collection of debug and test scripts designed to troubleshoot and optimize a React-based backend system.  
This repo contains modular files for checking services, analyzing routes, validating schemas, and testing storage mechanisms.

---

## 📂 Repository Overview

This repository contains multiple standalone scripts categorized as:

### **Debug Scripts**
- `debug-ai-response.js` – Debugs AI model responses and logs issues.
- `debug-data-flow.js` – Traces backend data flow between services.
- `debug-routes.js` – Verifies API routes and ensures correct response structure.
- `debug-service-methods.js` – Checks core backend service logic.
- `debug-server-startup.js` – Validates server boot process and detects startup errors.
- `debug-storage-detailed.js` – Inspects data storage logic with detailed logging.
- `debug-storage-internals.js` – Tests internal storage consistency.

### **Fix Scripts**
- `fix-file-processor.js` – Corrects issues in file-processing logic.
- `fix-regex-errors.js` – Patches regular expression parsing issues.
- `fix-resume-route.js` – Fixes routing logic for resume-related endpoints.
- `fix-resume-schema.js` – Ensures schema validation for resume data.
- `fix-resume-storage-service.js` – Repairs storage service errors.

### **Test Scripts**
- `test-clean-storage.js` – Tests data cleanup and storage integrity.
- `test-complete-storage.js` – Full test suite for all storage scenarios.
- `test-direct-database.js` – Runs direct database interaction tests.
- `test-storage-with-route-data.js` – Validates storage logic using route-based inputs.

### **Utility Scripts**
- `check-file-processor.js` – Validates file processor initialization.
- `check-gemini-service.js` – Tests Gemini API/service integration.
- `create-clean-storage.js` – Creates clean storage environment for tests.
- `create-test-resume.js` – Generates dummy resumes for backend validation.
- `migrate-resume-data.js` – Migrates resume data between different formats.

---

## 🛠️ Usage

### **1. Clone the Repository**
```bash
git clone https://github.com/ghanshyam2005singh/fixing-react-backend.git
cd fixing-react-backend
````

### **2. Install Dependencies**

If any of the scripts use external packages:

```bash
npm install
```

### **3. Run a Debug/Test Script**

```bash
node debug-routes.js
```

Replace `debug-routes.js` with any script you want to execute.

---

## 🔍 Purpose

This repository is designed to:

* Debug and analyze backend services.
* Test storage, schema, and API route functionality.
* Provide utilities for fixing and migrating backend data.

---

## 📜 License

MIT License – Feel free to use, modify, and distribute.

---

## 👨‍💻 Author

* **Ghanshyam Singh** – [GitHub](https://github.com/ghanshyam2005singh)
