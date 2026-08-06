"use client";

import { Filter, Loader2, Mic, Search, Square, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { transcribeCatalogVoiceAction } from "@/app/dashboard/_actions/catalog-voice-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProductSearch } from "@/hooks/use-product-search";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";
import type { UITaxonomyMenuItem } from "@/services/api-main/taxonomy-base/transformers/transformers";

import { BudgetGeneralFilterPanel } from "./budget-general-filter-panel";
import { BudgetGeneralFilterSheet } from "./budget-general-filter-sheet";

const MAX_RECORDING_DURATION_MS = 15_000;

type VoiceState = "idle" | "requesting" | "recording" | "transcribing";

function getSupportedAudioMimeType(): string | undefined {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];

  return candidates.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
}

function stopMediaStream(stream: MediaStream | null): void {
  for (const track of stream?.getTracks() ?? []) track.stop();
}

function getMicrophoneErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") {
      return "Permita o acesso ao microfone para usar a pesquisa por voz.";
    }

    if (error.name === "NotFoundError") {
      return "Nenhum microfone foi encontrado neste dispositivo.";
    }
  }

  return "Não foi possível acessar o microfone. Tente novamente.";
}

interface ProductSearchBarProps {
  defaultValue: string;
  flagStock: number;
  brands: UIBrand[];
  selectedBrandId?: number;
  categories: UITaxonomyMenuItem[];
  selectedTaxonomyId?: number;
  viewToggleButton?: React.ReactNode;
}

export function ProductSearchBar({
  defaultValue,
  flagStock,
  brands,
  selectedBrandId,
  categories,
  selectedTaxonomyId,
  viewToggleButton,
}: ProductSearchBarProps) {
  const {
    value,
    isPending,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    commitSearch,
    clearSearch,
  } = useProductSearch({ initialValue: defaultValue });
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceFeedback, setVoiceFeedback] = useState<{
    type: "error" | "status";
    message: string;
  } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimeoutRef = useRef<number | null>(null);
  const discardRecordingRef = useRef(false);
  const mountedRef = useRef(true);

  const clearRecordingTimeout = useCallback(() => {
    if (recordingTimeoutRef.current !== null) {
      window.clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
  }, []);

  const releaseMicrophone = useCallback(() => {
    stopMediaStream(mediaStreamRef.current);
    mediaStreamRef.current = null;
  }, []);

  useEffect(() => {
    setIsVoiceSupported(
      typeof navigator.mediaDevices?.getUserMedia === "function" &&
        typeof window.MediaRecorder === "function",
    );
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      discardRecordingRef.current = true;
      clearRecordingTimeout();

      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }

      releaseMicrophone();
    };
  }, [clearRecordingTimeout, releaseMicrophone]);

  const transcribeRecording = useCallback(
    async (audio: Blob) => {
      if (!mountedRef.current) return;

      setVoiceState("transcribing");
      setVoiceFeedback({
        type: "status",
        message: "Convertendo voz em texto…",
      });

      try {
        const formData = new FormData();
        formData.append("audio", audio, "catalog-search-audio");
        const result = await transcribeCatalogVoiceAction(formData);

        if (!mountedRef.current) return;

        if (!result.success) {
          setVoiceFeedback({ type: "error", message: result.message });
          return;
        }

        handleChange(result.transcript);
        commitSearch(result.transcript);
        setVoiceFeedback({
          type: "status",
          message: "Texto transcrito. Pesquisando…",
        });
      } catch {
        if (!mountedRef.current) return;

        setVoiceFeedback({
          type: "error",
          message:
            "Não foi possível converter a voz em texto. Tente novamente.",
        });
      } finally {
        if (mountedRef.current) setVoiceState("idle");
      }
    },
    [commitSearch, handleChange],
  );

  const stopRecording = useCallback(() => {
    clearRecordingTimeout();

    const recorder = mediaRecorderRef.current;
    if (recorder?.state === "recording") {
      setVoiceState("transcribing");
      recorder.stop();
    }
  }, [clearRecordingTimeout]);

  const startRecording = useCallback(async () => {
    if (!isVoiceSupported || isPending || voiceState !== "idle") return;

    setVoiceState("requesting");
    setVoiceFeedback({
      type: "status",
      message: "Solicitando acesso ao microfone…",
    });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      if (!mountedRef.current) {
        stopMediaStream(stream);
        return;
      }

      const mimeType = getSupportedAudioMimeType();
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      discardRecordingRef.current = false;

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      });

      recorder.addEventListener("error", () => {
        discardRecordingRef.current = true;
        setVoiceFeedback({
          type: "error",
          message: "A gravação foi interrompida. Tente novamente.",
        });
        stopRecording();
      });

      recorder.addEventListener("stop", () => {
        clearRecordingTimeout();
        releaseMicrophone();
        mediaRecorderRef.current = null;

        if (discardRecordingRef.current) {
          if (mountedRef.current) setVoiceState("idle");
          return;
        }

        const audio = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || mimeType || "audio/webm",
        });
        audioChunksRef.current = [];
        void transcribeRecording(audio);
      });

      recorder.start();
      setVoiceState("recording");
      setVoiceFeedback({
        type: "status",
        message: "Ouvindo… Clique novamente para parar.",
      });
      recordingTimeoutRef.current = window.setTimeout(
        stopRecording,
        MAX_RECORDING_DURATION_MS,
      );
    } catch (error) {
      mediaRecorderRef.current = null;
      releaseMicrophone();

      if (mountedRef.current) {
        setVoiceState("idle");
        setVoiceFeedback({
          type: "error",
          message: getMicrophoneErrorMessage(error),
        });
      }
    }
  }, [
    clearRecordingTimeout,
    isPending,
    isVoiceSupported,
    releaseMicrophone,
    stopRecording,
    transcribeRecording,
    voiceState,
  ]);

  const handleVoiceClick = () => {
    if (voiceState === "recording") {
      stopRecording();
      return;
    }

    void startRecording();
  };

  const isVoiceBusy = voiceState !== "idle";

  const handleClearSearch = () => {
    setVoiceFeedback(null);
    clearSearch();
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
            <Input
              id="product-search-v2"
              type="search"
              placeholder="Digite o termo de pesquisa"
              value={value}
              onChange={(e) => {
                handleChange(e.target.value);
                setVoiceFeedback(null);
              }}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={(e) =>
                handleCompositionEnd(e.currentTarget.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitSearch(e.currentTarget.value);
                  e.currentTarget.blur();
                }
              }}
              disabled={isVoiceBusy}
              aria-label="Buscar produto"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              enterKeyHint="search"
              spellCheck={false}
              className={`pl-10 [&::-webkit-search-cancel-button]:appearance-none ${
                value !== "" && isVoiceSupported
                  ? "pr-20"
                  : value !== "" || isVoiceSupported
                    ? "pr-10"
                    : ""
              } ${isPending || isVoiceBusy ? "opacity-60" : ""}`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              {value !== "" && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  disabled={isVoiceBusy}
                  aria-label="Limpar pesquisa"
                  title="Limpar pesquisa"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
              {isVoiceSupported && (
                <button
                  type="button"
                  onClick={handleVoiceClick}
                  className={`flex h-full w-10 items-center justify-center transition-colors ${
                    voiceState === "recording"
                      ? "text-destructive"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  disabled={
                    voiceState !== "recording" &&
                    (isPending ||
                      voiceState === "requesting" ||
                      voiceState === "transcribing")
                  }
                  aria-label={
                    voiceState === "recording"
                      ? "Parar gravação de voz"
                      : "Pesquisar usando a voz"
                  }
                  aria-pressed={voiceState === "recording"}
                  title={
                    voiceState === "recording"
                      ? "Parar gravação"
                      : "Pesquisar usando a voz"
                  }
                >
                  {voiceState === "requesting" ||
                  voiceState === "transcribing" ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : voiceState === "recording" ? (
                    <Square
                      className="h-3 w-3 animate-pulse fill-current"
                      aria-hidden="true"
                    />
                  ) : (
                    <Mic className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          </div>
          {voiceFeedback && (
            <p
              className={`absolute top-full left-3 z-10 mt-1 rounded-md bg-background/95 px-2 py-1 text-xs shadow-sm ${
                voiceFeedback.type === "error"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
              role={voiceFeedback.type === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {voiceFeedback.message}
            </p>
          )}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full hover:bg-muted/60 xl:hidden"
              aria-label="Abrir filtros"
            >
              <Filter className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            aria-describedby={undefined}
            className="flex w-[92vw] max-w-md flex-col gap-0 p-0"
          >
            <SheetHeader className="border-b border-border/60 p-4">
              <SheetTitle className="text-base">Filtros</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <BudgetGeneralFilterPanel
                flagStock={flagStock}
                stockSwitchId="mobile-search-stock-filter"
                brands={brands}
                selectedBrandId={selectedBrandId}
                categories={categories}
                selectedTaxonomyId={selectedTaxonomyId}
              />
            </div>
          </SheetContent>
        </Sheet>
        {viewToggleButton}
      </div>

      <div className="hidden gap-2 sm:ml-auto sm:flex">
        <BudgetGeneralFilterSheet
          flagStock={flagStock}
          brands={brands}
          selectedBrandId={selectedBrandId}
          categories={categories}
          selectedTaxonomyId={selectedTaxonomyId}
        />
      </div>
    </div>
  );
}
