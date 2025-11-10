import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, AlertCircle, Loader2, Eye, EyeOff, Info, User, Lock, ArrowRight } from "lucide-react";
import { initializeDatabase } from "@/lib/database/initDatabase";
import { setupOneShotSync } from "@/lib/database/sync";
import { storeCredentials, extractStoreIdFromEmail, getAppServicesUrl, getScopeNameFromStoreId } from "@/lib/auth";
import { toast } from "sonner";

interface DemoCredential {
  email: string;
  password: string;
  appEndpoint: string;
}

const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    email: "nyc-store-01@supermarket.com",
    password: "P@ssword1",
    appEndpoint: "supermarket-nyc"
  },
  {
    email: "aa-store-01@supermarket.com",
    password: "P@ssword1",
    appEndpoint: "supermarket-aa"
  }
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoDialog, setShowDemoDialog] = useState(false);

  // Set solid background color for the entire page
  useEffect(() => {
    const originalBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#f1c48d';
    
    return () => {
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    setError("");
    setLoading(true);
    setShowDemoDialog(false);

    try {
      // Extract store ID from email
      const storeId = extractStoreIdFromEmail(loginEmail);
      console.log('📧 Extracted store ID:', storeId);
      
      // Initialize database for this store
      console.log('💾 Initializing database...');
      const db = await initializeDatabase(storeId);
      console.log('✅ Database initialized');
      
      // Get App Services URL from environment
      const syncUrl = getAppServicesUrl();
      console.log('🌐 App Services URL:', syncUrl);

      // Set up one-shot profile sync
      console.log('🔄 Starting one-shot profile sync...');
      const profileReplicator = setupOneShotSync(db, {
        url: syncUrl,
        username: loginEmail,
        password: loginPassword,
        storeId: storeId,
      });

      // Run one-shot sync and wait for completion
      await new Promise((resolve, reject) => {
        let hasError = false;

        profileReplicator.onStatusChange = (status: any) => {
          const activity = status.activity || status.status;
          console.log('🔄 Profile sync status:', activity, status);
          
          if (status.error) {
            hasError = true;
            const errorMsg = status.error.message || 'Authentication failed';
            console.error('❌ Profile sync error:', errorMsg);
            
            // Check for auth error
            if (errorMsg.includes('401') || errorMsg.includes('auth')) {
              reject(new Error('Invalid email or password'));
            } else {
              reject(new Error(`Sync failed: ${errorMsg}`));
            }
          }
          
          if ((activity === 'stopped' || activity === 'idle') && !hasError) { 
            console.log('✅ Profile sync complete');
            resolve(true);
          }
        };

        // Start the replication
        profileReplicator.run().catch(reject);
      });

      // Check if profile was actually downloaded
      const scopeName = getScopeNameFromStoreId(storeId);
      const profileCollectionName = `${scopeName}.profile` as any;
      const profileCount = await db.collections[profileCollectionName].count();
      console.log(`📊 Profile collection has ${profileCount} documents`);
      
      if (profileCount === 0) {
        throw new Error('No profile found for this store. Please contact support.');
      }

      // Store credentials for continuous sync
      storeCredentials(loginEmail, loginPassword);
      console.log('✅ Credentials stored successfully');

      // Show success message
      toast.success("Login successful!", {
        description: `Welcome to ${storeId}`,
      });

      // Reload page to reinitialize app with database context
      window.location.href = '/dashboard';
      
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error("Login failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const handleDemoCredentialSelect = async (credential: DemoCredential) => {
    await performLogin(credential.email, credential.password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 md:p-8" style={{ backgroundColor: '#f1c48d' }}>
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md space-y-8">
        {/* Header with Shopping Cart Icon */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="h-12 w-12 text-white" strokeWidth={2} />
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Grocery Inventory
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-medium">
              Management System
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-white">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-14 pl-12 pr-4 bg-white/90 border-0 rounded-xl text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-white">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-14 pl-12 pr-12 bg-white/90 border-0 rounded-xl text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={!email || !password || loading}
              className="w-full h-14 bg-[#D4945A] hover:bg-[#C8844A] text-white text-base font-semibold rounded-xl border-0 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>

            {/* View Demo Credentials Button */}
            <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  disabled={loading}
                  className="w-full h-14 bg-transparent text-[#D4945A] text-base font-semibold rounded-xl border-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:bg-white/10"
                >
                  <Info className="h-5 w-5 mr-2" />
                  View Demo Credentials
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#F5E5D8] border-0">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">Demo Credentials</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Click on a credential to sign in automatically
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                  {DEMO_CREDENTIALS.map((credential, index) => (
                    <button
                      key={index}
                      onClick={() => handleDemoCredentialSelect(credential)}
                      disabled={loading}
                      className="w-full text-left p-4 rounded-xl bg-white hover:bg-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <div className="font-medium text-sm text-gray-800">{credential.email}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        App Endpoint: {credential.appEndpoint}
                      </div>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </form>
        </div>
      </div>

      {/* Powered by Couchbase - Bottom */}
      <div className="flex flex-col items-center space-y-3 pb-4">
        <img
          src="/images/couchbase-logo.png"
          alt="Couchbase"
          className="h-12 w-12 object-contain"
        />
        <p className="text-[#D4945A] text-base font-medium">
          Powered by Couchbase
        </p>
      </div>
    </div>
  );
};

export default Login;