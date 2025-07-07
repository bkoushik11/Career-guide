import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface QuestionCardProps {
  question: string;
  answer: string;
  showAnswer: boolean;
  onToggleAnswer: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  showAnswer,
  onToggleAnswer,
}) => (
  <Card>
    <CardHeader>
      <CardTitle
        className="text-xl cursor-pointer hover:text-blue-600"
        onClick={onToggleAnswer}
      >
        {question}
      </CardTitle>
    </CardHeader>
    {showAnswer && (
      <CardContent>
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 mt-1">{answer}</p>
        </div>
      </CardContent>
    )}
  </Card>
);

export default QuestionCard; 