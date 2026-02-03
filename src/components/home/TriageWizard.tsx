import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft } from "lucide-react";

// Sample questions for visual demo only
const questions = [
  {
    id: 1,
    question: "What brings you to us today?",
    options: [
      "Weight management",
      "Blood testing",
      "Prescription renewal",
      "General health concern",
    ],
  },
  {
    id: 2,
    question: "Have you used this type of treatment before?",
    options: ["Yes, currently using", "Yes, in the past", "No, first time"],
  },
  {
    id: 3,
    question: "Do you have any known allergies?",
    options: ["No known allergies", "Yes, I have allergies"],
  },
  {
    id: 4,
    question: "Are you currently taking any medications?",
    options: ["No medications", "Yes, prescription medications", "Yes, over-the-counter only"],
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function TriageWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];

  const handleOptionSelect = (option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const goToNext = () => {
    if (currentStep < questions.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <section className="section-padding bg-secondary">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-accent rounded-full" />
            <span className="text-label text-accent tracking-widest">
              Quick Assessment
            </span>
            <span className="w-8 h-[2px] bg-accent rounded-full" />
          </div>
          <h2 className="heading-section">Tell Us About Your Needs</h2>
        </motion.div>

        {/* Wizard Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="px-8 pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>
                Question {currentStep + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Question Content */}
          <div className="p-8 min-h-[350px] relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full"
              >
                <h3 className="text-xl md:text-2xl font-serif font-medium text-center mb-8">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        selectedAnswers[currentQuestion.id] === option
                          ? "border-accent bg-accent/5 text-foreground"
                          : "border-border hover:border-accent/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="px-8 pb-6 flex items-center justify-between border-t border-border pt-4">
            <Button
              variant="ghost"
              onClick={goToPrevious}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < questions.length - 1 ? (
              <Button
                onClick={goToNext}
                disabled={!selectedAnswers[currentQuestion.id]}
                className="gap-2 bg-accent hover:bg-accent/90"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                disabled={!selectedAnswers[currentQuestion.id]}
                className="gap-2 bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)]"
              >
                Submit
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Your answers help us recommend the right treatment for you.
        </p>
      </div>
    </section>
  );
}
