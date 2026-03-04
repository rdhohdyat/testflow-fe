import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type ServiceCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

const ServiceCard = ({ title, description, icon }: ServiceCardProps) => {
  return (
    <Card className="h-full border-none rounded-[2.5rem] bg-white shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-emerald-100/20 transition-all duration-500 overflow-hidden group">
      <CardHeader className="p-10 pb-4">
        <div className="flex flex-col items-center gap-6 text-center">
          {icon && (
            <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <div className="w-8 h-8 flex items-center justify-center">
                {icon}
              </div>
            </div>
          )}
          <CardTitle className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-10 pb-10 text-center">
        <p className="text-base text-gray-400 font-medium leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
