import { DashboardCardProps } from '@/constants/types';

const DashboardCard: React.FC<DashboardCardProps> = ({ text, figure, extraCSS = "", icon }) => {
  return (
    <div className={`bg-black rounded-lg flex justify-between items-center w-full sm:w-[48%] lg:w-[32%] px-4 py-10 ${extraCSS}`}>
      <div>
        <p className="text-xs text-white/50 pb-1">{text}</p>
        <h1 className="text-xl">{figure}</h1>
      </div>
      <div className="flex items-center justify-center bg-black mr-2">
        {icon}
      </div>
    </div>
  );
};

export default DashboardCard;
