
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface WolfProLinkBannerProps {
  variant?: 'default' | 'compact';
}

const WolfProLinkBanner: React.FC<WolfProLinkBannerProps> = ({ variant = 'default' }) => {
  const handleVisit = () => {
    window.open('https://www.wolfprolink.com.br/#/home', '_blank');
  };

  return (
    <Card 
      className="bg-[#141412] border-[#FFCC29] overflow-hidden mb-6 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(20, 20, 18, 0.85), rgba(20, 20, 18, 0.85)), url('https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1100&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <CardContent className={`p-6 ${variant === 'compact' ? 'flex items-center justify-between' : ''}`}>
        <div className={variant === 'compact' ? 'mr-4' : 'mb-3'}>
          <h3 className="font-bold text-white">Melhore sua Performance</h3>
          <p className="text-zinc-300 text-sm">
            Conheça a Wolf Pro Link e potencialize seus resultados como atleta profissional
          </p>
        </div>
        <Button 
          onClick={handleVisit}
          className="bg-[#FFCC29] hover:bg-[#FFCC29]/90 text-black"
        >
          Visitar Site
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default WolfProLinkBanner;
