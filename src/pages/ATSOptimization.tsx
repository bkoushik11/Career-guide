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

      const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following resume and job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Give an ATS match score (0-100) for how well the resume matches the job description.
Then, provide 3-5 specific tips to improve the resume for a higher ATS score.

Respond in JSON format:
{
  "score": number,
  "tips": [string, string, ...]
}`;

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-blue-600">
            ATS Optimization
          </h1>
          <p className="text-gray-600 mb-6">
            Ensure your resume passes Applicant Tracking Systems with our advanced analysis.
          </p>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaFileAlt className="text-blue-600" />
              Upload Your Resume
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <FaUpload className="text-blue-600" />
              <input
                type="file"
                accept=".pdf,.docx"
                className="p-2 border rounded-lg w-full text-gray-700"
                onChange={handleResumeChange}
                disabled={loading}
              />
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaFileAlt className="text-blue-600" />
              Enter Job Description
            </h2>
            <textarea
              placeholder="Paste the job description here..."
              className="w-full p-2 border rounded-lg mb-4 text-gray-700"
              rows={6}
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              disabled={loading}
            />

            <button
              className={`p-3 w-full rounded-lg text-white ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? <ClipLoader color="#fff" size={20} /> : "Analyze"}
            </button>

            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </div>

          {score !== null && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Analysis Results
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-24 h-24 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full text-2xl shadow-sm">
                  {score}%
                </div>
                <div>
                  <p className="font-semibold text-gray-800">ATS Score</p>
                  <p className="text-gray-600 text-sm">
                    How well your resume aligns with the job description.
                  </p>
                </div>
              </div>

              {tips.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Tips to Improve Your Score
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
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

