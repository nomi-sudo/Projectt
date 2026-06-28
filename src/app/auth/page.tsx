import type { Metadata } from "next";
import AuthScreen from "@/components/auth/AuthScreen";

export const metadata: Metadata = {
  title: "Sign In / Sign Up | AL-FATAH MART",
  description:
    "Sign in to your AL-FATAH MART account or create a new one to enjoy exclusive deals, track orders, and more.",
};

export default function AuthPage() {
  return <AuthScreen />;
}
