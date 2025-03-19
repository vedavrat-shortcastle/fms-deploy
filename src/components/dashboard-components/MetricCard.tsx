import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// All the imports

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
}
// Props for the component

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
}) => {
  // Determine if the change is positive or negative
  const showPositive = change.startsWith('+') || isPositive;

  return (
    <Card className="odd:bg-blue-100 even:bg-pink-100">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <div className="flex items-baseline justify-between">
            <h2 className="text-3xl font-bold">{value}</h2>
            <div
              className={`flex items-center text-xs font-medium ${showPositive ? 'text-green-600' : 'text-red-600'}`}
            >
              <span>{change}</span>
              {showPositive ? (
                <ArrowUpRight className="h-3 w-3 ml-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 ml-1" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
