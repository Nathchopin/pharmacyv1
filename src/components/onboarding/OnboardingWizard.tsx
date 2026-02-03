import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  Activity,
  Scale,
  Ruler,
  Calendar,
  Heart,
  Moon,
  Cigarette,
  Wine,
  Brain,
  Loader2,
  Sparkles,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const activityLevels = [
  { value: "sedentary", label: "Sedentary", description: "Little or no exercise", icon: "🪑" },
  { value: "light", label: "Lightly Active", description: "Light exercise 1-3 days/week", icon: "🚶" },
  { value: "moderate", label: "Moderately Active", description: "Moderate exercise 3-5 days/week", icon: "🏃" },
  { value: "active", label: "Very Active", description: "Hard exercise 6-7 days/week", icon: "💪" },
  { value: "athlete", label: "Athlete", description: "Professional athlete level", icon: "🏆" },
];

const sleepQualityOptions = [
  { value: "poor", label: "Poor", description: "Often wake up tired", icon: "😴" },
  { value: "fair", label: "Fair", description: "Sometimes restless", icon: "😐" },
  { value: "good", label: "Good", description: "Usually sleep well", icon: "😊" },
  { value: "excellent", label: "Excellent", description: "Always feel refreshed", icon: "🌟" },
];

const stressLevelOptions = [
  { value: "low", label: "Low", description: "Rarely feel stressed", icon: "😌" },
  { value: "moderate", label: "Moderate", description: "Occasional stress", icon: "😅" },
  { value: "high", label: "High", description: "Frequently stressed", icon: "😰" },
  { value: "very_high", label: "Very High", description: "Constantly stressed", icon: "🤯" },
];

const smokingOptions = [
  { value: "never", label: "Never", icon: "✅" },
  { value: "former", label: "Former Smoker", icon: "🚭" },
  { value: "occasional", label: "Occasional", icon: "🚬" },
  { value: "regular", label: "Regular", icon: "📦" },
];

const alcoholOptions = [
  { value: "never", label: "Never", icon: "🚫" },
  { value: "rarely", label: "Rarely", description: "Few times a year", icon: "🍷" },
  { value: "moderate", label: "Moderate", description: "1-2 drinks/week", icon: "🍺" },
  { value: "regular", label: "Regular", description: "3+ drinks/week", icon: "🥃" },
];

export interface OnboardingData {
  date_of_birth: string;
  height_cm: string;
  current_weight_kg: string;
  target_weight_kg: string;
  activity_level: string;
  sleep_quality: string;
  stress_level: string;
  smoking_status: string;
  alcohol_consumption: string;
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  loading: boolean;
}

const steps = [
  { id: 1, title: "Basic Info", icon: Calendar, description: "Let's start with your basics" },
  { id: 2, title: "Body Metrics", icon: Scale, description: "Your physical measurements" },
  { id: 3, title: "Activity Level", icon: Activity, description: "How active are you?" },
  { id: 4, title: "Lifestyle", icon: Heart, description: "Your daily habits" },
  { id: 5, title: "Review", icon: Sparkles, description: "Almost there!" },
];

export function OnboardingWizard({ onComplete, loading }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    date_of_birth: "",
    height_cm: "",
    current_weight_kg: "",
    target_weight_kg: "",
    activity_level: "",
    sleep_quality: "",
    stress_level: "",
    smoking_status: "",
    alcohol_consumption: "",
  });

  const progress = (currentStep / steps.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.date_of_birth;
      case 2:
        return !!formData.height_cm && !!formData.current_weight_kg && !!formData.target_weight_kg;
      case 3:
        return !!formData.activity_level;
      case 4:
        return !!formData.sleep_quality && !!formData.stress_level && !!formData.smoking_status && !!formData.alcohol_consumption;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const OptionCard = ({
    selected,
    onClick,
    icon,
    label,
    description,
  }: {
    selected: boolean;
    onClick: () => void;
    icon: string;
    label: string;
    description?: string;
  }) => (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-2xl border-2 text-left transition-all w-full",
        selected
          ? "border-eucalyptus bg-eucalyptus-muted"
          : "border-border hover:border-eucalyptus/50 bg-white"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 bg-eucalyptus rounded-full flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}
      <span className="text-2xl mb-2 block">{icon}</span>
      <p className="font-medium text-foreground">{label}</p>
      {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
    </motion.button>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <motion.div
                className="w-16 h-16 bg-eucalyptus-muted rounded-2xl flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
              >
                <Calendar className="w-8 h-8 text-eucalyptus" />
              </motion.div>
              <h2 className="text-xl font-serif font-medium text-foreground">When were you born?</h2>
              <p className="text-muted-foreground text-sm mt-1">
                This helps us personalize your health recommendations
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <Label htmlFor="dob" className="sr-only">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="h-14 rounded-2xl text-center text-lg"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <motion.div
                className="w-16 h-16 bg-eucalyptus-muted rounded-2xl flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <Scale className="w-8 h-8 text-eucalyptus" />
              </motion.div>
              <h2 className="text-xl font-serif font-medium text-foreground">Your Body Metrics</h2>
              <p className="text-muted-foreground text-sm mt-1">
                We'll use this to calculate your BMI and health score
              </p>
            </div>

            <div className="grid gap-4 max-w-sm mx-auto">
              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center gap-2 text-sm">
                  <Ruler className="w-4 h-4 text-eucalyptus" />
                  Height
                </Label>
                <div className="relative">
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={formData.height_cm}
                    onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                    className="h-12 rounded-xl pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">cm</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center gap-2 text-sm">
                    <Scale className="w-4 h-4 text-eucalyptus" />
                    Current Weight
                  </Label>
                  <div className="relative">
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="85"
                      value={formData.current_weight_kg}
                      onChange={(e) => setFormData({ ...formData, current_weight_kg: e.target.value })}
                      className="h-12 rounded-xl pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">kg</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target" className="flex items-center gap-2 text-sm">
                    🎯 Goal Weight
                  </Label>
                  <div className="relative">
                    <Input
                      id="target"
                      type="number"
                      step="0.1"
                      placeholder="75"
                      value={formData.target_weight_kg}
                      onChange={(e) => setFormData({ ...formData, target_weight_kg: e.target.value })}
                      className="h-12 rounded-xl pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <motion.div
                className="w-16 h-16 bg-eucalyptus-muted rounded-2xl flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <Activity className="w-8 h-8 text-eucalyptus" />
              </motion.div>
              <h2 className="text-xl font-serif font-medium text-foreground">How active are you?</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Select the option that best describes your typical week
              </p>
            </div>

            <div className="grid gap-3 max-w-md mx-auto">
              {activityLevels.map((level) => (
                <OptionCard
                  key={level.value}
                  selected={formData.activity_level === level.value}
                  onClick={() => setFormData({ ...formData, activity_level: level.value })}
                  icon={level.icon}
                  label={level.label}
                  description={level.description}
                />
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <motion.div
                className="w-16 h-16 bg-eucalyptus-muted rounded-2xl flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <Heart className="w-8 h-8 text-eucalyptus" />
              </motion.div>
              <h2 className="text-xl font-serif font-medium text-foreground">Lifestyle Factors</h2>
              <p className="text-muted-foreground text-sm mt-1">
                These factors significantly impact your overall health
              </p>
            </div>

            {/* Sleep Quality */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Moon className="w-4 h-4 text-eucalyptus" />
                How would you rate your sleep quality?
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {sleepQualityOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={formData.sleep_quality === option.value}
                    onClick={() => setFormData({ ...formData, sleep_quality: option.value })}
                    icon={option.icon}
                    label={option.label}
                    description={option.description}
                  />
                ))}
              </div>
            </div>

            {/* Stress Level */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Brain className="w-4 h-4 text-eucalyptus" />
                What's your typical stress level?
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {stressLevelOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={formData.stress_level === option.value}
                    onClick={() => setFormData({ ...formData, stress_level: option.value })}
                    icon={option.icon}
                    label={option.label}
                    description={option.description}
                  />
                ))}
              </div>
            </div>

            {/* Smoking */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Cigarette className="w-4 h-4 text-eucalyptus" />
                Smoking status
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {smokingOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={formData.smoking_status === option.value}
                    onClick={() => setFormData({ ...formData, smoking_status: option.value })}
                    icon={option.icon}
                    label={option.label}
                  />
                ))}
              </div>
            </div>

            {/* Alcohol */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Wine className="w-4 h-4 text-eucalyptus" />
                Alcohol consumption
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {alcoholOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={formData.alcohol_consumption === option.value}
                    onClick={() => setFormData({ ...formData, alcohol_consumption: option.value })}
                    icon={option.icon}
                    label={option.label}
                    description={option.description}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-eucalyptus to-eucalyptus-dark rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-serif font-medium text-foreground">You're all set!</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Here's a summary of your health profile
              </p>
            </div>

            <div className="bg-eucalyptus-muted/50 rounded-2xl p-6 max-w-md mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{formData.date_of_birth || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Height</p>
                  <p className="font-medium">{formData.height_cm ? `${formData.height_cm} cm` : "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current Weight</p>
                  <p className="font-medium">{formData.current_weight_kg ? `${formData.current_weight_kg} kg` : "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Target Weight</p>
                  <p className="font-medium">{formData.target_weight_kg ? `${formData.target_weight_kg} kg` : "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Activity Level</p>
                  <p className="font-medium capitalize">{formData.activity_level?.replace("_", " ") || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sleep Quality</p>
                  <p className="font-medium capitalize">{formData.sleep_quality || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stress Level</p>
                  <p className="font-medium capitalize">{formData.stress_level?.replace("_", " ") || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Smoking</p>
                  <p className="font-medium capitalize">{formData.smoking_status || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </p>
          <p className="text-sm font-medium text-eucalyptus">
            {Math.round(progress)}% complete
          </p>
        </div>
        <Progress value={progress} className="h-2" />

        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    isActive
                      ? "bg-eucalyptus text-white"
                      : isCompleted
                      ? "bg-eucalyptus-muted text-eucalyptus"
                      : "bg-muted text-muted-foreground"
                  )}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </motion.div>
                <p className="text-[10px] text-muted-foreground mt-1 hidden sm:block">{step.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait" custom={currentStep}>
          <motion.div
            key={currentStep}
            custom={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 h-14 rounded-xl text-base"
            disabled={loading}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          className={cn(
            "h-14 rounded-xl bg-eucalyptus hover:bg-eucalyptus-dark text-white font-medium text-base transition-all",
            currentStep === 1 ? "flex-1" : "flex-[2]"
          )}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : currentStep === steps.length ? (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Start My Journey
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
