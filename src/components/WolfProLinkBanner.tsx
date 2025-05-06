
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
      className="border-0 overflow-hidden mb-6 relative bg-zinc-900"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-[#FFCC29]"></div>
      <CardContent className={`p-6 ${variant === 'compact' ? 'flex items-center justify-between' : ''}`}>
        <div className={`${variant === 'compact' ? 'flex items-center' : ''}`}>
          <div className="flex-shrink-0 mr-4">
            <img 
              src="/lovable-uploads/acce8798-a4e9-4afd-8320-ae29a5b235b1.png" 
              alt="Wolf Pro Link" 
              className="h-10 w-10"
            />
          </div>
          <div>
            <h3 className="font-bold text-xl text-white mb-1">
              FAÇA UMA <span className="text-[#FFCC29]">AVALIAÇÃO DE PERFORMANCE</span>
            </h3>
            <p className="text-zinc-300 text-sm">
              Conheça a Wolf Pro Link e potencialize seus resultados.
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
