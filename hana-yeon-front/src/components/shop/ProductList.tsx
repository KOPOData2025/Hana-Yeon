import { useCallback } from "react";
import { useInternalRouter } from "@/hooks";
import { PATH } from "@/constants";
import ProductItem from "./ProductItem";

interface Product {
  id: string;
  brandName: string;
  productName: string;
  price: number;
  image: string;
}

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const router = useInternalRouter();
  const goProductDetail = useCallback(
    (productId: string) => {
      router.push(`${PATH.SHOP}/${productId}`);
    },
    [router]
  );

  return (
    <div className="bg-gray-50 dark:bg-darkBg">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          {...product}
          goProductDetail={goProductDetail}
        />
      ))}
    </div>
  );
}
