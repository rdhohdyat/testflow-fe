import { Card, CardContent } from "./ui/card";

type StepCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
};

const StepCard = ({ icon, title, description, index }: StepCardProps) => {
  return (
    <Card className="border border-zinc-50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-100 dark:shadow-none rounded-[3rem] p-4 hover:shadow-2xl hover:shadow-emerald-100/30 dark:hover:shadow-none transition-all duration-500 group">
      <CardContent className="p-8 flex items-start gap-6">
        <div className="relative shrink-0">
          <div className="w-16 h-16 bg-zinc-900 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-emerald-500 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-zinc-200 dark:shadow-none">
            {icon && <div className="w-6 h-6 flex items-center justify-center transform group-hover:scale-110 transition-transform">{icon}</div>}
          </div>
          <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-black tracking-tighter shadow-md dark:shadow-none border-2 border-white dark:border-zinc-900">
            #{index.toString().padStart(2, '0')}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter mb-2 group-hover:text-emerald-600 transition-colors">{title}</h3>
          <p className="text-sm text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-500 transition-colors">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepCard;
