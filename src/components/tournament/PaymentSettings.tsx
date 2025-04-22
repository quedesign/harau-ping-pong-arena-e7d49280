
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSettingsProps {
  pixKey: string;
  onPixKeyChange: (value: string) => void;
}

export function PaymentSettings({ pixKey, onPixKeyChange }: PaymentSettingsProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>Configurações de Pagamento</CardTitle>
        <CardDescription>
          Configure como os participantes irão pagar pela inscrição
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Método de Pagamento</Label>
            <div className="mt-2 p-4 bg-black rounded-md border border-zinc-800">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-green-500/10 text-green-400 flex items-center justify-center mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <path d="M9.5 13.8L14.5 8.8M7.3 11.6L8.8 13.1L7.3 11.6ZM11.6 15.9L13.1 17.4L11.6 15.9ZM8.8 15.9L7.3 17.4L8.8 15.9ZM13.1 11.6L11.6 13.1L13.1 11.6ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Pagamento via PIX</h3>
                  <p className="text-sm text-zinc-400">
                    Participantes irão pagar via PIX após o registro
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pixKey">Chave PIX*</Label>
            <Input
              id="pixKey"
              value={pixKey}
              onChange={(e) => onPixKeyChange(e.target.value)}
              placeholder="CPF, e-mail, telefone ou chave aleatória"
              className="bg-black border-zinc-800"
              required
            />
            <p className="text-sm text-zinc-400">
              Insira sua chave PIX para receber os pagamentos das inscrições
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-400">
              Nota: Quando um participante se registrar, receberá as instruções de pagamento por e-mail. 
              O acesso ao torneio será liberado após a confirmação do pagamento.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
