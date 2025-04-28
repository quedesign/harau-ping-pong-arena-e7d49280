
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = () => {
    console.log("Redirecionando para a página de registro");
    navigate('/register');
  };

  return (
    <nav className="w-full p-6 flex justify-between items-center z-10 border-b-[1px] border-b-[#4A4A48]">
      <div className="text-2xl font-bold flex items-center">
        <span className="text-white font-light tracking-wide">Harau</span>
        <span className="text-primary text-2xl">.</span>
      </div>

      <div className="space-x-4">
        {currentUser ? (
          <Link to="/dashboard">
            <Button>Ir para Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Button onClick={handleRegister}>Cadastrar</Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

