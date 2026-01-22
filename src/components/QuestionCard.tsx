import { Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (option: string) => void;
}

const optionLabels = ['A', 'B', 'C', 'D'] as const;
const optionKeys = ['option_a', 'option_b', 'option_c', 'option_d'] as const;

export const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  onSelectAnswer 
}: QuestionCardProps) => {
  return (
    <div className="animate-fade-in">
      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {question.category}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-display font-bold text-foreground leading-relaxed mb-8">
        {question.question_text}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {optionKeys.map((key, index) => {
          const optionLetter = optionLabels[index];
          const optionText = question[key];
          const isSelected = selectedAnswer === optionLetter;
          
          return (
            <Button
              key={optionLetter}
              variant={isSelected ? "optionSelected" : "option"}
              className={cn(
                "w-full group",
                isSelected && "ring-2 ring-primary/20"
              )}
              onClick={() => onSelectAnswer(optionLetter)}
            >
              <span className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 transition-colors",
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground group-hover:bg-primary/20"
              )}>
                {optionLetter}
              </span>
              <span className="flex-1">{optionText}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
