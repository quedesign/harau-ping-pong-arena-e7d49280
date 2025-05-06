
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
    setSearchTerm: (term: string) => void;
    label: string;
    placeholder?: string;
    onFilterClick?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
    setSearchTerm, 
    label, 
    placeholder = 'Nome, cidade ou país...', 
    onFilterClick 
}) => {
    const [searchTerm, setSearchTermInternal] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = event.target.value;
        setSearchTermInternal(newSearchTerm);
        setSearchTerm(newSearchTerm);
    };

    return (
        <div className='flex w-full gap-2'>
            <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400' size={18} />
                <Input
                    type="text"
                    id="search"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="pl-10 bg-zinc-900 border-zinc-800 w-full"
                />
            </div>
            {onFilterClick && (
                <Button variant="outline" onClick={onFilterClick} className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                </Button>
            )}
        </div>
    );
};

export default SearchBar;
