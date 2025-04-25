import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from 'react-i18next';
import {
  Trophy,
  Users,
  Calendar,
  PlayCircle,
  ChevronRight,
  Check,
} from "lucide-react";

const Index = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black/70 text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center z-10">
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
              <Link to="/register">
                <Button>Cadastrar</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-24 text-center">
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            {t('home.title')}
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 mx-auto text-center">
            {t('home.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="px-8">
                {t('home.startButton')}
                <ChevronRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link to="/tournaments">
              <Button size="lg" variant="outline" className="px-8">
                {t('home.seeTournaments')}
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full">
          {[
            {
              icon: <Trophy className="h-12 w-12" />,
              titleKey: 'features.tournaments.title',
              descKey: 'features.tournaments.description',
            },
            {
              icon: <Users className="h-12 w-12" />,
              titleKey: 'features.findPlayers.title',
              descKey: 'features.findPlayers.description',
            },
            {
              icon: <Calendar className="h-12 w-12" />,
              titleKey: 'features.scheduling.title',
              descKey: 'features.scheduling.description',
            },
            {
              icon: <PlayCircle className="h-12 w-12" />,
              titleKey: 'features.tracking.title',
              descKey: 'features.tracking.description',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center text-center hover:border-zinc-700 transition-colors"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{t(feature.titleKey)}</h3>
              <p className="text-zinc-400 text-sm">{t(feature.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Funcionalidades para Atletas e Organizadores
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              O Harau oferece ferramentas poderosas tanto para jogadores quanto para
              administradores de torneios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-black border border-zinc-800 rounded-xl p-8 h-fit">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Users className="mr-3 text-primary" /> Para Atletas
              </h3>
              <ul className="space-y-4">
                {[
                  "Encontre e inscreva-se em torneios locais",
                  "Conecte-se com outros jogadores próximos",
                  "Agende partidas de treino com outros atletas",
                  "Crie um perfil detalhado com seu estilo de jogo",
                  "Acompanhe seu histórico de partidas e resultados",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black border border-zinc-800 rounded-xl p-8 h-fit">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Trophy className="mr-3 text-primary" /> Para Organizadores
              </h3>
              <ul className="space-y-4">
                {[
                  "Crie torneios eliminatórios ou todos contra todos",
                  "Gere chaves de torneios automaticamente",
                  "Gerencie inscrições e classificação dos participantes",
                  "Crie páginas de divulgação para torneios",
                  "Aceite pagamentos via PIX para inscrições",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para elevar sua experiência no tênis de mesa?
          </h2>
          <p className="text-zinc-400 mb-10 text-lg">
            Junte-se à comunidade Harau hoje e leve seu jogo para o próximo nível.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="px-8">
                Criar uma Conta
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-zinc-900 py-10 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-bold flex items-center">
            <span className="text-white font-light tracking-wide">Harau</span>
            <span className="text-primary text-2xl">.</span>
          </div>
          <div className="text-zinc-400 text-sm">
            &copy; {new Date().getFullYear()} Harau. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
