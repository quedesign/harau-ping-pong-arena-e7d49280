
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { useAthlete } from "@/contexts/data/athlete";
import { AthleteProfile, User } from "@/types";
import SearchBar from "@/components/athletes/SearchBar";
import FilterSection from "@/components/athletes/FilterSection";
import { FloatingSupportButton } from "@/components/FloatingSupportButton";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageCircle, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AthleteSearch = () => {
  const { t } = useTranslation();
  const { athleteProfiles, loading } = useAthlete();
  const [noResults, setNoResults] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredAthletes = useMemo(() => {
    if (!athleteProfiles) return [];
    
    // Apply filters
    let athletesToFilter = athleteProfiles;
    
    if (Object.keys(filters).length > 0) {
      athletesToFilter = athleteProfiles.filter((athlete) => {
        return Object.keys(filters).every((filterKey) => {
          if (!filters[filterKey].length) {
            return true; // No filter selected for this key
          }
          
          if (filterKey === "level") {
            return filters[filterKey].includes(athlete.level || "");
          }
          
          if (filterKey === "playingStyle") {
            return filters[filterKey].includes(athlete.playingStyle || "");
          }
          
          if (filterKey === "location") {
            return filters[filterKey].some(location => 
              athlete.location?.city?.includes(location) || 
              athlete.location?.country?.includes(location)
            );
          }
          
          return true;
        });
      });
    }

    // Apply search term
    if (searchTerm) {
      athletesToFilter = athletesToFilter.filter((athlete) => {
        const userDetails = athlete as unknown as User;
        return (userDetails?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
               (athlete.location?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
               (athlete.location?.country || "").toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Apply tab filtering if needed
    if (activeTab !== "all") {
      // Here you can add logic to filter by tab if necessary
    }

    return athletesToFilter;
  }, [athleteProfiles, filters, searchTerm, activeTab]);

  useEffect(() => {
    setNoResults(filteredAthletes.length === 0);
  }, [filteredAthletes]);

  const recentAthletes = useMemo(() => {
    if (!athleteProfiles) return [];
    return [...athleteProfiles].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }).slice(0, 6);
  }, [athleteProfiles]);

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Encontre um atleta</h1>
          <p className="text-zinc-400">Descubra e conecte-se com outros atletas de tênis de mesa</p>
        </div>

        {/* Recent Athletes Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Atletas Recentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentAthletes.map((athlete) => (
              <AthleteCard key={athlete.userId} athlete={athlete} />
            ))}
          </div>
        </section>

        {/* Search and Filter Section */}
        <div className="mb-6">
          <SearchBar setSearchTerm={setSearchTerm} label="Buscar atletas" />
          <FilterSection title="Filtros" filters={filters} setFilters={setFilters} />
        </div>

        {/* Tabs for different athlete categories */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="bg-zinc-900 border-zinc-800">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="recommended">Recomendados</TabsTrigger>
            <TabsTrigger value="nearby">Próximos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {noResults ? (
              <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="mx-auto h-12 w-12 text-zinc-600 mb-4">🏓</div>
                <h3 className="text-xl font-medium mb-2">Nenhum atleta encontrado</h3>
                <p className="text-zinc-400 mb-6">
                  {searchTerm || Object.keys(filters).length > 0
                    ? "Nenhum atleta corresponde aos critérios de busca"
                    : "Não há atletas cadastrados no momento"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAthletes.map((athlete) => (
                  <AthleteCard key={athlete.userId} athlete={athlete} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recommended" className="mt-4">
            <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="mx-auto h-12 w-12 text-zinc-600 mb-4">⭐</div>
              <h3 className="text-xl font-medium mb-2">Recomendações em breve</h3>
              <p className="text-zinc-400 mb-6">
                Estamos trabalhando para trazer recomendações personalizadas para você
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="nearby" className="mt-4">
            <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="mx-auto h-12 w-12 text-zinc-600 mb-4">📍</div>
              <h3 className="text-xl font-medium mb-2">Atletas próximos</h3>
              <p className="text-zinc-400 mb-6">
                Em breve você poderá encontrar atletas próximos à sua localização
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <FloatingSupportButton />
    </Layout>
  );
};

interface AthleteCardProps {
  athlete: AthleteProfile;
}

const AthleteCard: React.FC<AthleteCardProps> = ({ athlete }) => {
  const handleSendMessage = () => {
    // Implement message functionality
    console.log("Send message to", athlete.userId);
  };

  const handleFollow = () => {
    // Implement follow functionality
    console.log("Follow athlete", athlete.userId);
  };

  const handleViewProfile = () => {
    // Implement view profile navigation
    window.location.href = `/athletes/${athlete.userId}`;
  };

  // Use the User type data if available
  const userDetails = athlete as unknown as User & AthleteProfile;
  const name = userDetails?.name || `Atleta ${athlete.userId}`;

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl truncate">{name}</CardTitle>
          {athlete.level && (
            <Badge className="bg-blue-500/20 text-blue-400">
              {athlete.level}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {athlete.bio || "Sem biografia disponível"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          {athlete.location && (
            <div className="text-zinc-400 text-sm">
              {athlete.location.city}, {athlete.location.country}
            </div>
          )}
          {athlete.playingStyle && (
            <div className="text-zinc-400 text-sm capitalize">
              Estilo: {athlete.playingStyle}
            </div>
          )}
          <div className="text-zinc-400 text-sm">
            {athlete.wins || 0} vitórias / {athlete.losses || 0} derrotas
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" size="sm" onClick={handleFollow}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Seguir
          </Button>
          <Button variant="outline" size="sm" onClick={handleSendMessage}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Mensagem
          </Button>
          <Button size="sm" onClick={handleViewProfile}>
            <Eye className="h-4 w-4 mr-2" />
            Perfil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AthleteSearch;
