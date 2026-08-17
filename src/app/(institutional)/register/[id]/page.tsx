import { AlertCircle } from "lucide-react";
import { Suspense } from "react";
import { FAQPageJsonLd } from "@/components/seo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createLogger } from "@/core/logger";
import { REGISTER_FAQ_DATA } from "../_components/register-faq";
import { RegisterForm } from "../_components/register-form";
import { RegisterLandingContent } from "../_components/register-landing-content";

const logger = createLogger("RegisterSellerReferralPage");

interface RegisterSellerReferralPageProps {
  params: Promise<{ id: string }>;
}

type SellerReferralResult =
  | { status: "valid"; seller: { id: number; name: string } }
  | { status: "invalid" | "unavailable" };

function parseSellerId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;

  const sellerId = Number(value);
  return Number.isSafeInteger(sellerId) ? sellerId : null;
}

async function findSellerReferral(
  sellerId: number,
): Promise<SellerReferralResult> {
  try {
    const { sellerServiceApi } = await import("@/services/api-main/seller");
    const response = await sellerServiceApi.searchAllSellers({
      pe_search: String(sellerId),
    });
    const seller = sellerServiceApi
      .extractSearchSellers(response)
      .find((item) => item.ID_CUSTOMER === sellerId);

    if (!seller) return { status: "invalid" };

    return {
      status: "valid",
      seller: {
        id: sellerId,
        name: seller.NOME.trim(),
      },
    };
  } catch (error) {
    logger.error("Erro ao validar indicação de vendedor", error);
    return { status: "unavailable" };
  }
}

async function SellerReferralFormSection({ sellerId }: { sellerId: number }) {
  const referral = await findSellerReferral(sellerId);

  if (referral.status === "valid") {
    return (
      <RegisterForm sellerId={sellerId} sellerName={referral.seller.name} />
    );
  }

  return <SellerReferralAlert status={referral.status} sellerId={sellerId} />;
}

function SellerReferralAlert({
  status,
  sellerId,
}: {
  status: "invalid" | "unavailable";
  sellerId?: number;
}) {
  const isInvalid = status === "invalid";

  return (
    <Alert variant="destructive" className="bg-card shadow-lg">
      <AlertCircle />
      <AlertTitle>
        {isInvalid ? "Indicação inválida" : "Validação indisponível"}
      </AlertTitle>
      <AlertDescription>
        {isInvalid
          ? `A indicação do Vendedor${sellerId ? ` Id #${sellerId}` : ""} para cadastro não é válida.`
          : "Não foi possível validar a indicação do vendedor agora. Tente novamente em instantes."}
      </AlertDescription>
    </Alert>
  );
}

function RegisterFormFallback() {
  return (
    <Card className="gap-0 rounded-xl border-border/60 py-0 shadow-lg ring-1 ring-primary/5">
      <CardContent className="flex flex-col gap-5 px-4 py-5 sm:px-7">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Skeleton className="h-10 sm:col-span-2" />
          <Skeleton className="h-10 sm:col-span-2" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10 sm:col-span-2" />
          <Skeleton className="h-10" />
        </div>
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}

async function SellerReferralFormSectionFromParams({
  params,
}: RegisterSellerReferralPageProps) {
  const { id } = await params;
  const sellerId = parseSellerId(id);

  if (sellerId === null) {
    return <SellerReferralAlert status="invalid" />;
  }

  return <SellerReferralFormSection sellerId={sellerId} />;
}

export default function RegisterSellerReferralPage({
  params,
}: RegisterSellerReferralPageProps) {
  return (
    <>
      <FAQPageJsonLd questions={REGISTER_FAQ_DATA} />
      <RegisterLandingContent
        formSection={
          <Suspense fallback={<RegisterFormFallback />}>
            <SellerReferralFormSectionFromParams params={params} />
          </Suspense>
        }
      />
    </>
  );
}
