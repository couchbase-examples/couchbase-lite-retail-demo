import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Construction } from "lucide-react";

const Merchandising = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <ShoppingCart className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Merchandising</h1>
                <p className="text-sm text-muted-foreground">
                  Product displays and promotional management
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="shadow-medium border border-border/50 max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-accent/10">
                <Construction className="h-12 w-12 text-accent" />
              </div>
            </div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              The Merchandising module is currently under development.
            </p>
            <p className="text-muted-foreground">
              This section will include features for managing product displays, 
              promotional campaigns, and visual merchandising tools.
            </p>
            <div className="pt-6">
              <Button onClick={() => navigate("/dashboard")}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Merchandising;