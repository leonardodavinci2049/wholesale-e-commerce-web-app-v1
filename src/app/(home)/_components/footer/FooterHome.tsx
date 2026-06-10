"use client";

import {
  Clock,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Shield,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { companyInfo } from "@/data/info-company";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function FooterHome() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de inscrição na newsletter
    setIsSubscribed(true);
    setEmail("");

    // Reset após 3 segundos
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Seção principal do footer */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Coluna 1: Sobre a empresa */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo/logo-horizontal-footer.png"
                  alt={`${companyInfo.name} - ${companyInfo.meta.keywords}`}
                  width={140}
                  height={44}
                  className="h-10 w-auto brightness-0 invert filter transition-opacity hover:opacity-80"
                />
              </Link>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {companyInfo.about}
            </p>

            {/* Redes sociais */}
            <div className="flex space-x-4">
              <a
                href={companyInfo.links.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href={companyInfo.links.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={companyInfo.links.linktreeUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                aria-label="Linktree"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href={companyInfo.links.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Links rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Navegação</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-400 transition-colors hover:text-white cursor-pointer"
                >
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link
                  href="/antispam"
                  className="text-sm text-gray-400 transition-colors hover:text-white cursor-pointer"
                >
                  Política Anti-Spam
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 transition-colors hover:text-white cursor-pointer"
                >
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-400 transition-colors hover:text-white cursor-pointer"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/return"
                  className="text-sm text-gray-400 transition-colors hover:text-white cursor-pointer"
                >
                  Política de Entrega, Troca e Devolução
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-400 transition-colors hover:text-white cursor-pointer"
                >
                  Termos e Condições
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Informações de contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                <div className="text-sm">
                  <p className="text-gray-400">{companyInfo.address}</p>
                  <p className="text-gray-400">{companyInfo.addressLocation}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 shrink-0 text-blue-400" />
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {companyInfo.phone}
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 shrink-0 text-blue-400" />
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {companyInfo.email}
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 shrink-0 text-blue-400" />
                <div className="text-sm">
                  <p className="text-gray-400">
                    Seg - Sex: {companyInfo.openingHours}
                  </p>
                  <p className="text-gray-400">
                    Sáb: {companyInfo.openingSaturday}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Newsletter</h3>
            <p className="text-sm text-gray-400">
              Receba novidades, promoções exclusivas e lançamentos diretamente
              no seu e-mail.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                disabled={isSubscribed}
              >
                {isSubscribed ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span>✓ Inscrito!</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Inscrever-se</span>
                  </span>
                )}
              </Button>
            </form>

            {/* Badges de confiança */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Dados protegidos</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>Sem spam garantido</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de garantias/diferenciais */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-400">
              <Shield className="h-5 w-5 text-green-400" />
              <span>Produtos Originais</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-400">
              <Truck className="h-5 w-5 text-blue-400" />
              <span>Entrega Nacional</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-400">
              <CreditCard className="h-5 w-5 text-purple-400" />
              <span>Pagamento Seguro</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-400">
              <Clock className="h-5 w-5 text-orange-400" />
              <span>Suporte Especializado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} {companyInfo.name}. Todos os direitos
              reservados - CNPJ: {companyInfo.cnpj} - Build: 27042018
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/antispam"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Política Anti-Spam
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
