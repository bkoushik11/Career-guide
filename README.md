
# 🧭 Career Guide

Career Guide is an all-in-one AI-powered web application that helps job seekers build professional resumes, generate tailored cover letters, optimize for ATS (Applicant Tracking Systems), and prepare for interviews with a live AI mock interview session.

---

## 🚀 Features

### 📄 1. Resume Builder
AI-assisted resume builder that formats your resume to be ATS-friendly and professional. It takes basic user input and generates a clean, keyword-optimized resume.

### 📝 2. Cover Letter Generator
Generates customized cover letters based on your resume and the job you're applying for. Uses AI to craft personalized letters with the right tone and highlights.

### ✅ 3. ATS Checker
Checks your resume against typical ATS filters to identify missing keywords, formatting issues, and optimization tips — helping your resume pass real-world filters.

### 🎤 4. Live AI Interview
Simulates a live interview using AI. Provides interactive question-answer sessions to help you build confidence and receive realistic mock interview experience.

---

## 🌐 Live Demo

[🌍 Visit Live Site](https://careeerguide.netlify.app)

---

## 🛠️ Tech Stack

| Layer       | Technology                      |
|-------------|----------------------------------|
| Frontend    | Tailwind CSS, React with tyepscript |
| Backend     | [Supabase](https://supabase.io/) (DB + Auth + API) |
| AI Services |  Gemini API (for text generation) |
| Dev Tools   | [Bolt.new](https://bolt.new/) (Vibe Coding), Cursor (debugging), Netlify (deployment) |

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/bkoushik11/Career-guide.git
cd Career-guide
```
### 2. Install Dependencies

```bash
npm install
```
### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add your Supabase and Gemini API keys:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_google_genai_api_key
```
💡 If you're using a different AI provider like OpenAI, replace the corresponding key.

### 4. Run the App Locally
```bash
npm run dev
```
Visit: http://localhost:3000

## 🧑‍💻 Contributing

Contributions are welcome and appreciated!

1. Fork this repo.
2. Create a feature branch:

```bash
git checkout -b your-feature
Make your changes.
```
Commit:

```bash
git commit -m "Add your message"
```
Push:

```bash
git push origin your-feature
```
Open a Pull Request.

### Please make sure your code is clean, readable, and tested. Add comments where necessary.

📄 License
This project is licensed under the MIT License.

📬 Contact
For any feedback or suggestions, feel free to open an issue or reach out via GitHub.

Made with ❤️ using Supabase, Bolt.new, and AI.
