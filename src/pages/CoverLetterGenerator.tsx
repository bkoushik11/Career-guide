import React, { useState, useEffect } from 'react';
import AIChat from '../components/ui/AIChat';
import { FaUpload } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { generateGeminiText } from '@/lib/gemini';
import BackButton from '@/components/ui/BackButton';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
// @ts-ignore
import 'pdfjs-dist/legacy/build/pdf.worker';

const tones = ['Professional', 'Enthusiastic', 'Creative'];

const CoverLetterGenerator: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [tone, setTone] = useState(tones[0]);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsSuggestions, setAtsSuggestions] = useState<string[]>([]);
  const [versions, setVersions] = useState<{ name: string; date: string }[]>([]);
  const [tip, setTip] = useState('Tip: Address the hiring manager by name if possible!');
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const extractFieldsFromText = (text: string) => {
    // Simple regex-based extraction
    const nameMatch = text.match(/Name[:\s]*([A-Za-z ,.'-]+)/i);
    const phoneMatch = text.match(/(Phone|Mobile)[:\s]*([+()\d\s-]{8,})/i);
    const linkedinMatch = text.match(/linkedin\.com\/[\w\-\d/]+/i);
    if (nameMatch && nameMatch[1]) setName(nameMatch[1].trim());
    if (phoneMatch && phoneMatch[2]) setPhone(phoneMatch[2].trim());
    if (linkedinMatch) setLinkedin('https://' + linkedinMatch[0].trim());
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async () => {
          const typedarray = new Uint8Array(reader.result as ArrayBuffer);
          try {
            const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map((item: any) => item.str).join(' ') + '\n';
            }
            extractFieldsFromText(text);
          } catch (err) {
            // fallback: do nothing
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setCoverLetter('');
    setAtsScore(null);
    setAtsSuggestions([]);
    setBadgeEarned(false);

    try {
      let resumeText = '';
      if (resumeFile) {
        resumeText = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject('Failed to read resume file');
          reader.readAsText(resumeFile);
        });
      }

      const prompt = `You are an expert career coach. Write a ${tone.toLowerCase()} cover letter for the role of ${role} at ${company}.
Name: ${name}
Phone: ${phone}
LinkedIn: ${linkedin}
` +
        (resumeText ? `Resume:
${resumeText}
` : '') +
        (jobText || jobUrl ? `Job Description:
${jobText || jobUrl}
` : '') +
        `The cover letter should be tailored to the job and company, highlight my relevant experience, and use a ${tone.toLowerCase()} tone.`;

      const aiText = await generateGeminiText(prompt);
      setCoverLetter(aiText);
      setAtsScore(85);
      setAtsSuggestions(['Add "project management" to align with job requirements']);
      setBadgeEarned(true);
    } catch (err: any) {
      setCoverLetter('❌ Error generating cover letter. Please try again.');
    }

    setIsGenerating(false);
  };

  const handleDownloadPDF = () => alert('Download PDF feature coming soon!');
  const handleSave = () => {
    setVersions([...versions, { name: `Cover Letter ${versions.length + 1}`, date: new Date().toLocaleString() }]);
    alert('Saved to profile!');
  };
  const handleShare = () => alert('Share feature coming soon!');
  const handleRegenerate = () => handleGenerate();
  const handleEdit = () => setEditMode(true);
  const handleEditSave = () => setEditMode(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 md:pb-24 overflow-x-hidden pt-16 md:pt-0">
      <div className="hidden md:block"><BackButton /></div>
      <section className="relative pt-8 pb-8 px-2 md:pt-32 md:pb-20 md:px-4">
        <div className="max-w-full md:max-w-7xl mx-auto">
          <div className="max-w-full md:max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">Cover Letter Generator</h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4 md:mb-6">Craft compelling cover letters tailored to your resume and dream job.</p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full">
              <div className="flex-1 min-w-0">
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow mb-4 md:mb-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800 dark:text-white">1. Upload Your Resume</h2>
                  <div className="flex flex-col md:flex-row items-center gap-2 mb-2 md:mb-4">
                    <FaUpload className="text-blue-600 dark:text-blue-400" />
                    <input 
                      type="file" 
                      accept=".pdf,.txt" 
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" 
                      onChange={handleResumeUpload} 
                    />
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800 dark:text-white">2. Job Description</h2>
                  <div className="flex flex-col gap-2 mb-2 md:mb-4">
                    <input 
                      type="url" 
                      placeholder="Enter job posting URL" 
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" 
                      value={jobUrl} 
                      onChange={e => setJobUrl(e.target.value)} 
                    />
                    <span className="text-gray-400 dark:text-gray-500 text-xs">or</span>
                    <textarea 
                      placeholder="Paste job description here..." 
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" 
                      rows={4} 
                      value={jobText} 
                      onChange={e => setJobText(e.target.value)} 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-2 md:mb-4">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Tone</label>
                      <select 
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" 
                        value={tone} 
                        onChange={e => setTone(e.target.value)}
                      >
                        {tones.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" 
                        value={company} 
                        onChange={e => setCompany(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Role</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" 
                        value={role} 
                        onChange={e => setRole(e.target.value)} 
                      />
                    </div>
                  </div>
                  <button 
                    className="p-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 w-full flex items-center justify-center transition-colors text-base md:text-lg" 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                  >
                    {isGenerating ? <ClipLoader color="#fff" size={20} /> : 'Generate Cover Letter'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                  <button className="p-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors" onClick={handleDownloadPDF}>Download PDF</button>
                  <button className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" onClick={handleSave}>Save to Profile</button>
                  <button className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" onClick={handleShare}>Share</button>
                </div>
                <div className="flex gap-2 mb-4 md:mb-6">
                  <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">👍</button>
                  <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">👎</button>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg mb-4 md:mb-6 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">{tip}</div>
                {versions.length > 0 && (
                  <ul className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 md:mb-6">
                    {versions.map((v, i) => <li key={i} className="text-gray-700 dark:text-gray-300">{v.name} - {v.date}</li>)}
                  </ul>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow mb-4 md:mb-6 border border-gray-200 dark:border-gray-700">
                  <div className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg max-h-[60vh] overflow-y-auto mb-2 md:mb-4">
                    {editMode ? (
                      <textarea 
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" 
                        rows={12} 
                        value={coverLetter} 
                        onChange={e => setCoverLetter(e.target.value)} 
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200">{coverLetter}</pre>
                    )}
                  </div>
                  <div className="flex gap-2 mb-2 md:mb-4">
                    {!editMode ? (
                      <button className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" onClick={handleEdit}>Edit Letter</button>
                    ) : (
                      <button className="p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors" onClick={handleEditSave}>Save Edits</button>
                    )}
                    <button className="p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors" onClick={handleRegenerate}>Regenerate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AIChat />
    </div>
  );
};

export default CoverLetterGenerator;