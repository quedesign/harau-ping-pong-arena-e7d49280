
import React, { useState } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface FormValues extends FieldValues {
    password?: string;
    confirmPassword?: string
}

interface PasswordInputProps {
  form: UseFormReturn<FormValues>;
  name: "password" | "confirmPassword";
  label: string;
  autoComplete?: string;
}

export const PasswordInput = ({ form, name, label, autoComplete }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

    const { field } = form.control.getFieldProps(name);

    return (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <div className="relative">
                        <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="bg-zinc-800 border-zinc-700 pr-10"
                            autoComplete={autoComplete}
                        />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
    );
};
