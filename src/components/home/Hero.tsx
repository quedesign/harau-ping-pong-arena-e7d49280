
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface HeroProps {
  onRegister: () => void;
}

const Hero = ({ onRegister }: HeroProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative z-10 max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
        Desafie-se, divirta-se e encontre seu ritmo!
      </h1>
      <p className="text-lg md:text-xl text-zinc-200 max-w-3xl mb-10 mx-auto text-center">
        Você poderá encontrar facilmente competições e outros jogadores
        amadores em sua proximidade para jogar partidas divertidas e competitivas.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="px-8 rounded-full" onClick={onRegister}>
          Começar
          <ChevronRight size={16} className="ml-2" />
        </Button>
        <Link to="/tournaments">
          <Button size="lg" variant="outline" className="px-8 rounded-full border-white/20 bg-transparent hover:bg-white/10">
            Ver Torneios
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
