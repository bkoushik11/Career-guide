import React from 'react';

export default function FeedbackViewer({ feedback }: { feedback: string[] }) {
  return (
    <div className="space-y-4">
      {feedback.map((item, index) => (
        <div key={index} className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100 whitespace-pre-line">{item}</p>
        </div>
      ))}
    </div>
  );
}