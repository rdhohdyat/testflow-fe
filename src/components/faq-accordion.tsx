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
        className="border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-md shadow-neutral-100 dark:shadow-none mb-4 transition-all hover:shadow-xl dark:hover:shadow-none"
      >
        <AccordionTrigger className="px-8 py-6 text-neutral-900 dark:text-white font-black text-lg text-left hover:no-underline hover:text-emerald-500 dark:hover:text-emerald-500 transition-colors tracking-tight">
          {question}
        </AccordionTrigger>
        <AccordionContent className="px-8 pb-8 text-neutral-400 font-medium text-base leading-relaxed">
          {answer}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FaQAccordion;