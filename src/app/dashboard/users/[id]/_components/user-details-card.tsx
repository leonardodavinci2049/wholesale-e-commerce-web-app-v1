import { CalendarIcon, Fingerprint, Mail, Shield, User } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User as UserType } from "@/database/shared/auth/auth.types";

interface UserDetailsCardProps {
  user: UserType;
}

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

function DetailItem({ label, value, icon: Icon, className }: DetailItemProps) {
  return (
    <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors min-h-[80px] justify-center">
      <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider mb-auto">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <div
        className={`font-semibold text-lg leading-tight truncate ${className}`}
      >
        {value || "N/A"}
      </div>
    </div>
  );
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-border">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <CardTitle>Detalhes do Usuário</CardTitle>
            <CardDescription>
              Informações pessoais e de conta do usuário
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem label="Nome" value={user.name} icon={User} />

        <DetailItem label="Email" value={user.email} icon={Mail} />

        <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors min-h-[80px] justify-center">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider mb-auto">
            <Shield className="h-3.5 w-3.5" /> Função
          </span>
          <div>
            <Badge variant="outline">{user.role}</Badge>
          </div>
        </div>

        <DetailItem
          label="ID do Usuário"
          value={user.id}
          icon={Fingerprint}
          className="font-mono text-sm"
        />

        <DetailItem
          label="Criado em"
          value={
            user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "N/A"
          }
          icon={CalendarIcon}
        />
      </CardContent>
    </Card>
  );
}
