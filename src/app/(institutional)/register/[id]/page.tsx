import { FAQPageJsonLd } from "@/components/seo";
import { createLogger } from "@/core/logger";
import { REGISTER_FAQ_DATA } from "../_components/register-faq";
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
  rawSellerId: string,
): Promise<SellerReferralResult> {
  const sellerId = parseSellerId(rawSellerId);
  if (sellerId === null) return { status: "invalid" };

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

export default async function RegisterSellerReferralPage({
  params,
}: RegisterSellerReferralPageProps) {
  const { id } = await params;
  const referral = await findSellerReferral(id);

  return (
    <>
      <FAQPageJsonLd questions={REGISTER_FAQ_DATA} />
      <RegisterLandingContent
        sellerReferralStatus={referral.status}
        sellerReferral={
          referral.status === "valid" ? referral.seller : undefined
        }
      />
    </>
  );
}
