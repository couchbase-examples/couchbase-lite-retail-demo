import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, AlertCircle, Loader2, Eye, EyeOff, Info } from "lucide-react";
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
    appEndpoint: "supermarket-aa"
  },
  {
    email: "aa-store-01@supermarket.com",
    password: "P@ssword1",
    appEndpoint: "supermarket-nyc"
  }
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoDialog, setShowDemoDialog] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="absolute inset-0 bg-gradient-warm opacity-50 pointer-events-none"></div>
      
      <Card className="w-full max-w-md shadow-strong border-0 bg-card/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Package className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Inventory Pro</CardTitle>
            <CardDescription className="text-base">
              Employee login to access inventory management
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="store-id@supermarket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Example: nyc-store-01@supermarket.com
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative" style={{ isolation: 'isolate' }}>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground pointer-events-auto"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 text-base"
              disabled={!email || !password || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 text-base"
                  disabled={loading}
                >
                  <Info className="h-4 w-4 mr-2" />
                  View Demo Credentials
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Demo Credentials</DialogTitle>
                  <DialogDescription>
                    Click on a credential to sign in automatically
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                  {DEMO_CREDENTIALS.map((credential, index) => (
                    <button
                      key={index}
                      onClick={() => handleDemoCredentialSelect(credential)}
                      disabled={loading}
                      className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="font-medium text-sm">{credential.email}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        App Endpoint: {credential.appEndpoint}
                      </div>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;