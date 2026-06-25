import { ArrowLeft } from "lucide-react";
import { Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { UserContext } from "./usercontext.jsx";
import { useContext } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
      
      setUser(userData);
      console.log("Logged in:", userData);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 pointer-events-none" />
      
      {/* Ambient light effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
      
      {/* Back button */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-all duration-200 hover:gap-3 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        <span className="text-sm">Back</span>
      </button>

      {/* Main card */}
      <div className="w-full max-w-sm relative z-10 mx-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20">
              <Cpu size={28} strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 text-center mb-3">Welcome back</h1>
            <p className="text-slate-500 text-center text-sm leading-relaxed">
              Sign in to AlloyDocs to access your files and premium features
            </p>
          </div>

          {/* Google login button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 active:scale-95 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
              <path d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Footer text */}
          <p className="text-xs text-center text-slate-400 mt-8 leading-relaxed">
            By signing in, you agree to our{" "}
            <a href="#" className="text-slate-600 hover:text-slate-900 underline transition-colors">
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="#" className="text-slate-600 hover:text-slate-900 underline transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Trust signal */}
        <p className="text-center text-xs text-slate-400 mt-8">
          🔒 Your files are secure. We never store your data on our servers.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;