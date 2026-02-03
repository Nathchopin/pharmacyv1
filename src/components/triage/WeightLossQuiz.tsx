import { useState, useEffect } from "react";
import { useWeightLossStore } from "@/stores/weight-loss-store";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, Check, X, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Deep Eucalyptus brand color
const BRAND_COLOR = "#134E4A";

// Question types
type QuestionType =
    | "multiple_choice_multiple"
    | "number_input"
    | "button_choice"
    | "yes_no"
    | "checkbox_list"
    | "yes_no_with_input"
    | "button_choice_cards"
    | "consent_checkboxes";

interface QuestionOption {
    value: string;
    label: string;
    icon?: string;
    severity?: string;
    flag?: string;
    badge?: string;
    description?: string;
}

interface Question {
    id: string;
    order: number;
    section: string;
    question: string;
    subtitle?: string;
    context?: string;
    type: QuestionType;
    required: boolean;
    options?: QuestionOption[];
    input_config?: {
        unit: string;
        min: number;
        max: number;
        placeholder: string;
    };
    show_if?: string;
    rejection_on_yes?: boolean;
    rejection_message?: string;
    follow_up_if_yes?: {
        question: string;
        type: string;
        placeholder?: string;
        options?: QuestionOption[];
    };
    validation?: {
        error_message?: string;
        rejection_if_any_selected_except?: string[];
        rejection_message?: string;
        flag_for_review_if_yes?: boolean;
        min_selections?: number;
        all_must_be_checked?: boolean;
    };
    consents?: { id: string; text: string }[];
    list?: string[];
}

// Quiz Questions (simplified version based on our JSON)
const QUIZ_QUESTIONS: Question[] = [
    {
        id: "q1_motivation",
        order: 1,
        section: "introduction",
        question: "What are your main reasons for wanting to lose weight?",
        subtitle: "Select all that apply",
        type: "multiple_choice_multiple",
        required: true,
        options: [
            { value: "health", label: "Improving my overall health" },
            { value: "condition", label: "Managing a specific health condition" },
            { value: "body_image", label: "Feeling better in my body" },
            { value: "activity", label: "Being more active" },
            { value: "mood", label: "Improving my mood & mental wellbeing" },
            { value: "energy", label: "Improving my sleep & energy levels" },
        ],
        validation: { min_selections: 1 },
    },
    {
        id: "q2_height",
        order: 2,
        section: "anthropometrics",
        question: "What's your height?",
        type: "number_input",
        required: true,
        input_config: {
            unit: "cm",
            min: 120,
            max: 250,
            placeholder: "175",
        },
        validation: {
            error_message: "Please enter a valid height between 120-250cm",
        },
    },
    {
        id: "q3_weight",
        order: 3,
        section: "anthropometrics",
        question: "What's your current weight?",
        type: "number_input",
        required: true,
        input_config: {
            unit: "kg",
            min: 40,
            max: 300,
            placeholder: "85",
        },
        validation: {
            error_message: "Please enter a valid weight between 40-300kg",
        },
    },
    {
        id: "q4_biological_sex",
        order: 4,
        section: "demographics",
        question: "What is your biological sex?",
        subtitle: "This helps us provide personalized care",
        type: "button_choice",
        required: true,
        options: [
            { value: "male", label: "Male", icon: "user" },
            { value: "female", label: "Female", icon: "user" },
        ],
    },
    {
        id: "q5_pregnancy_status",
        order: 5,
        section: "safety_screeners",
        question: "Are you currently pregnant, planning to become pregnant, or breastfeeding?",
        type: "yes_no",
        required: true,
        show_if: "q4_biological_sex === 'female'",
        rejection_on_yes: true,
        rejection_message: "GLP-1 medications are not recommended during pregnancy or breastfeeding",
    },
    {
        id: "q6_medical_screeners_critical",
        order: 6,
        section: "safety_screeners",
        question: "Do you have any of the following conditions?",
        subtitle: "Select all that apply",
        type: "checkbox_list",
        required: true,
        list: [
            "History of Pancreatitis",
            "Personal or family history of thyroid cancer",
            "Multiple endocrine neoplasia type 2",
            "Type 1 diabetes",
            "Severe liver or kidney problems",
            "Heart failure",
            "Eating disorder (current or history)",
            "Cancer requiring monitoring or treatment",
        ],
        options: [
            { value: "none", label: "None of the above" },
        ],
        validation: {
            rejection_if_any_selected_except: ["none"],
            rejection_message: "Based on your medical history, GLP-1 medication may not be suitable. Please consult with your GP.",
        },
    },
    {
        id: "q7_medical_conditions",
        order: 7,
        section: "medical_history",
        question: "Have you been diagnosed with any of these conditions?",
        subtitle: "Select all that apply - these won't disqualify you",
        type: "checkbox_list",
        required: false,
        list: [
            "Type 2 diabetes",
            "High blood pressure",
            "High cholesterol",
            "Sleep apnoea",
            "PCOS",
            "Fatty liver disease",
            "Depression",
        ],
        options: [
            { value: "none", label: "None of the above" },
        ],
    },
    {
        id: "q8_current_medications",
        order: 8,
        section: "medical_history",
        question: "Are you currently taking any prescription medications?",
        type: "yes_no_with_input",
        required: true,
        follow_up_if_yes: {
            question: "Please list your current medications",
            type: "textarea",
            placeholder: "e.g., Metformin, Lisinopril, etc.",
        },
    },
    {
        id: "q9_medication_preference",
        order: 9,
        section: "treatment_preference",
        question: "Which weight loss medication are you interested in?",
        subtitle: "Our clinical team will recommend the most suitable option",
        type: "button_choice_cards",
        required: true,
        options: [
            {
                value: "mounjaro",
                label: "Mounjaro",
                description: "Tirzepatide - Most effective option",
                badge: "Popular",
            },
            {
                value: "wegovy",
                label: "Wegovy",
                description: "Semaglutide - Clinically proven",
            },
            {
                value: "pharmacist_choice",
                label: "Let our pharmacist decide",
                description: "We'll recommend the best option for you",
            },
        ],
    },
    {
        id: "q10_consent",
        order: 10,
        section: "consent",
        question: "Please confirm the following",
        type: "consent_checkboxes",
        required: true,
        consents: [
            { id: "sole_user", text: "I will be the sole user of this medication" },
            { id: "read_info", text: "I will read all information provided before starting treatment" },
            { id: "report_changes", text: "I will inform the clinical team about any new health conditions" },
            { id: "pregnancy", text: "I will stop medication immediately if I fall pregnant" },
            { id: "missed_doses", text: "I will contact the team if I miss two or more doses" },
        ],
        validation: {
            all_must_be_checked: true,
        },
    },
];

interface WeightLossQuizProps {
    onComplete?: () => void;
}

export function WeightLossQuiz({ onComplete }: WeightLossQuizProps) {
    const navigate = useNavigate();

    // Zustand Store
    const {
        step: currentStep,
        answers,
        setAnswer,
        goNext,
        goBack,
        reset
    } = useWeightLossStore();

    // Local UI State (Transient)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showRejection, setShowRejection] = useState(false);
    const [rejectionMessage, setRejectionMessage] = useState("");

    // Reset store on mount
    useEffect(() => {
        reset();
    }, []);

    const totalSteps = QUIZ_QUESTIONS.length;
    const currentQuestion = QUIZ_QUESTIONS[currentStep];
    const progress = ((currentStep + 1) / totalSteps) * 100;

    // Check if question should be shown based on show_if condition
    const shouldShowQuestion = (question: Question): boolean => {
        if (!question.show_if) return true;
        // Simple evaluation: "q4_biological_sex === 'female'"
        const match = question.show_if.match(/(\w+)\s*===\s*'(\w+)'/);
        if (match) {
            const [, questionId, value] = match;
            return answers[questionId] === value;
        }
        return true;
    };

    // Calculate BMI
    const calculateBMI = () => {
        const height = answers.q2_height;
        const weight = answers.q3_weight;
        if (height && weight) {
            const bmi = weight / Math.pow(height / 100, 2);
            return parseFloat(bmi.toFixed(1));
        }
        return null;
    };

    // Check if current answer is valid
    const isAnswerValid = (): boolean => {
        const answer = answers[currentQuestion.id];

        if (!currentQuestion.required) return true;

        switch (currentQuestion.type) {
            case "multiple_choice_multiple":
            case "checkbox_list":
                return Array.isArray(answer) && answer.length > 0;
            case "button_choice":
            case "yes_no":
            case "button_choice_cards":
                return !!answer;
            case "number_input":
                return !!answer && !isNaN(Number(answer));
            case "yes_no_with_input":
                if (answer?.value === "yes") {
                    return !!answer?.detail;
                }
                return !!answer?.value;
            case "consent_checkboxes":
                const consents = currentQuestion.consents || [];
                return consents.every((consent) => answer?.[consent.id] === true);
            default:
                return !!answer;
        }
    };

    // Handle next button click
    const handleNext = async () => {
        if (!isAnswerValid()) {
            setError("Please answer this question to continue");
            return;
        }

        setError(null);

        // Check for rejection conditions
        const answer = answers[currentQuestion.id];

        // BMI Check (after weight question)
        if (currentQuestion.id === "q3_weight") {
            const bmi = calculateBMI();
            if (bmi && bmi < 27) {
                setRejectionMessage(
                    "Unfortunately, you don't meet the BMI criteria for GLP-1 medication (BMI must be 27 or above). However, we can help you with nutrition consultations and exercise plans."
                );
                setShowRejection(true);
                return;
            }
        }

        // Yes/No rejection check
        if (currentQuestion.rejection_on_yes && answer === "yes") {
            setRejectionMessage(currentQuestion.rejection_message || "You are not eligible for this treatment.");
            setShowRejection(true);
            return;
        }

        // Checkbox list rejection check
        if (currentQuestion.validation?.rejection_if_any_selected_except) {
            const except = currentQuestion.validation.rejection_if_any_selected_except;
            const selectedValues = Array.isArray(answer) ? answer : [];
            const hasRejectionCondition = selectedValues.some((val) => !except.includes(val));

            if (hasRejectionCondition) {
                setRejectionMessage(currentQuestion.validation.rejection_message || "You are not eligible for this treatment.");
                setShowRejection(true);
                return;
            }
        }

        // Move to next question, skipping if show_if condition is false
        let nextStep = currentStep + 1;
        while (nextStep < totalSteps && !shouldShowQuestion(QUIZ_QUESTIONS[nextStep])) {
            nextStep++;
        }

        if (nextStep >= totalSteps) {
            // Quiz complete, submit to Supabase
            await handleSubmit();
        } else {
            goNext(nextStep);
            window.scrollTo(0, 0); // Ensure scroll to top
        }
    };

    // Handle previous button click
    const handlePrevious = () => {
        let prevStep = currentStep - 1;
        while (prevStep >= 0 && !shouldShowQuestion(QUIZ_QUESTIONS[prevStep])) {
            prevStep--;
        }
        if (prevStep >= 0) {
            goBack(); // The store handles history, but we verify here
            setError(null);
        }
    };

    // Handle quiz submission
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const bmi = calculateBMI();

            // Prepare patient data
            const patientData = {
                bmi,
                height_cm: answers.q2_height,
                weight_kg: answers.q3_weight,
                biological_sex: answers.q4_biological_sex,
                motivations: answers.q1_motivation,
                medication_preference: answers.q9_medication_preference,
                medical_screeners: {
                    critical_conditions: answers.q6_medical_screeners_critical || [],
                    comorbidities: answers.q7_medical_conditions || [],
                    current_medications: answers.q8_current_medications?.detail || null,
                    pregnancy_status: answers.q5_pregnancy_status || null,
                },
                consent: {
                    all_consents_agreed: true,
                },
                completion_time: new Date().toISOString(),
            };

            // Navigate to recommendation with data
            if (onComplete) {
                onComplete();
            } else {
                navigate("/weight-loss/recommendation", {
                    state: {
                        weightData: {
                            current: answers.q3_weight,
                            target: answers.q3_weight * 0.85
                        },
                        medication: answers.q9_medication_preference,
                        consultationData: patientData // Pass full data for later saving
                    }
                });
            }
        } catch (err) {
            console.error("Error submitting quiz:", err);
            setError("Failed to submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update answer
    const updateAnswer = (value: any) => {
        setAnswer(currentQuestion.id, value);
        setError(null);
    };

    if (showRejection) {
        return <RejectionScreen message={rejectionMessage} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#134E4A]/5 via-[#0F3D39]/5 to-background flex flex-col">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
                <motion.div
                    className="h-full"
                    style={{ backgroundColor: BRAND_COLOR }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Question Container */}
            <div
                className="flex-1 flex items-center justify-center px-4 py-20 transform-gpu"
                style={{ transform: "translateZ(0)" }}
            >
                <div className="w-full max-w-2xl">
                    <div className="space-y-8">
                        {/* Question Header */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Question {currentStep + 1} of {totalSteps}</span>
                                <span>•</span>
                                <span className="capitalize">{currentQuestion.section.replace("_", " ")}</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif font-medium text-foreground">
                                {currentQuestion.question}
                            </h2>
                            {currentQuestion.subtitle && (
                                <p className="text-muted-foreground">{currentQuestion.subtitle}</p>
                            )}
                            {currentQuestion.context && (
                                <p className="text-sm text-muted-foreground italic">{currentQuestion.context}</p>
                            )}
                        </div>

                        {/* Question Input */}
                        <QuestionInput
                            question={currentQuestion}
                            value={answers[currentQuestion.id]}
                            onChange={updateAnswer}
                        />

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                                <X className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t px-4 py-6">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        className="gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={!isAnswerValid() || isSubmitting}
                        className="gap-2 text-white"
                        style={{ backgroundColor: BRAND_COLOR }}
                    >
                        {isSubmitting ? "Submitting..." : currentStep === totalSteps - 1 ? "Submit" : "Continue"}
                        {!isSubmitting && <ChevronRight className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Question Input Component
function QuestionInput({ question, value, onChange }: any) {
    switch (question.type) {
        case "multiple_choice_multiple":
            return <MultipleChoiceMultiple question={question} value={value} onChange={onChange} />;
        case "number_input":
            return <NumberInput question={question} value={value} onChange={onChange} />;
        case "button_choice":
            return <ButtonChoice question={question} value={value} onChange={onChange} />;
        case "yes_no":
            return <YesNo question={question} value={value} onChange={onChange} />;
        case "checkbox_list":
            return <CheckboxList question={question} value={value} onChange={onChange} />;
        case "yes_no_with_input":
            return <YesNoWithInput question={question} value={value} onChange={onChange} />;
        case "button_choice_cards":
            return <ButtonChoiceCards question={question} value={value} onChange={onChange} />;
        case "consent_checkboxes":
            return <ConsentCheckboxes question={question} value={value} onChange={onChange} />;
        default:
            return <div>Unsupported question type</div>;
    }
}

// Multiple Choice (Multiple Selection) - Optimized
function MultipleChoiceMultiple({ question, value, onChange }: any) {
    const selected = value || [];

    const toggleOption = (optionValue: string) => {
        if (selected.includes(optionValue)) {
            onChange(selected.filter((v: string) => v !== optionValue));
        } else {
            onChange([...selected, optionValue]);
        }
    };

    return (
        <div className="space-y-3">
            {question.options?.map((option: QuestionOption) => {
                const isSelected = selected.includes(option.value);
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleOption(option.value)}
                        className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 ease-in-out transform hover:scale-[1.01] active:scale-[0.99] ${isSelected
                            ? "border-[#134E4A] bg-[#134E4A]/5"
                            : "border-gray-200 hover:border-[#134E4A]/30 hover:bg-gray-50"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected
                                    ? "border-[#134E4A] bg-[#134E4A]"
                                    : "border-gray-300"
                                    }`}
                            >
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-base text-gray-900">{option.label}</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

// Number Input
function NumberInput({ question, value, onChange }: any) {
    return (
        <div className="space-y-4">
            <div className="relative">
                <Input
                    type="number"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={question.input_config?.placeholder}
                    min={question.input_config?.min}
                    max={question.input_config?.max}
                    className="text-2xl py-6 pr-16 border-2 focus:border-[#134E4A]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    {question.input_config?.unit}
                </span>
            </div>
        </div>
    );
}

// Button Choice
function ButtonChoice({ question, value, onChange }: any) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {question.options?.map((option: QuestionOption) => (
                <motion.button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`px-6 py-8 rounded-xl border-2 transition-all ${value === option.value
                        ? "border-[#134E4A] bg-[#134E4A]/5"
                        : "border-gray-200 hover:border-[#134E4A]/30 hover:bg-gray-50"
                        }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <User className="w-8 h-8 mx-auto mb-3 text-[#134E4A]" />
                    <div className="text-lg font-medium">{option.label}</div>
                </motion.button>
            ))}
        </div>
    );
}

// Yes/No
function YesNo({ question, value, onChange }: any) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {["yes", "no"].map((option) => (
                <motion.button
                    key={option}
                    onClick={() => onChange(option)}
                    className={`px-6 py-8 rounded-xl border-2 transition-all capitalize ${value === option
                        ? "border-[#134E4A] bg-[#134E4A]/5"
                        : "border-gray-200 hover:border-[#134E4A]/30 hover:bg-gray-50"
                        }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <div className="text-xl font-medium">{option}</div>
                </motion.button>
            ))}
        </div>
    );
}

// CheckboxList - Optimized for performance (removed heavy motions)
function CheckboxList({ question, value, onChange }: any) {
    const selected = value || [];
    const listItems = question.list || [];
    const noneOption = question.options?.find((opt: QuestionOption) => opt.value === "none");
    const noneValue = noneOption?.value || "none";

    const toggleItem = (itemValue: string) => {
        let newSelected = [...selected];

        if (itemValue === noneValue) {
            // Exclusive: Clears everything else
            newSelected = selected.includes(noneValue) ? [] : [noneValue];
        } else {
            // Standard Item
            // 1. Remove "none" if present
            if (newSelected.includes(noneValue)) {
                newSelected = newSelected.filter(v => v !== noneValue);
            }

            // 2. Toggle item
            if (newSelected.includes(itemValue)) {
                newSelected = newSelected.filter(v => v !== itemValue);
            } else {
                newSelected.push(itemValue);
            }
        }
        onChange(newSelected);
    };

    return (
        <div className="space-y-3">
            {listItems.map((item: string) => {
                const isSelected = selected.includes(item);
                return (
                    <button
                        key={item}
                        type="button"
                        onClick={() => toggleItem(item)}
                        className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-colors duration-200 ${isSelected
                            ? "border-[#134E4A] bg-[#134E4A]/5"
                            : "border-gray-200 hover:border-[#134E4A]/30 hover:bg-gray-50"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? "border-[#134E4A] bg-[#134E4A]" : "border-gray-300"
                                    }`}
                            >
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-base text-gray-900">{item}</span>
                        </div>
                    </button>
                );
            })}

            {question.options?.filter((o: any) => o.value === 'none').map((option: QuestionOption) => {
                const isSelected = selected.includes(option.value);
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleItem(option.value)}
                        className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-colors duration-200 font-medium ${isSelected
                            ? "border-[#134E4A] bg-[#134E4A]/5"
                            : "border-gray-200 hover:border-[#134E4A]/30 hover:bg-gray-50"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? "border-[#134E4A] bg-[#134E4A]" : "border-gray-300"
                                    }`}
                            >
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-base text-gray-900">{option.label}</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

// Yes/No with Follow-up Input
function YesNoWithInput({ question, value, onChange }: any) {
    const currentValue = value || { value: "", detail: "" };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {["yes", "no"].map((option) => (
                    <motion.button
                        key={option}
                        onClick={() => onChange({ ...currentValue, value: option })}
                        className={`px-6 py-8 rounded-xl border-2 transition-all capitalize ${currentValue.value === option
                            ? "border-[#134E4A] bg-[#134E4A]/5"
                            : "border-gray-200 hover:border-[#134E4A]/30 hover:bg-gray-50"
                            }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <div className="text-xl font-medium">{option}</div>
                    </motion.button>
                ))}
            </div>

            <AnimatePresence>
                {currentValue.value === "yes" && question.follow_up_if_yes && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                    >
                        <Label className="text-base">{question.follow_up_if_yes.question}</Label>
                        <textarea
                            value={currentValue.detail || ""}
                            onChange={(e) => onChange({ ...currentValue, detail: e.target.value })}
                            placeholder={question.follow_up_if_yes.placeholder}
                            className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#134E4A] min-h-[120px] resize-none"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Button Choice Cards
function ButtonChoiceCards({ question, value, onChange }: any) {
    return (
        <div className="space-y-4">
            {question.options?.map((option: QuestionOption) => (
                <motion.button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`w-full text-left px-6 py-6 rounded-xl border-2 transition-all ${value === option.value
                        ? "border-[#134E4A] bg-[#134E4A]/5"
                        : "border-gray-200 hover:border-[#134E4A]/30 hover:bg-gray-50"
                        }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold">{option.label}</span>
                                {option.badge && (
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-[#134E4A] text-white rounded-full">
                                        {option.badge}
                                    </span>
                                )}
                            </div>
                            {option.description && (
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                            )}
                        </div>
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${value === option.value ? "border-[#134E4A] bg-[#134E4A]" : "border-gray-300"
                                }`}
                        >
                            {value === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                    </div>
                </motion.button>
            ))}
        </div>
    );
}

// Consent Checkboxes
function ConsentCheckboxes({ question, value, onChange }: any) {
    const consents = value || {};

    const toggleConsent = (consentId: string) => {
        onChange({ ...consents, [consentId]: !consents[consentId] });
    };

    return (
        <div className="space-y-4">
            {question.consents?.map((consent: { id: string; text: string }) => (
                <motion.div
                    key={consent.id}
                    className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggleConsent(consent.id)}
                    whileHover={{ scale: 1.01 }}
                >
                    <Checkbox
                        id={consent.id}
                        checked={consents[consent.id] || false}
                        onCheckedChange={() => toggleConsent(consent.id)}
                        className="mt-0.5"
                    />
                    <Label htmlFor={consent.id} className="text-base cursor-pointer flex-1">
                        {consent.text}
                    </Label>
                </motion.div>
            ))}
        </div>
    );
}

// Rejection Screen
function RejectionScreen({ message }: { message: string }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-background flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg text-center space-y-6 bg-white p-12 rounded-2xl shadow-lg"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto"
                >
                    <X className="w-10 h-10 text-red-600" />
                </motion.div>
                <div className="space-y-3">
                    <h2 className="text-2xl font-serif font-medium">Not Eligible</h2>
                    <p className="text-muted-foreground">{message}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button variant="outline" onClick={() => navigate("/contact")}>
                        Contact Us
                    </Button>
                    <Button onClick={() => navigate("/")}>Back to Homepage</Button>
                </div>
            </motion.div>
        </div>
    );
}
