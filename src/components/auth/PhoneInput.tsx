import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function PhoneInput({ id, label, value, onChange }: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-digit characters except spaces
    const cleaned = e.target.value.replace(/[^\d\s]/g, "");
    // Limit to reasonable phone length
    if (cleaned.length <= 15) {
      onChange(cleaned);
    }
  };

  return (
    <div className="relative">
      <div className="flex">
        <div
          className={`
            flex items-center justify-center px-4 h-14 rounded-l-xl
            border-2 border-r-0 bg-muted/50 text-muted-foreground font-medium
            transition-all duration-300
            ${isFocused ? "border-eucalyptus" : "border-border"}
          `}
        >
          +44
        </div>
        <div className="relative flex-1">
          <Input
            id={id}
            type="tel"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=""
            className={`
              h-14 pt-5 pb-2 px-4 text-base rounded-l-none rounded-r-xl
              border-2 transition-all duration-300
              ${isFocused ? "border-eucalyptus ring-2 ring-eucalyptus/20" : "border-border"}
              bg-white
            `}
          />
          <Label
            htmlFor={id}
            className={`
              absolute left-4 transition-all duration-300 pointer-events-none
              ${
                isFocused || hasValue
                  ? "top-2 text-xs text-eucalyptus font-medium"
                  : "top-1/2 -translate-y-1/2 text-muted-foreground"
              }
            `}
          >
            {label}
          </Label>
        </div>
      </div>
    </div>
  );
}
