
import { Trophy, Users, Calendar, PlayCircle } from "lucide-react";
import FeatureCard from "./FeatureCard";

const Features = () => {
  const features = [
    {
      icon: <Trophy className="h-12 w-12" />,
      titleKey: 'features.tournaments.title',
      descKey: 'features.tournaments.description',
    },
    {
      icon: <Users className="h-12 w-12" />,
      titleKey: 'features.findPlayers.title',
      descKey: 'features.findPlayers.description',
    },
    {
      icon: <Calendar className="h-12 w-12" />,
      titleKey: 'features.scheduling.title',
      descKey: 'features.scheduling.description',
    },
    {
      icon: <PlayCircle className="h-12 w-12" />,
      titleKey: 'features.tracking.title',
      descKey: 'features.tracking.description',
    },
  ];

  return (
    <div className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};

export default Features;
