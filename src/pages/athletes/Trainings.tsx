typescript
import React, { useState } from "react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Trainings = () => {
  const { t } = useTranslation();
  const [trainingInput, setTrainingInput] = useState('');
  const [geminiResponse, setGeminiResponse] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrainingInput(event.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
        const newResponse = await simulateGeminiCall(trainingInput);
        setGeminiResponse((prevResponses) => [...prevResponses, ...newResponse]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateGeminiCall = async (input: string): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          `Resposta para: "${input}" - Treino 1`, // Fixed: No leading whitespace
          `Resposta para: "${input}" - Treino 2`, // Fixed: No leading whitespace
        ]);
      }, 1000);
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{t('trainings.title', 'Trainings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              type="text" // Corrected: `text` is the proper type
              placeholder={t(
                "trainings.inputPlaceholder",
                "Enter your training request"
              )}
              value={trainingInput}
              onChange={handleInputChange}
            />
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading
                ? t("common.loading", "Loading...")
                : t("trainings.generateButton", "Generate")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator className="mb-4" />

      <Card>
        <CardHeader>
          <CardTitle>{t("trainings.responsesTitle", "Responses")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {geminiResponse.map((response, index) => (
            <div key={index}>
              <Textarea
                value={response}
                className="resize-none"
                readOnly
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Trainings;

