import { LoginForm } from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url('/bg2.jpg')" }}
    >
      <div className="backdrop-blur-md bg-white/20 p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <LoginForm />
      </div>
    </div>
  );
}
