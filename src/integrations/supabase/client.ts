
import { createClient } from '@supabase/supabase-js';

// Usar constantes em vez de import.meta para evitar problemas de compatibilidade
const supabaseUrl = 'https://nrgjaofrozgccdiebqwv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZ2phb2Zyb3pnY2NkaWVicXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MTk3NDAsImV4cCI6MjAzMTA5NTc0MH0.ILbON9eUn0owyFm577Xl19DcB22t8OuzpChBN7HMzFM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função auxiliar para verificar a conexão
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('athletes').select('id').limit(1);
    
    if (error) {
      console.error("Erro ao conectar com Supabase:", error);
      return false;
    }
    
    console.log("Conexão com Supabase estabelecida com sucesso!");
    return true;
  } catch (err) {
    console.error("Erro ao verificar conexão com Supabase:", err);
    return false;
  }
};
