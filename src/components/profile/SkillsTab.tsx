
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface Skills {
  handedness: string;
  level: string;
  yearsPlaying: string;
  playingStyle: string;
}

interface SkillsTabProps {
  initialSkills: Skills;
  onUpdate: (skills: Skills) => void;
}

const SkillsTab = ({ initialSkills, onUpdate }: SkillsTabProps) => {
  const [skills, setSkills] = useState(initialSkills);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(skills);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.tableTennisSkills')}</CardTitle>
        <CardDescription>
          {t('profile.updateSkills')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="handedness">{t('profile.handedness')}</Label>
            <select
              id="handedness"
              className="w-full p-2 border rounded-md"
              value={skills.handedness}
              onChange={(e) => setSkills({ ...skills, handedness: e.target.value })}
            >
              <option value="right">{t('profile.rightHanded')}</option>
              <option value="left">{t('profile.leftHanded')}</option>
              <option value="ambidextrous">{t('profile.ambidextrous')}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">{t('profile.level')}</Label>
            <select
              id="level"
              className="w-full p-2 border rounded-md"
              value={skills.level}
              onChange={(e) => setSkills({ ...skills, level: e.target.value })}
            >
              <option value="beginner">{t('profile.beginner')}</option>
              <option value="intermediate">{t('profile.intermediate')}</option>
              <option value="advanced">{t('profile.advanced')}</option>
              <option value="professional">{t('profile.professional')}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearsPlaying">{t('profile.yearsPlaying')}</Label>
            <Input
              id="yearsPlaying"
              type="number"
              value={skills.yearsPlaying}
              onChange={(e) => setSkills({ ...skills, yearsPlaying: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="playingStyle">{t('profile.playingStyle')}</Label>
            <Input
              id="playingStyle"
              value={skills.playingStyle}
              onChange={(e) => setSkills({ ...skills, playingStyle: e.target.value })}
              placeholder={t('profile.playingStylePlaceholder')}
            />
          </div>
          <Button type="submit">{t('common.saveChanges')}</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SkillsTab;
