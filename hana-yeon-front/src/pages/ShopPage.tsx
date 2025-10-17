import UserInfoSection from "../components/shop/UserInfoSection";
import BrandList from "../components/shop/BrandList";
import ProductList from "../components/shop/ProductList";
import { cafeBrands, ediyaProducts } from "@/constants";
import { useGetMe } from "@/hooks/api";

export default function ShopPage() {
  const { data: userInfo } = useGetMe();
  const brands = cafeBrands;
  const products = ediyaProducts;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBg">
      <UserInfoSection
        userName={userInfo?.userName ?? ""}
        cashAmount={userInfo?.quizPoint ?? 0}
      />
      <BrandList brands={brands} />
      <ProductList products={products} />
    </div>
  );
}
