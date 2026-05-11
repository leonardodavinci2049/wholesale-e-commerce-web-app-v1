import type { Metadata } from "next";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
