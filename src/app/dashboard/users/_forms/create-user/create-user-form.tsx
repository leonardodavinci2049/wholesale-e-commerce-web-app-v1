"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUserAction } from "./actions";
import { type CreateUserInput, createUserSchema } from "./schema";

interface CreateUserFormProps {
  onSuccess?: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema) as Resolver<CreateUserInput>,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  function onSubmit(data: CreateUserInput) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role ?? "user");

      const result = await createUserAction(
        { success: false, message: "" },
        formData,
      );

      if (result.success) {
        toast.success(result.message);
        form.reset();
        onSuccess?.();
      } else {
        if (result.errors) {
          if (result.errors.name) {
            form.setError("name", { message: result.errors.name[0] });
          }
          if (result.errors.email) {
            form.setError("email", { message: result.errors.email[0] });
          }
          if (result.errors.password) {
            form.setError("password", { message: result.errors.password[0] });
          }
          if (result.errors.role) {
            form.setError("role", { message: result.errors.role[0] });
          }
        }
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: João Silva"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>O nome completo do usuário.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Ex: joao@exemplo.com"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>O e-mail será usado para login.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>A senha temporária do usuário.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                A função define as permissões do sistema.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Criando..." : "Criar Usuário"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
