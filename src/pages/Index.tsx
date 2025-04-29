
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Trophy, Users, Calendar, Play } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    console.log("Redirecionando para a página de registro");
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="hero-section relative flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-24 text-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/27b3e030-b272-4aec-a108-f21006fa60b1.png" 
            alt="Table Tennis Player" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <Hero onRegister={handleRegister} />
      </section>

      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#1A1A1A] rounded-xl p-8 h-fit text-center flex flex-col items-center">
              <div className="mb-4 rounded-full bg-transparent w-16 h-16 flex items-center justify-center">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Torneios</h3>
              <p className="text-zinc-400 text-sm">
                Crie ou participe de competições
              </p>
            </div>

            <div className="bg-[#1A1A1A] rounded-xl p-8 h-fit text-center flex flex-col items-center">
              <div className="mb-4 rounded-full bg-transparent w-16 h-16 flex items-center justify-center">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Encontre Jogadores</h3>
              <p className="text-zinc-400 text-sm">
                Conecte-se com atletas próximos
              </p>
            </div>

            <div className="bg-[#1A1A1A] rounded-xl p-8 h-fit text-center flex flex-col items-center">
              <div className="mb-4 rounded-full bg-transparent w-16 h-16 flex items-center justify-center">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Agendamento</h3>
              <p className="text-zinc-400 text-sm">
                Organize partidas facilmente
              </p>
            </div>

            <div className="bg-[#1A1A1A] rounded-xl p-8 h-fit text-center flex flex-col items-center">
              <div className="mb-4 rounded-full bg-transparent w-16 h-16 flex items-center justify-center">
                <Play className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Acompanhamento</h3>
              <p className="text-zinc-400 text-sm">
                Monitore seu desempenho
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className=" py-20 px-6">
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
            <div className=" border border-zinc-800 rounded-xl p-8 h-fit">
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

            <div className=" border border-zinc-800 rounded-xl p-8 h-fit">
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
            <Button size="lg" className="px-8" onClick={handleRegister}>
              Criar uma Conta
            </Button>
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
