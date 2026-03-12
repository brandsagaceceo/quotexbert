import type { FC } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
}

const FAQSection: FC<FAQSectionProps> = ({
  items,
  title = "Frequently Asked Questions",
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h2 className="text-3xl font-bold text-slate-900 mb-8">{title}</h2>
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              {item.question}
            </h3>
            <p className="text-slate-700 leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
