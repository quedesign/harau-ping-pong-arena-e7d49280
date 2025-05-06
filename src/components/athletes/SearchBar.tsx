
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
    setSearchTerm: (term: string) => void;
    label: string;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm, label, placeholder = 'Nome, cidade ou país...' }) => {
    const [searchTerm, setSearchTermInternal] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = event.target.value;
        setSearchTermInternal(newSearchTerm);
        setSearchTerm(newSearchTerm);
    };

    return (
        <div className='relative w-full'>
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
    );
};

export default SearchBar;
