import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
  isPassword?: boolean;
}

export function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  showToggle = false,
  isPassword = false,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <Input
        id={id}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          h-14 pt-5 pb-2 px-4 text-base rounded-xl
          border-2 transition-all duration-300
          ${isFocused ? "border-eucalyptus ring-2 ring-eucalyptus/20" : "border-border"}
          bg-white
        `}
      />
      <Label
        htmlFor={id}
        className={`
          absolute left-4 transition-all duration-300 pointer-events-none
          ${isFocused || hasValue 
            ? "top-2 text-xs text-eucalyptus font-medium" 
            : "top-1/2 -translate-y-1/2 text-muted-foreground"
          }
        `}
      >
        {label}
      </Label>
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}
