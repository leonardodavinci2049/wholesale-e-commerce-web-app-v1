import { JsonLdScript } from "@/lib/seo/json-ld";

interface FAQEntry {
  question: string;
  answer: string;
}

interface FAQPageJsonLdProps {
  questions: readonly FAQEntry[];
}

export function FAQPageJsonLd({ questions }: FAQPageJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((question) => ({
      "@type": "Question",
      name: question.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: question.answer,
      },
    })),
  };

  return <JsonLdScript data={jsonLd} />;
}
