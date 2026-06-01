import AuthForm from "@/components/auth/AuthForm";
import LiquidEther from "@/components/LiquidEther";

export default function LoginPage() {
  
  return (
    <div className="relative min-h-screen">
      <LiquidEther 
        className="absolute inset-0 -z-10"
        resolution={0.5}
        autoDemo={true}
      />
      {/* Your login form */}
      <AuthForm/>
    </div>
  );
}