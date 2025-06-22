import { ForgetPasswordForm } from "@/components/forget-password-form";
import { resetPasswordByEmail } from "@/services/auth";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

export default function ForgetPassword() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    try {
      const result = await resetPasswordByEmail(email);
      if (result) {
        toast.success(
          "Permintaan reset password berhasil. Silakan cek email Anda."
        );
      } else {
        throw new Error("Gagal reset password, silakan coba lagi.");
      }
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message || "Terjadi kesalahan yang tidak diketahui.");
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error || "Terjadi kesalahan yang tidak diketahui.");
      setError("");
    }
    setLoading(false);
  }, [error]);

  return (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex w-full justify-center gap-2">
          <img src="gmi-logo.webp" alt="Logo GMI" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ForgetPasswordForm loading={loading} onSubmit={handleLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}
