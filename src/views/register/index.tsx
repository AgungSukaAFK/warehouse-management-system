import { RegisterForm } from "@/components/register-form";

export default function Register() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/warehouse2.webp"
          alt="Image"
          className="mx-auto absolute inset-0 h-full w-full object-cover brightness-60 dark:grayscale"
        />
        <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] select-none flex flex-col gap-4 items-center justify-center text-6xl font-extrabold text-white">
          <h1>WAREHOUSE</h1>
          <h1>MANAGEMENT</h1>
          <h1>SYSTEM</h1>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex w-full justify-center gap-2">
          <img src="gmi-logo.webp" alt="Logo GMI" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
