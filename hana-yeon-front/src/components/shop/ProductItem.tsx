interface ProductItemProps {
  id: string;
  brandName: string;
  productName: string;
  price: number;
  image: string;
  goProductDetail: (productId: string) => void;
}

export default function ProductItem({
  id,
  brandName,
  productName,
  price,
  image,
  goProductDetail,
}: ProductItemProps) {
  return (
    <div
      className="bg-gray-50 dark:bg-darkBg"
      onClick={() => goProductDetail(id)}
    >
      <div className="px-4 py-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
          <img
            src={image}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {brandName}
          </p>
          <p className="text-gray-800 dark:text-white font-medium mb-2">
            {productName}
          </p>
          <div className="flex items-center gap-1">
            <img src="/hanamoney.png" alt="하나머니" className="w-4 h-4" />
            <span className="text-gray-800 dark:text-white font-semibold">
              {price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
