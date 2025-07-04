import React, { useState, useEffect } from 'react';
import AIChat from '../components/ui/AIChat';
import { FaUpload } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { generateGeminiText } from '@/lib/gemini';

const tones = ['Professional', 'Enthusiastic', 'Creative'];

const CoverLetterGenerator: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [tone, setTone] = useState(tones[0]);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
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

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setResumeFile(e.target.files[0]);
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

` +
        (resumeText ? `Here is my resume:
${resumeText}

` : '') +
        (jobText || jobUrl ? `Here is the job description:
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
    <div className="min-h-screen bg-gray-50 pb-24">
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-blue-600">Cover Letter Generator</h1>
            <p className="text-gray-600 mb-6">Craft compelling cover letters tailored to your resume and dream job.</p>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Upload Your Resume</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <FaUpload className="text-blue-600" />
                    <input type="file" accept=".pdf,.txt" className="p-2 border rounded-lg w-full" onChange={handleResumeUpload} />
                  </div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Job Description</h2>
                  <div className="flex flex-col gap-2 mb-4">
                    <input type="url" placeholder="Enter job posting URL" className="w-full p-2 border rounded-lg" value={jobUrl} onChange={e => setJobUrl(e.target.value)} />
                    <span className="text-gray-400 text-xs">or</span>
                    <textarea placeholder="Paste job description here..." className="w-full p-2 border rounded-lg" rows={4} value={jobText} onChange={e => setJobText(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Tone</label>
                      <select className="p-2 border rounded-lg w-full" value={tone} onChange={e => setTone(e.target.value)}>
                        {tones.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Company Name</label>
                      <input type="text" className="w-full p-2 border rounded-lg" value={company} onChange={e => setCompany(e.target.value)} />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Role</label>
                      <input type="text" className="w-full p-2 border rounded-lg" value={role} onChange={e => setRole(e.target.value)} />
                    </div>
                  </div>
                  <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full flex items-center justify-center" onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? <ClipLoader color="#fff" size={20} /> : 'Generate Cover Letter'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <button className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={handleDownloadPDF}>Download PDF</button>
                  <button className="p-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300" onClick={handleSave}>Save to Profile</button>
                  <button className="p-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300" onClick={handleShare}>Share</button>
                </div>
                <div className="flex gap-2 mb-6">
                  <button className="p-2 bg-gray-200 rounded-lg">👍</button>
                  <button className="p-2 bg-gray-200 rounded-lg">👎</button>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg mb-6 text-blue-800">{tip}</div>
                {versions.length > 0 && (
                  <ul className="p-4 bg-gray-50 border rounded-lg mb-6">
                    {versions.map((v, i) => <li key={i} className="text-gray-700">{v.name} - {v.date}</li>)}
                  </ul>
                )}
              </div>
              <div className="flex-1">
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                  <div className="p-4 bg-white border rounded-lg max-h-[60vh] overflow-y-auto mb-4">
                    {editMode ? (
                      <textarea className="w-full p-2 border rounded-lg" rows={12} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
                    ) : (
                      <pre className="whitespace-pre-wrap font-sans text-gray-800">{coverLetter}</pre>
                    )}
                  </div>
                  <div className="flex gap-2 mb-4">
                    {!editMode ? (
                      <button className="p-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300" onClick={handleEdit}>Edit Letter</button>
                    ) : (
                      <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleEditSave}>Save Edits</button>
                    )}
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleRegenerate}>Regenerate</button>
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