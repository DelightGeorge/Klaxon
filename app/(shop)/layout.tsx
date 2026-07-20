import { ShopUtilityBar } from "@/components/layout/shop-utility-bar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ShopUtilityBar />
      {children}
    </>
  );
}