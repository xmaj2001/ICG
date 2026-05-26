import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  buttonText: string;
  buttonAction: () => void;
}

export function Header({ title, buttonText, buttonAction }: HeaderProps) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <span className="label-eyebrow text-gold">Dashboard</span>
        <h1 className="font-display text-4xl mt-2">{title}</h1>
      </div>
      <Button className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-background px-4 py-2.5 text-sm font-medium transition-colors">
        <Plus />
        {buttonText}
      </Button>
    </div>
  );
}
