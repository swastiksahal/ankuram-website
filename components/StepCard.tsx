import type { LucideIcon } from "lucide-react";

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

export default function StepCard({ stepNumber, title, description, icon: Icon }: StepCardProps) {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-100">
      <span className="text-2xl font-mono text-navy/20 font-semibold mb-4 block">
        {stepNumber}
      </span>
      {Icon && (
        <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center mb-5">
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-navy mb-3">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
