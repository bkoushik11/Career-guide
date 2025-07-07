import React, { useState, useEffect } from "react";
import { FaUpload, FaFileAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import AIChat from "../components/ui/AIChat";
import { generateGeminiText } from "@/lib/gemini";
import mammoth from "mammoth";
// @ts-ignore
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// @ts-ignore
import "pdfjs-dist/legacy/build/pdf.worker";
import BackButton from '@/components/ui/BackButton';

const ATSOptimization: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setResume(file);
        setError(null);
      } else {
        setError("Please upload a valid PDF or DOCX file.");
        setResume(null);
      }
    }
  };

  const handleJobDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescription(e.target.value);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!resume || !jobDescription.trim()) {
      setError("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);
    setError(null);
    setScore(null);
    setTips([]);

    try {
      let resumeText = "";

      // PDF Parsing
      if (resume.type === "application/pdf") {
        const arrayBuffer = await resume.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text +=
            content.items
              .map((item: any) => (item.str ? item.str : ""))
              .join(" ") + "\n";
        }
        resumeText = text;
      }
      // DOCX Parsing
      else if (
        resume.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = await resume.arrayBuffer();
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        resumeText = value;
      } else {
        throw new Error("Unsupported file type.");
      }

      const prompt = `You are an advanced Applicant Tracking System (ATS) and resume optimization expert.

Analyze the following candidate resume and job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Your tasks:
1. Carefully compare the resume to the job description.
2. Identify relevant keywords, skills, qualifications, and experience required for the job.
3. Evaluate how well the resume matches these requirements.
4. Consider aspects such as keyword presence, skills alignment, experience relevance, formatting, and overall clarity.
5. Identify any significant gaps or missing elements in the resume compared to the job description.

Provide your response in the following JSON format:
{
  "score": number, // An integer from 0 to 100 indicating the overall ATS match quality.
  "summary": "A concise, 2-3 sentence summary of the resume's strengths and weaknesses in relation to the job description.",
  "tips": [
    "Tip 1: Be specific and actionable.",
    "Tip 2: Focus on ATS best practices (e.g., keyword usage, formatting, quantifying achievements, etc.).",
    "Tip 3: Address any missing skills, certifications, or experience.",
    "Tip 4: Suggest improvements for clarity or structure.",
    "Tip 5: Any other relevant advice."
  ]
}
Only respond with valid JSON. Do not include any explanations outside the JSON block.`;

      const aiText = await generateGeminiText(prompt);

      let parsed: { score: number; tips: string[] } | null = null;

      try {
        parsed = JSON.parse(aiText);
      } catch {
        const scoreMatch = aiText.match(/score"?\s*:\s*(\d+)/i);
        const tipsMatch = aiText.match(/tips"?\s*:\s*\[(.*?)\]/is);
        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
        let tips: string[] = [];

        if (tipsMatch) {
          tips = tipsMatch[1]
            .split(/"\s*,\s*"/)
            .map((t) => t.replace(/"/g, "").trim())
            .filter(Boolean);
        }
        parsed = { score, tips };
      }

      setScore(parsed?.score || 0);
      setTips(parsed?.tips || []);
    } catch (err: any) {
      console.error("AI error:", err);
      setError("❌ Error analyzing resume. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 md:pt-20 overflow-x-hidden">
      <div className="hidden md:block"><BackButton /></div>
      <div className="max-w-full md:max-w-7xl mx-auto px-2 md:px-4 py-6 md:py-8">
        <div className="max-w-full md:max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
            ATS Optimization
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4 md:mb-6">
            Ensure your resume passes Applicant Tracking Systems with our advanced analysis.
          </p>

          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow mb-4 md:mb-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <FaFileAlt className="text-blue-600 dark:text-blue-400" />
              Upload Your Resume
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-2 mb-2 md:mb-4">
              <FaUpload className="text-blue-600 dark:text-blue-400" />
              <input
                type="file"
                accept=".pdf,.docx"
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                onChange={handleResumeChange}
                disabled={loading}
              />
            </div>

            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <FaFileAlt className="text-blue-600 dark:text-blue-400" />
              Enter Job Description
            </h2>
            <textarea
              placeholder="Paste the job description here..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-2 md:mb-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              rows={6}
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              disabled={loading}
            />

            <button
              className={`p-3 w-full rounded-lg text-white ${
                loading ? "bg-blue-400 dark:bg-blue-500" : "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
              } transition-colors text-base md:text-lg`}
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? <ClipLoader color="#fff" size={20} /> : "Analyze"}
            </button>

            {error && <p className="text-red-500 dark:text-red-400 mt-2 text-sm">{error}</p>}
          </div>

          {score !== null && (
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mt-4 md:mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Analysis Results
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-24 h-24 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold rounded-full text-2xl shadow-sm">
                  {score}%
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">ATS Score</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    How well your resume aligns with the job description.
                  </p>
                </div>
              </div>

              {tips.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    Tips to Improve Your Score
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    {tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
        <AIChat />
      </div>
    </div>
  );
};

export default ATSOptimization;

