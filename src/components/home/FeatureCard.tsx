
import { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FeatureCardProps {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
}

const FeatureCard = ({ icon, titleKey, descKey }: FeatureCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center text-center hover:border-zinc-700 transition-colors">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{t(titleKey)}</h3>
      <p className="text-zinc-400 text-sm">{t(descKey)}</p>
    </div>
  );
};

export default FeatureCard;
