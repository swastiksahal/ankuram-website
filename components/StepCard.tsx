import type { LucideIcon } from "lucide-react";

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

export default function StepCard({ stepNumber, title, description, icon: Icon }: StepCardProps) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100">
      <span className="text-3xl font-mono text-accent/40 font-semibold mb-4 block">
        {stepNumber}
      </span>
      {Icon && (
        <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center mb-5">
          <Icon className="w-6 h-6 text-accent" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-navy mb-3">
        {title}
      </h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
