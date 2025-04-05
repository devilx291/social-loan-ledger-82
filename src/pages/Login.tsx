
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, PiggyBank, ShieldCheck, KeyRound, Mail, Smartphone } from "lucide-react";
import OTPLoginForm from "@/components/auth/OTPLoginForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Form */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <Link to="/" className="flex items-center space-x-2 mb-10">
            <div className="bg-gradient-to-r from-brand-primary to-brand-accent p-2 rounded-lg">
              <PiggyBank className="h-6 w-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-800">TrustFund</span>
          </Link>
          
          <h1 className="text-3xl font-display font-bold mb-2 text-gray-900">Welcome Back</h1>
          <p className="text-muted-foreground mb-8">Enter your credentials to access your account</p>
          
          <Tabs defaultValue="email" className="mb-6">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Mobile OTP</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="pl-10 py-6 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Link to="#" className="text-sm text-brand-primary hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pl-10 py-6 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 transition-opacity py-6 text-lg"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="mobile">
              <OTPLoginForm />
            </TabsContent>
          </Tabs>
          
          <p className="text-center mt-8 text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right Side - Image and Content */}
      <div className="md:w-1/2 bg-gradient-to-br from-brand-primary to-brand-accent p-8 md:p-16 text-white flex items-center hidden md:flex">
        <div className="max-w-lg">
          <div className="mb-8">
            <div className="inline-block bg-white/10 backdrop-blur-sm p-3 rounded-xl mb-4">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Community Trust Financing</h2>
            <p className="text-white/90 text-lg mb-6">
              Access emergency funds through a trusted network of community members. No traditional credit checks, just social trust.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center">
                <div className="bg-white/20 rounded-full p-1 mr-3">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <span>Fast approval for emergency situations</span>
              </li>
              <li className="flex items-center">
                <div className="bg-white/20 rounded-full p-1 mr-3">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <span>Build your trust score through repayment</span>
              </li>
              <li className="flex items-center">
                <div className="bg-white/20 rounded-full p-1 mr-3">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <span>Transparent blockchain verified transactions</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <p className="italic text-white/90 mb-3">
              "This platform changed my life during a financial emergency. The community support was incredible."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-bold">AR</span>
              </div>
              <div className="ml-3">
                <p className="font-medium">Aarav R.</p>
                <p className="text-sm text-white/70">Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
