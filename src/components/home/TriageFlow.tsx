import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Question {
  id: number;
  question: string;
  options: {
    label: string;
    icon?: React.ReactNode;
    value: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is your biological sex?",
    options: [
      { label: "Male", icon: <User className="w-8 h-8" />, value: "male" },
      { label: "Female", icon: <UserRound className="w-8 h-8" />, value: "female" },
    ],
  },
  {
    id: 2,
    question: "How old are you?",
    options: [
      { label: "18-29", value: "18-29" },
      { label: "30-44", value: "30-44" },
      { label: "45-59", value: "45-59" },
      { label: "60+", value: "60+" },
    ],
  },
  {
    id: 3,
    question: "What brings you here today?",
    options: [
      { label: "Weight Management", value: "weight" },
      { label: "Blood Testing", value: "blood" },
      { label: "Minor Ailment", value: "ailment" },
      { label: "Hair Loss", value: "hair" },
    ],
  },
];

interface TriageFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TriageFlow({ isOpen, onClose }: TriageFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 300);
    } else {
      // Complete - in future this would submit
      setTimeout(onClose, 500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setAnswers({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-full h-full max-h-full p-0 border-0 rounded-none bg-white">
        <VisuallyHidden>
          <DialogTitle>Health Triage</DialogTitle>
        </VisuallyHidden>
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6">
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {/* Progress Ring */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 126} 126`}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
              {currentStep + 1}/{questions.length}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full flex items-center justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl text-center"
            >
              <h2 className="heading-section text-foreground mb-12">
                {currentQuestion.question}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(option.value)}
                    className={`relative p-8 rounded-3xl border-2 transition-all duration-200 ${
                      answers[currentQuestion.id] === option.value
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50 hover:bg-secondary"
                    }`}
                  >
                    {option.icon && (
                      <div className="flex justify-center mb-4 text-muted-foreground">
                        {option.icon}
                      </div>
                    )}
                    <span className="text-lg font-medium">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Export a trigger component
export function TriageFlowTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="border-foreground text-foreground hover:bg-foreground hover:text-background px-8 py-6 h-auto rounded-full text-base font-medium"
      >
        Start Free Assessment
      </Button>
      <TriageFlow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
