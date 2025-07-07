import React from "react";

interface SuggestionsTipsProps {
  suggestions: string[];
  tips: string[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
}

const SuggestionsTips: React.FC<SuggestionsTipsProps> = ({
  suggestions,
  tips,
  loading,
  error,
  onRefresh,
}) => (
  <div
    className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-800 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors"
    onClick={loading ? undefined : onRefresh}
    title="Click to refresh AI Suggestions & Tips"
  >
    <h3 className="font-semibold text-yellow-800 dark:text-yellow-100 mb-2">
      AI Suggestions & Tips
    </h3>
    {loading ? (
      <div className="text-yellow-700 dark:text-yellow-200 text-sm">
        Thinking...
      </div>
    ) : error ? (
      <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
    ) : (
      <ul className="pl-5 text-yellow-900 dark:text-yellow-100 text-sm space-y-1">
        {[...suggestions, ...tips].map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    )}
  </div>
);

export default SuggestionsTips; 