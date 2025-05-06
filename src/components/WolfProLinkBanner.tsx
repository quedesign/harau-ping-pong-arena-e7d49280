
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
      className="border-0 overflow-hidden mb-6 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url('https://images.unsplash.com/photo-1610987039121-d70917dcc6f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1100&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-[#FFCC29]"></div>
      <CardContent className={`p-6 ${variant === 'compact' ? 'flex items-center justify-between' : ''}`}>
        <div className={`${variant === 'compact' ? 'flex items-center' : ''}`}>
          <div className="flex-shrink-0 mr-4">
            <div className="bg-[#FFCC29] rounded-full p-3 flex items-center justify-center h-12 w-12">
              <span className="text-black font-bold text-xl">W</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl text-white mb-1">
              NÃO PERCA <span className="text-[#FFCC29]">OPORTUNIDADES</span>
            </h3>
            <p className="text-zinc-300 text-sm">
              Conheça a Wolf Pro Link e potencialize seus resultados como atleta profissional
            </p>
          </div>
        </div>
        <Button 
          onClick={handleVisit}
          className="bg-[#FFCC29] hover:bg-[#FFCC29]/90 text-black font-bold mt-4 px-6 py-2"
          style={{ 
            minWidth: variant === 'compact' ? 'auto' : '200px',
            marginTop: variant === 'compact' ? '0' : '16px'
          }}
        >
          Visitar Site
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default WolfProLinkBanner;
