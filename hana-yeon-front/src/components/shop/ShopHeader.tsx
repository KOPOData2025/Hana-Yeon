import { ArrowLeft, Search } from "lucide-react";

interface ShopHeaderProps {
  category: string;
  onBack: () => void;
  onSearch: () => void;
}

export default function ShopHeader({
  category,
  onBack,
  onSearch,
}: ShopHeaderProps) {
  return (
    <div className="bg-olo">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onBack} className="text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-black font-semibold text-lg">{category}</h1>
        <button onClick={onSearch} className="text-white">
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}
