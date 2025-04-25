import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirecionar para o dashboard se já estiver autenticado
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <Layout>
      <section className="py-24 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                  {t("index.title")}
                </h1>
                <p className="max-w-[600px] text-zinc-400 md:text-xl lg:text-base xl:text-xl">
                  {t("index.description")}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/tournaments">
                  <Button size="lg" className="px-8">
                    {t("index.exploreTournaments")}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 border-zinc-800"
                  >
                    {t("index.createAccount")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("index.feature1Title")}</h3>
                    <p className="text-sm text-zinc-400">
                      {t("index.feature1Description")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("index.feature2Title")}</h3>
                    <p className="text-sm text-zinc-400">
                      {t("index.feature2Description")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("index.feature3Title")}</h3>
                    <p className="text-sm text-zinc-400">
                      {t("index.feature3Description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
