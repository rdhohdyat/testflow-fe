import { Card, CardContent } from "./ui/card";

type StepCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
};

const StepCard = ({ icon, title, description, index }: StepCardProps) => {
  return (
    <Card className="border dark:border-neutral-900 bg-white dark:bg-neutral-900 shadow-lg dark:shadow-none rounded-3xl p-4 hover:shadow-2xl hover:shadow-neutral-100/30 dark:hover:shadow-none transition-all duration-500 group">
      <CardContent className="p-4 sm:p-8 flex items-start gap-6">
        <div className="relative shrink-0">
          <div className="sm:w-16 sm:h-16 w-12 h-12 bg-neutral-900 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-emerald-500 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-neutral-200 dark:shadow-none">
            {icon && <div className="sm:w-6 sm:h-6 w-4 h-4 flex items-center justify-center transform group-hover:scale-110 transition-transform">{icon}</div>}
          </div>
          <div className="absolute -bottom-2 -right-2 sm:px-2.5 sm:py-1 px-1 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-black tracking-tighter shadow-md dark:shadow-none border-2 border-white dark:border-neutral-900">
            #{index.toString().padStart(2, '0')}
          </div>
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white tracking-tighter mb-2 group-hover:text-emerald-600 transition-colors">{title}</h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed group-hover:text-neutral-500 transition-colors">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepCard;
