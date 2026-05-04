import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { LanguageProvider } from "@/lib/language-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Departments from "@/pages/departments";
import DepartmentDetail from "@/pages/department-detail";
import Programs from "@/pages/programs";
import Events from "@/pages/events";
import Posts from "@/pages/posts";
import PostDetail from "@/pages/post-detail";
import Youth from "@/pages/youth";
import Support from "@/pages/support";
import Join from "@/pages/join";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import Members from "@/pages/members";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/members" component={Members} />
      <Route>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/departments/:id" component={DepartmentDetail} />
              <Route path="/departments" component={Departments} />
              <Route path="/programs" component={Programs} />
              <Route path="/events" component={Events} />
              <Route path="/posts/:id" component={PostDetail} />
              <Route path="/posts" component={Posts} />
              <Route path="/youth" component={Youth} />
              <Route path="/support" component={Support} />
              <Route path="/join" component={Join} />
              <Route path="/contact" component={Contact} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ntpc-theme">
        <LanguageProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
