"use server";

import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import { transcribeCatalogSearchAudio } from "@/services/api-voice/api-boice";

const logger = createLogger("CatalogVoiceActions");

export type CatalogVoiceTranscriptionActionResult =
  | {
      success: true;
      transcript: string;
    }
  | {
      success: false;
      message: string;
    };

/** Transcreve uma gravação curta após validar a sessão atual. */
export async function transcribeCatalogVoiceAction(
  formData: FormData,
): Promise<CatalogVoiceTranscriptionActionResult> {
  await getAuthContext();

  const audio = formData.get("audio");

  if (!(audio instanceof Blob)) {
    return {
      success: false,
      message: "Não foi possível processar a gravação.",
    };
  }

  try {
    const result = await transcribeCatalogSearchAudio({ audio });

    if (!result.transcript) {
      return {
        success: false,
        message: "Não foi possível identificar uma fala na gravação.",
      };
    }

    return {
      success: true,
      transcript: result.transcript,
    };
  } catch (error) {
    logger.error("Falha ao transcrever a pesquisa por voz do catálogo", error);

    return {
      success: false,
      message: "Não foi possível converter a voz em texto. Tente novamente.",
    };
  }
}
