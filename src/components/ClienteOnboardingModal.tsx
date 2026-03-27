import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, ArrowRight } from "lucide-react";

interface ClienteOnboardingModalProps {
  open: boolean;
  onComplete: (data: { nome: string; cpf: string; razaoSocial: string; cnpj: string }) => void;
}

export default function ClienteOnboardingModal({ open, onComplete }: ClienteOnboardingModalProps) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [optIn, setOptIn] = useState(false);

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatCnpj = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  };

  const isValid = nome.trim() && cpf.replace(/\D/g, "").length === 11 && razaoSocial.trim() && cnpj.replace(/\D/g, "").length === 14 && optIn;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Bem-vindo ao Sistema de Cadastro
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Para iniciar o envio de documentos, preencha seus dados abaixo.
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input id="nome" placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input id="cpf" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="razaoSocial">Razão Social</Label>
            <Input id="razaoSocial" placeholder="Razão social da empresa" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" placeholder="00.000.000/0000-00" value={cnpj} onChange={(e) => setCnpj(formatCnpj(e.target.value))} />
          </div>

          <div className="border rounded-lg p-3 bg-muted/50 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ao prosseguir, declaro que as informações fornecidas são verdadeiras e autorizo a M7 Capital a utilizar os dados e documentos enviados exclusivamente para fins de análise cadastral e de crédito, em conformidade com a Lei Geral de Proteção de Dados (LGPD). Os dados serão tratados com confidencialidade e não serão compartilhados com terceiros sem consentimento prévio, salvo obrigações legais.
            </p>
            <div className="flex items-start gap-2">
              <Checkbox id="optIn" checked={optIn} onCheckedChange={(v) => setOptIn(v === true)} className="mt-0.5" />
              <label htmlFor="optIn" className="text-sm font-medium cursor-pointer leading-tight">
                Li e concordo com os termos acima
              </label>
            </div>
          </div>

          <Button className="w-full" disabled={!isValid} onClick={() => onComplete({ nome, cpf, razaoSocial, cnpj })}>
            Continuar para envio de documentos
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
