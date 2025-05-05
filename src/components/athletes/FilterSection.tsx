import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SideSlider } from './SideSlider';
import LevelFilter from './LevelFilter';
import LocationFilter from './LocationFilter';
import PlayingStyleFilter from './PlayingStyleFilter';

interface FilterSectionProps {
  filters: Record<string, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  title: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, setFilters, title }) => {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="flex flex-wrap gap-2">
        <LevelFilter filters={filters} setFilters={setFilters} />
        <LocationFilter filters={filters} setFilters={setFilters} />
        <PlayingStyleFilter filters={filters} setFilters={setFilters} />
      </div>
    </section>
  );
};

export default FilterSection;