
import { useState } from "react";
import { AthleteProfile } from "@/types";
import AthleteCard from "@/components/athletes/AthleteCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AthleteResultsProps {
  filteredAthletes: AthleteProfile[];
  noResults: boolean;
  searchTerm: string;
  filtersApplied: boolean;
  setActiveTab: (value: string) => void;
}

const AthleteResults: React.FC<AthleteResultsProps> = ({
  filteredAthletes,
  noResults,
  searchTerm,
  filtersApplied,
  setActiveTab,
}) => {
  return (
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
              {searchTerm || filtersApplied
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
  );
};

export default AthleteResults;
