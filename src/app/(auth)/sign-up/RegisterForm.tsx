"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { registerWithConfirmSchema } from "../_common-validations/validation";
import registerAction from "./register-action";

// Tipos para o estado do formulário
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ClientErrors {
  [key: string]: string;
}

// Estado inicial do formulário
const initialState = null;
const initialFormData: FormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterForm = () => {
  const [state, formAction] = useActionState(registerAction, initialState);

  const [isPending, startTransition] = useTransition();
  // Estados do formulário
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [clientErrors, setClientErrors] = useState<ClientErrors>({});
  const [showErrorPanel, setShowErrorPanel] = useState(false);

  // Efeito para mostrar toast com base no estado do servidor
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      // Limpar formulário em caso de sucesso
      setFormData(initialFormData);
      setClientErrors({});
      setShowErrorPanel(false);
    } else if (state?.message && !state?.success) {
      toast.error(state.message);
    }
  }, [state]);

  // Função para validar um campo específico
  const validateField = (fieldName: keyof FormData, value: string) => {
    try {
      const fieldSchema = registerWithConfirmSchema.shape[fieldName];
      fieldSchema.parse(value);

      // Se é confirmPassword, validar também se coincide com password
      if (fieldName === "confirmPassword") {
        if (value !== formData.password) {
          throw new Error("As senhas não coincidem.");
        }
      }

      // Se chegou até aqui, o campo é válido
      setClientErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } catch (error) {
      let errorMessage = "Campo inválido";

      if (error instanceof z.ZodError) {
        errorMessage = error.issues[0]?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setClientErrors((prev) => ({
        ...prev,
        [fieldName]: errorMessage,
      }));
    }
  };

  // Função para validar todo o formulário
  const validateForm = (): boolean => {
    try {
      registerWithConfirmSchema.parse(formData);
      setClientErrors({});
      setShowErrorPanel(false);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ClientErrors = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setClientErrors(newErrors);
        setShowErrorPanel(Object.keys(newErrors).length > 0);
        return false;
      }
      return false;
    }
  };

  // Handler para mudanças nos campos
  const handleInputChange = (fieldName: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Validar campo após mudança (debounced)
    setTimeout(() => {
      validateField(fieldName, value);
    }, 300);
  };

  // Handler para confirmPassword com validação imediata
  const handleConfirmPasswordChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      confirmPassword: value,
    }));

    // Validar imediatamente se as senhas coincidem
    if (formData.password && value) {
      if (value !== formData.password) {
        setClientErrors((prev) => ({
          ...prev,
          confirmPassword: "As senhas não coincidem.",
        }));
      } else {
        setClientErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    }
  };

  // Handler para submissão do formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar formulário antes de enviar
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros antes de continuar.");
      return;
    }

    // Criar FormData para a server action
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("confirmPassword", formData.confirmPassword);

    // Executar ação do servidor
    startTransition(() => {
      formAction(formDataToSubmit);
    });
  };

  // Função para obter erro do campo (server ou client)
  const getFieldError = (fieldName: string) => {
    return clientErrors[fieldName] || state?.fieldErrors?.[fieldName];
  };

  // Contagem de erros para o painel
  const errorCount = Object.keys(clientErrors).length;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Painel de Erros */}
        {showErrorPanel && errorCount > 0 && (
          <Card className="border-destructive bg-destructive/5 relative">
            <CardContent className="flex pt-6">
              <AlertTriangle className="text-destructive mt-0.5 mr-3 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <div className="text-destructive mb-2 font-medium">
                  {errorCount === 1
                    ? "Há 1 erro que precisa ser corrigido:"
                    : `Há ${errorCount} erros que precisam ser corrigidos:`}
                </div>
                <ul className="text-destructive/80 ml-4 space-y-1 text-sm">
                  {Object.entries(clientErrors).map(([field, error]) => (
                    <li key={field} className="list-disc">
                      <strong>
                        {field === "name"
                          ? "Nome"
                          : field === "email"
                            ? "Email"
                            : field === "password"
                              ? "Senha"
                              : "Confirmação de Senha"}
                        :
                      </strong>{" "}
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setShowErrorPanel(false)}
                className="hover:bg-destructive/20 text-destructive absolute top-2 right-2 rounded p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Digite seu nome"
            required
            autoComplete="given-name"
            className={cn(
              getFieldError("name") &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {getFieldError("name") && (
            <p className="text-destructive text-sm">{getFieldError("name")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Digite seu email"
            required
            autoComplete="email"
            className={cn(
              getFieldError("email") &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {getFieldError("email") && (
            <p className="text-destructive text-sm">{getFieldError("email")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Digite sua senha"
            required
            autoComplete="new-password"
            className={cn(
              getFieldError("password") &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {getFieldError("password") && (
            <p className="text-destructive text-sm">
              {getFieldError("password")}
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            A senha deve ter pelo menos 8 caracteres, incluindo letra maiúscula,
            minúscula e número.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            placeholder="Digite sua senha novamente"
            required
            autoComplete="new-password"
            className={cn(
              getFieldError("confirmPassword") &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {getFieldError("confirmPassword") && (
            <p className="text-destructive text-sm">
              {getFieldError("confirmPassword")}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
