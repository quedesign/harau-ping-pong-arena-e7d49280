
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
    <div className="relative z-10 glass-card py-12 px-8 rounded-xl max-w-3xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
        {t('home.title')}
      </h1>
      <p className="text-lg md:text-xl text-zinc-200 max-w-2xl mb-10 mx-auto text-center">
        {t('home.subtitle')}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="px-8" onClick={onRegister}>
          {t('home.startButton')}
          <ChevronRight size={16} className="ml-2" />
        </Button>
        <Link to="/tournaments">
          <Button size="lg" variant="outline" className="px-8 border-white/20 hover:bg-white/10">
            {t('home.seeTournaments')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
