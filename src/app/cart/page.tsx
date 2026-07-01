import type { Metadata } from "next";
import CartScreen from "@/components/cart/CartScreen";

export const metadata: Metadata = {
  title: "Shopping Cart | AL-FATAH MART",
  description: "Review your cart items and proceed to checkout at AL-FATAH MART.",
};

export default function CartPage() {
  return <CartScreen />;
}
