import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useAdminLogin,
  useListMembershipRequests,
  getListMembershipRequestsQueryKey,
} from "@workspace/api-client-react";
import { useAuthStore } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/language-provider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Users, Shield } from "lucide-react";
import { format } from "date-fns";

const loginSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});
type LoginValues = z.infer<typeof loginSchema>;

function MembersLoginForm() {
  const { language } = useLanguage();
  const login = useAdminLogin();
  const { login: storeLogin } = useAuthStore();
  const { toast } = useToast();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });
  function onSubmit(data: LoginValues) {
    login.mutate({ data }, {
      onSuccess: (res) => {
        if (res.role === "members" || res.role === "admin") {
          storeLogin(res.role, res.token);
          toast({ title: `Logged in as ${res.role}` });
        } else {
          toast({ title: "Access denied", variant: "destructive" });
        }
      },
      onError: () => toast({ title: "Invalid credentials", variant: "destructive" }),
    });
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-serif text-2xl">{language === 'am' ? 'አባላት ግቤት' : 'Members Login'}</CardTitle>
          <p className="text-sm text-muted-foreground">Department heads and admin access</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem><FormLabel>Username</FormLabel><FormControl><Input data-testid="input-username" autoComplete="username" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl><Input data-testid="input-password" type="password" autoComplete="current-password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full rounded-full" disabled={login.isPending} data-testid="button-login">
                {login.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function MembersDashboard() {
  const { language } = useLanguage();
  const { logout, role } = useAuthStore();
  const { data: memberList = [], isLoading } = useListMembershipRequests({
    query: { queryKey: getListMembershipRequestsQueryKey() },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              {language === 'am' ? 'የአባልነት ጥያቄዎች' : 'Membership Requests'}
            </h1>
            <p className="text-primary-foreground/70 text-sm mt-1">
              {role === 'admin' ? 'Admin View' : 'Department Head View'}
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 rounded-full gap-2" onClick={logout} data-testid="button-logout">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold">
            {language === 'am' ? 'ሁሉም የአባልነት ጥያቄዎች' : 'All Membership Requests'}
          </h2>
          <Badge variant="secondary" className="text-base px-4 py-1">
            {memberList.length} {language === 'am' ? 'ጥያቄዎች' : 'requests'}
          </Badge>
        </div>

        {isLoading ? (
          <Skeleton className="h-48 rounded-2xl" />
        ) : memberList.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-serif">{language === 'am' ? 'ምንም ጥያቄዎች የሉም' : 'No membership requests yet'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["#", "Full Name", "Phone", "Email", "Address", "Occupation", "Prev. Church", "Serving As", "Baptized", "Date"].map((h) => (
                    <th key={h} className="text-left p-4 font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {memberList.map((m, idx) => (
                  <tr key={m.id} data-testid={`row-member-${m.id}`} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-muted-foreground">{idx + 1}</td>
                    <td className="p-4 whitespace-nowrap font-medium">{m.firstName} {m.middleName} {m.lastName}</td>
                    <td className="p-4 whitespace-nowrap">{m.phone}</td>
                    <td className="p-4 whitespace-nowrap">{m.email}</td>
                    <td className="p-4 whitespace-nowrap">{m.address}</td>
                    <td className="p-4 whitespace-nowrap">{m.occupation}</td>
                    <td className="p-4 whitespace-nowrap">{m.previousChurch}</td>
                    <td className="p-4 whitespace-nowrap">{m.servingAs || "—"}</td>
                    <td className="p-4">
                      <Badge variant={m.baptized ? "default" : "secondary"}>{m.baptized ? "Yes" : "No"}</Badge>
                    </td>
                    <td className="p-4 whitespace-nowrap text-muted-foreground">{format(new Date(m.createdAt), 'MMM d, yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Members() {
  const { role } = useAuthStore();
  if (!role || (role !== "members" && role !== "admin")) return <MembersLoginForm />;
  return <MembersDashboard />;
}
