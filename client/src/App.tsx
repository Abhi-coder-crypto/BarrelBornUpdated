import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "@/pages/welcome";
import MenuLanding from "@/pages/menu-landing";
import CategorySelection from "@/pages/category-selection";
import SubcategoryProducts from "@/pages/subcategory-products";
import Customers from "@/pages/customers";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const isAuthenticated = localStorage.getItem("admin_auth") === "true";
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/menu" component={MenuLanding} />
      <Route path="/menu/:category" component={CategorySelection} />
      <Route path="/menu/:category/:subcategory" component={SubcategoryProducts} />
      <Route path="/login" component={LoginPage} />
      <Route path="/customers">
        {() => <ProtectedRoute component={Customers} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
