import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}

export default function StatCard({ icon, iconBg, label, value }: StatCardProps) {
  return (
    <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
        >
          {icon}
        </div>
        <div>
          <p className="font-mono text-xl font-bold text-white leading-none">
            {value}
          </p>
          <p className="font-mono text-xs text-white/40 mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
