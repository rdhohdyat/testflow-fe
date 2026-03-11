import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type ServiceCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

const ServiceCard = ({ title, description, icon }: ServiceCardProps) => {
  return (
    <Card className="h-full border border-neutral-100 rounded-[2.5rem] bg-white dark:bg-gray-900 shadow-xl shadow-gray-100 dark:shadow-none hover:shadow-2xl hover:shadow-emerald-100/20 dark:hover:shadow-none transition-all duration-500 overflow-hidden group">
      <CardHeader className="sm:p-10 pb-4">
        <div className="flex flex-col items-center gap-3 sm:gap-6 text-center">
          {icon && (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-emerald-600 shadow-sm dark:shadow-none group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                {icon}
              </div>
            </div>
          )}
          <CardTitle className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-10 pb-4 sm:pb-10 text-center">
        <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
