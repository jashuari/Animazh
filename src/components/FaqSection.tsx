"use client";

import { useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    id: "ghibli-style",
    question: "Çfarë është stili Studio Ghibli AI?",
    answer: "Stili Studio Ghibli AI është një opsion i gjenerimit të imazheve me AI që krijon ilustrime të frymëzuara nga studioja ikonike japoneze e animacionit e njohur për filma si 'Spirited Away' dhe 'My Neighbor Totoro'. Ai prodhon imazhe fantastike dhe magjike me stilin artistik karakteristik që adhuruesit e filmave Ghibli do ta njohin."
  },
  {
    id: "how-it-works",
    question: "Si funksionon gjeneratori i stilit Studio Ghibli AI?",
    answer: "Gjeneratori ynë i stilit Studio Ghibli AI përdor teknologji të avancuar AI për të transformuar përshkrimet tuaja tekstuale në imazhe që kapin thelbin e stilit artistik të Studio Ghibli AI. Thjesht shkruani një përshkrim të asaj që dëshironi dhe AI jonë do të gjenerojë një imazh me estetikën karakteristike fantastike dhe të detajuar."
  },
  {
    id: "free-use",
    question: "A është falas gjeneratori i stilit Animazh.com Ghibli AI?",
    answer: "Po, ne ofrojmë 1 foto falas për përdoruesit e rinj."
  },
  {
    id: "image-types",
    question: "Çfarë lloj imazhesh mund të krijoj me stilin Studio Ghibli AI?",
    answer: "Mund të krijoni një shumëllojshmëri të gjerë imazhesh në stilin Studio Ghibli AI, përfshirë peizazhe fantastike, krijesa magjike, personazhe fantastike, pyje të magjepsura, skena të ngrohta dhe më shumë. Stili është veçanërisht i mirë për krijimin e imazheve me një ndjesi magjie dhe imagjinate."
  },
  {
    id: "sharing",
    question: "A mund t'i shkarkoj dhe ndaj imazhet e stilit Studio Ghibli AI?",
    answer: "Po, mund t'i shkarkoni imazhet e stilit Studio Ghibli AI për përdorim personal. Gjithashtu mund t'i ndani imazhet me miqtë dhe familjen tuaj për të treguar idetë tuaja krijuese të sjella në jetë në këtë stil artistik të dashur."
  }
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <section className="container mx-auto px-4 py-12 md:px-6 mb-16">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Pyetje të Shpeshta për Studio Ghibli & Ghibli AI
      </h2>

      <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
        Keni një pyetje tjetër dhe nuk mund të gjeni përgjigjen që po kërkoni? Kontaktoni ekipin tonë të mbështetjes duke <a href="mailto:support@animazh.com" className="text-blue-600 hover:underline">na dërguar një email</a> dhe ne do t'ju përgjigjemi sa më shpejt të jetë e mundur.
      </p>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border rounded-lg overflow-hidden"
          >
            <button
              className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition"
              onClick={() => toggleFaq(faq.id)}
            >
              <h3 className="text-lg font-medium">{faq.question}</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transform transition-transform ${openIndex === faq.id ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === faq.id ? 'max-h-96 p-4 pt-0' : 'max-h-0'
              }`}
            >
              <p className="text-gray-600 pt-2">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
