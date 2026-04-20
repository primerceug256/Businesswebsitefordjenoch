import { motion } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";

const faqs = [
  {
    question: "How do I receive my DJ Drops or Software?",
    answer: "After successful payment via Airtel Money, your digital products are delivered to your registered email address within 10 minutes."
  },
  {
    question: "Which payment methods do you accept?",
    answer: "We primarily use Airtel Money (+256 747 816 444). For other arrangements, please contact us via WhatsApp."
  },
  {
    question: "Is the DJ Software compatible with Windows and Mac?",
    answer: "Most of our software like Sony Acid and Virtual DJ are for Windows. However, we have specific versions for Android and macOS as indicated in the shop."
  },
  {
    question: "Can I book DJ Enoch for events outside Mukono?",
    answer: "Yes! DJ Enoch Pro performs across all of Uganda. Transport charges may apply depending on the distance from Mukono/Nyenje."
  }
];

export function FAQ() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 uppercase italic">Common Questions</h2>
          <div className="w-16 h-1 bg-orange-600 mx-auto mt-2"></div>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-white px-4 rounded-xl mb-4 border border-gray-200">
              <AccordionTrigger className="text-gray-900 font-bold hover:no-underline">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}