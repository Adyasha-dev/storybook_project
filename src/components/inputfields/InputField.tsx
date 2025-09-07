"use client";
import React, { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";

export interface InputFieldProps {
  value?: string;
  onChange: (value: string) => void; // simplified
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  type?: "text" | "password";
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
  variant?: "filled" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg";
}

const InputField: React.FC<InputFieldProps> = ({
  value = "",
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  loading = false,
  type = "text",
  showClearButton = false,
  showPasswordToggle = false,
  variant = "ghost",
  size = "md",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "h-8 px-2 text-sm",
    md: "h-10 px-3 text-base",
    lg: "h-12 px-4 text-lg",
  };

  const variantClasses: Record<"filled" | "outlined" | "ghost", string> = {
    filled:
      "bg-gray-100 border border-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    outlined:
      "bg-white border border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    ghost:
      "bg-transparent border-b border-gray-400 rounded-none focus:border-blue-500 focus:ring-0",
  };

  const handleClear = () => {
    onChange(""); // ✅ directly update parent state
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          type={showPasswordToggle && showPassword ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)} // ✅ simplified
          placeholder={placeholder}
          disabled={disabled || loading}
          className={`
            w-full rounded-md focus:outline-none
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${disabled ? "bg-gray-200 cursor-not-allowed" : ""}
            ${
              invalid
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : ""
            }
          `}
        />

        {/* Clear Button */}
        {showClearButton && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}

        {/* Password Toggle */}
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {loading && <span className="text-xs text-gray-500">Loading...</span>}
      {invalid && errorMessage && (
        <span className="text-xs text-red-500">{errorMessage}</span>
      )}
      {helperText && !invalid && (
        <span className="text-xs text-gray-500">{helperText}</span>
      )}
    </div>
  );
};

export default InputField;
