'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showClearButton?: boolean;
  togglePasswordVisibility?: boolean;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      type,
      value,
      onChange,
      onClear,
      label,
      placeholder,
      helperText,
      errorMessage,
      disabled,
      invalid,
      loading,
      variant = 'outlined',
      size = 'md',
      showClearButton,
      togglePasswordVisibility,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const id = React.useId();

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (onClear) {
        onClear();
      } else if (onChange) {
        const event = {
          target: { value: '' } as EventTarget & { value: string },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };
    
    const inputType = togglePasswordVisibility ? (showPassword ? 'text' : 'password') : type;
    const isInvalid = invalid || !!errorMessage;
    const hasRightIcon = (showClearButton && value) || togglePasswordVisibility;

    return (
      <div className={cn('w-full space-y-1.5', className)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative flex w-full items-center">
          {loading && (
            <div className="pointer-events-none absolute left-3 z-10">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          <Input
            id={id}
            type={inputType}
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled || loading}
            aria-invalid={isInvalid}
            className={cn(
              {
                'h-8 px-2 text-xs': size === 'sm',
                'h-10 text-sm': size === 'md',
                'h-12 px-4 text-base md:text-base': size === 'lg',
              },
              {
                'border-transparent bg-muted focus:bg-background': variant === 'filled',
                'bg-background': variant === 'outlined',
                'border-transparent bg-transparent hover:border-input': variant === 'ghost',
              },
              isInvalid && 'border-destructive text-destructive placeholder:text-destructive/70 focus-visible:ring-destructive',
              loading && 'pl-9',
              hasRightIcon && 'pr-9',
            )}
            {...props}
          />
          {hasRightIcon && (
            <div className="absolute right-3 z-10 flex items-center gap-2">
              {showClearButton && value && !disabled && !loading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear input"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {togglePasswordVisibility && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={disabled || loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        {errorMessage && isInvalid ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : helperText ? (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
InputField.displayName = 'InputField';

export { InputField };
