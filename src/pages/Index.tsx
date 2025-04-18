
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center z-10">
        <div className="text-2xl font-bold text-primary flex items-center gap-2">
          <span className="text-white">Harau</span>
          <span className="text-primary text-sm border-l border-zinc-700 pl-2">
            PING PONG
          </span>
        </div>

        <div className="space-x-4">
          {currentUser ? (
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Table Tennis <span className="text-primary">Made Simple</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10">
          Create and join tournaments, find players nearby, schedule matches, and
          track your progress - all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/register">
            <Button size="lg" className="px-8">
              Get Started
              <ChevronRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link to="/tournaments">
            <Button size="lg" variant="outline" className="px-8">
              Browse Tournaments
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full">
          {[
            {
              icon: <Trophy className="h-12 w-12" />,
              title: "Tournaments",
              desc: "Create or join competitions",
            },
            {
              icon: <Users className="h-12 w-12" />,
              title: "Find Players",
              desc: "Connect with nearby athletes",
            },
            {
              icon: <Calendar className="h-12 w-12" />,
              title: "Scheduling",
              desc: "Organize matches easily",
            },
            {
              icon: <PlayCircle className="h-12 w-12" />,
              title: "Track Progress",
              desc: "Monitor your performance",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center text-center hover:border-zinc-700 transition-colors"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-zinc-900 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Features for Athletes and Organizers
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Harau provides powerful tools for both table tennis players and
              tournament administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Athletes Features */}
            <div className="bg-black border border-zinc-800 rounded-xl p-8 h-fit">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Users className="mr-3 text-primary" /> For Athletes
              </h3>
              <ul className="space-y-4">
                {[
                  "Find and register for local tournaments",
                  "Connect with other table tennis players nearby",
                  "Schedule practice matches with other athletes",
                  "Create a detailed player profile with playing style",
                  "Track your match history and tournament results",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Admins Features */}
            <div className="bg-black border border-zinc-800 rounded-xl p-8 h-fit">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Trophy className="mr-3 text-primary" /> For Organizers
              </h3>
              <ul className="space-y-4">
                {[
                  "Create knockout or round robin tournaments",
                  "Generate tournament brackets automatically",
                  "Manage participant registrations and seeding",
                  "Create landing pages to promote tournaments",
                  "Accept payments via PIX for tournament entries",
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

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to elevate your table tennis experience?
          </h2>
          <p className="text-zinc-400 mb-10 text-lg">
            Join the Harau community today and take your game to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="px-8">
                Create an Account
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 py-10 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-bold text-primary flex items-center gap-2 mb-6 md:mb-0">
            <span className="text-white">Harau</span>
            <span className="text-primary text-sm border-l border-zinc-700 pl-2">
              PING PONG
            </span>
          </div>
          <div className="text-zinc-400 text-sm">
            &copy; {new Date().getFullYear()} Harau Ping Pong. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
