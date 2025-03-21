import { Card, CardContent } from '@/components/ui/card';

// All the imports

export interface MetricCardProps {
  title: string;
  value: string;
  cardColor: string;
  icon: React.ReactNode;
}
// Props for the component

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  cardColor,
  icon,
}) => {
  return (
    <Card
      className="h-40 w-44 rounded-lg shadow-none outline-none border-none"
      style={{ backgroundColor: cardColor }}
    >
      <CardContent className="flex flex-col items-start p-4 space-y-2">
        <div className="bg-white rounded-full h-14 w-14 flex items-center justify-center">
          <div className="flex items-center justify-center">
            {icon} {/* Render the icon */}
          </div>
        </div>
        <p className="text-sm font-semibold">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
