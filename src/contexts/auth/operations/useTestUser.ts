
import { useState } from "react";
import { UserRole } from "@/types";
import { UseLogin } from "../types";

export const useTestUser = (register: (...args: any[]) => Promise<boolean>, login: UseLogin) => {
  const [isLoading, setIsLoading] = useState(false);

  const createTestUser = async () => {
    setIsLoading(true);
    try {
      const testUser = {
        name: 'Usuário de Teste',
        email: 'teste@exemplo.com',
        password: '123456',
        role: 'athlete' as UserRole,
      };

      const success = await register(testUser.name, testUser.email, testUser.password, testUser.role);

      if (!success) {
        return await login(testUser.email, testUser.password);
      }

      return true;
    } catch (err) {
      console.error('Erro ao criar usuário de teste:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createTestUser, isLoading };
};
