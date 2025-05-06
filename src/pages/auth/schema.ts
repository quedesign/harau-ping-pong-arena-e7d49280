
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  confirmPassword: z.string(),
  role: z.enum(['athlete', 'admin'], { required_error: 'Selecione um perfil' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
