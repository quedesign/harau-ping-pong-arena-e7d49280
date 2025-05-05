
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SideSlider } from './SideSlider';
import LevelFilter from './LevelFilter';
import LocationFilter from './LocationFilter';
import PlayingStyleFilter from './PlayingStyleFilter';
import { Filter } from 'lucide-react';

interface FilterSectionProps {
  filters: Record<string, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  title: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, setFilters, title }) => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const totalFiltersApplied = Object.values(filters).reduce(
    (count, filterValues) => count + filterValues.length,
    0
  );

  const clearAllFilters = () => {
    setFilters({});
  };

  return (
    <section className="mb-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsFilterDrawerOpen(true)}
          className="flex items-center"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
          {totalFiltersApplied > 0 && (
            <span className="ml-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {totalFiltersApplied}
            </span>
          )}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, values]) => 
          values.map(value => (
            <div 
              key={`${key}-${value}`} 
              className="bg-zinc-800 text-zinc-100 px-3 py-1 rounded-full text-sm flex items-center"
            >
              <span>{key === 'playingStyle' ? 'Estilo' : key === 'level' ? 'Nível' : 'Local'}: {value}</span>
              <button 
                className="ml-2 text-zinc-400 hover:text-zinc-100"
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    [key]: prev[key].filter(v => v !== value)
                  }));
                }}
              >
                &times;
              </button>
            </div>
          ))
        )}
        {totalFiltersApplied > 0 && (
          <button 
            className="text-zinc-400 hover:text-zinc-100 text-sm underline"
            onClick={clearAllFilters}
          >
            Limpar todos
          </button>
        )}
      </div>

      <SideSlider 
        title="Filtros de Atletas" 
        isOpen={isFilterDrawerOpen} 
        onClose={() => setIsFilterDrawerOpen(false)}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Nível</h3>
            <LevelFilter filters={filters} setFilters={setFilters} />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Estilo de Jogo</h3>
            <PlayingStyleFilter filters={filters} setFilters={setFilters} />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Localização</h3>
            <LocationFilter filters={filters} setFilters={setFilters} />
          </div>

          <div className="flex justify-between pt-4 border-t border-zinc-800">
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearAllFilters}
            >
              Limpar Filtros
            </Button>
            <Button 
              size="sm"
              onClick={() => setIsFilterDrawerOpen(false)}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </SideSlider>
    </section>
  );
};

export default FilterSection;
