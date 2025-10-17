interface Brand {
  id: string;
  name: string;
  logo: string;
}

interface BrandListProps {
  brands: Brand[];
}

export default function BrandList({ brands }: BrandListProps) {
  return (
    <div className="bg-olo dark:bg-brand px-4 py-3">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {brands.map((brand) => (
          <div key={brand.id} className="flex-shrink-0 text-center">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 border border-gray-200 rounded-full flex items-center justify-center mb-2 mx-auto overflow-hidden">
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-12\4 h-12\4 object-contain"
              />
            </div>
            <span className="text-xs text-gray-100 dark:text-white">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
