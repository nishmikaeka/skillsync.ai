## SkillSync.ai
> AI-powered Chrome extension for intelligent job application matching.

### Overview
SkillSync.ai analyzes your CV against job descriptions using Google Gemini 1.5 Flash to provide:
* **Match Score:** 0-100% alignment rating.
* **Skill Gap:** Identification of matching and missing keywords.
* **Support:** Personalized stats and auto-generated cover emails.

---

### Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) |
| **Backend** | ![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![Fastify](https://img.shields.io/badge/fastify-000000?style=for-the-badge&logo=fastify&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) |
| **AI & Tools** | ![Gemini](https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white) ![Chrome](https://img.shields.io/badge/Chrome_Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white) |

---

### Quick Start

<details>
<summary><b>1. Backend Setup (NestJS)</b></summary>

```bash
cd skillsync-ai
npm install @google/generative-ai dotenv cors
# Configure .env with GEMINI_API_KEY and PORT
npm run start:dev

```

</details>

<details>
<summary><b>2. Extension Setup (React)</b></summary>

```bash
cd extension
npm install
npm run build
# Load 'dist' folder in chrome://extensions/

```

</details>

---

### Project Structure

```text
skillsync-ai/
├── skillsync-ai/      # NestJS Analysis Engine
├── extension/         # React Chrome Extension
└── README.md

```

---

### API & Analysis

##### POST `/analyze`

**Request Body:** `{ "cvText": "...", "jobText": "..." }`

<details>
<summary><b>View Response Schema</b></summary>

```json
{
  "summary": ["string"],
  "matchPercentage": 85,
  "matchingSkills": ["string"],
  "missingSkills": ["string"],
  "advice": "string",
  "email": "string"
}

```

</details>

---

### Troubleshooting

* **PDF Fails:** Ensure text is selectable (not an image).
* **No Response:** Verify backend is running on port 3000.
* **API Error:** Check Gemini API key validity and credits.

---

### License & Support

* **License:** MIT
* **Author:** [@nishmikaeka](https://www.google.com/search?q=https://github.com/nishmikaeka)
* **Issues:** [Report a bug](https://www.google.com/search?q=https://github.com/nishmikaeka/skillsync.ai/issues)

---

<sub>Made with React, TypeScript, NestJS & Gemini AI. Stop applying blindly. Start matching intelligently.</sub>
```
