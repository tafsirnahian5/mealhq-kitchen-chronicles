
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardBoxProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

const DashboardBox: React.FC<DashboardBoxProps> = ({
  title,
  value,
  icon,
  className,
  onClick
}) => {
  return (
    <div 
      className={cn(
        "dashboard-box cursor-pointer aspect-square flex flex-col justify-between",
        onClick ? "hover:scale-[1.02]" : "",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-mealhq-red">{icon}</div>}
      </div>
      <div className="flex items-end justify-between mt-auto">
        <div className="text-2xl lg:text-3xl font-bold">{value}</div>
        {onClick && (
          <div className="text-xs text-muted-foreground">Click to view details</div>
        )}
      </div>
    </div>
  );
};

export default DashboardBox;
