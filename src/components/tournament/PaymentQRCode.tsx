
import { QrCode, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentQRCodeProps {
  pixKey: string;
}

export function PaymentQRCode({ pixKey }: PaymentQRCodeProps) {
  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      toast({
        title: "Chave PIX copiada!",
        description: "Cole a chave PIX no seu app de pagamento.",
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar a chave PIX.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>Pagamento via PIX</CardTitle>
        <CardDescription>
          Escaneie o QR code ou copie a chave PIX para realizar o pagamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-48 h-48 bg-white p-4 rounded-lg flex items-center justify-center">
            <QrCode className="w-full h-full text-black" />
          </div>
          
          <div className="w-full p-4 bg-black rounded-md flex items-center justify-between gap-4">
            <div className="flex-1 text-sm text-zinc-400 break-all">
              {pixKey}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyPix}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
