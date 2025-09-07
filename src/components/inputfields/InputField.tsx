"use client";
import React, { useState } from "react";
import type { InputFieldProps } from "../inputfields/InputField.types";
import { Eye, EyeOff, X } from "lucide-react";

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
  const [inputValue, setInputValue] = useState(value);
  const [showPassword, setShowPassword] = useState(false);

  // Size classes
  const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "h-8 px-2 text-sm",
    md: "h-10 px-3 text-base",
    lg: "h-12 px-4 text-lg",
  };

  // Variant classes
  const variantClasses: Record<"filled" | "outlined" | "ghost", string> = {
    filled:
      "bg-gray-100 border border-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500", // light background
    outlined:
      "bg-white border border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500", // clear white, solid border
    ghost:
      "bg-transparent border-b border-gray-400 rounded-none focus:border-blue-500 focus:ring-0", // only bottom border
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.(e); // still notify parent if provided
  };

  const handleClear = () => {
    setInputValue("");
    // also notify parent that value is cleared
    onChange?.({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
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
          value={inputValue}
          onChange={handleChange}
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
        {showClearButton && inputValue && (
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

      {/* Loading / Error / Helper text */}
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
