import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

type FaQAccordionProps = {
  question: string;
  answer: string;
  index: number;
};

const FaQAccordion = ({ question, answer, index }: FaQAccordionProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
    >
      <AccordionItem
        value={`item-${index}`}
        className="border-none rounded-[2rem] overflow-hidden bg-white shadow-xl shadow-zinc-100 mb-4 transition-all hover:shadow-2xl hover:shadow-emerald-100/20"
      >
        <AccordionTrigger className="px-8 py-6 text-zinc-900 font-black text-lg text-left hover:no-underline hover:text-emerald-600 transition-colors tracking-tight">
          {question}
        </AccordionTrigger>
        <AccordionContent className="px-8 pb-8 text-zinc-400 font-medium text-base leading-relaxed">
          {answer}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FaQAccordion;