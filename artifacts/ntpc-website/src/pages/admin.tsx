import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminLogin,
  useListSupportSubmissions,
  useListMembershipRequests,
  useListPosts,
  useListEvents,
  useCreatePost,
  useDeletePost,
  useCreateEvent,
  useDeleteEvent,
  useCreateScripture,
  getListSupportSubmissionsQueryKey,
  getListMembershipRequestsQueryKey,
  getListPostsQueryKey,
  getListEventsQueryKey,
  getGetLatestScriptureQueryKey,
} from "@workspace/api-client-react";
import { useAuthStore } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/language-provider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Trash2, Plus, BookOpen, Calendar, Users, HeartHandshake, BookMarked, Shield } from "lucide-react";
import { format } from "date-fns";

const loginSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});
type LoginValues = z.infer<typeof loginSchema>;

const postSchema = z.object({
  title: z.string().min(1, "Title required"),
  highlights: z.string().min(1, "Highlights required"),
  photoUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
});
type PostValues = z.infer<typeof postSchema>;

const eventSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().min(1, "Description required"),
  date: z.string().min(1, "Date required"),
  imageUrl: z.string().optional(),
});
type EventValues = z.infer<typeof eventSchema>;

const scriptureSchema = z.object({
  verse: z.string().min(1, "Verse required"),
  reference: z.string().min(1, "Reference required"),
});
type ScriptureValues = z.infer<typeof scriptureSchema>;

function LoginForm() {
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
        if (res.role === "admin") {
          storeLogin(res.role, res.token);
          toast({ title: "Logged in as Admin" });
        } else {
          toast({ title: "Access denied", description: "Admin credentials required", variant: "destructive" });
        }
      },
      onError: () => {
        toast({ title: "Invalid credentials", variant: "destructive" });
      },
    });
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-serif text-2xl">{language === 'am' ? 'አስተዳዳሪ ግቤት' : 'Admin Login'}</CardTitle>
          <p className="text-sm text-muted-foreground">Admin access only</p>
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

function AdminDashboard() {
  const { language } = useLanguage();
  const { logout } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: supportList = [], isLoading: loadingSupport } = useListSupportSubmissions();
  const { data: memberList = [], isLoading: loadingMembers } = useListMembershipRequests();
  const { data: posts = [], isLoading: loadingPosts } = useListPosts();
  const { data: events = [], isLoading: loadingEvents } = useListEvents();

  const createPost = useCreatePost();
  const deletePost = useDeletePost();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const createScripture = useCreateScripture();

  const postForm = useForm<PostValues>({ resolver: zodResolver(postSchema), defaultValues: { title: "", highlights: "", photoUrl: "", facebookUrl: "", youtubeUrl: "" } });
  const eventForm = useForm<EventValues>({ resolver: zodResolver(eventSchema), defaultValues: { title: "", description: "", date: "", imageUrl: "" } });
  const scriptureForm = useForm<ScriptureValues>({ resolver: zodResolver(scriptureSchema), defaultValues: { verse: "", reference: "" } });

  function handleCreatePost(data: PostValues) {
    createPost.mutate({ data: { ...data, photoUrl: data.photoUrl || undefined, facebookUrl: data.facebookUrl || undefined, youtubeUrl: data.youtubeUrl || undefined } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() }); postForm.reset(); toast({ title: "Post created!" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  function handleDeletePost(id: number) {
    deletePost.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() }); toast({ title: "Post deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  function handleCreateEvent(data: EventValues) {
    createEvent.mutate({ data: { ...data, imageUrl: data.imageUrl || undefined } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() }); eventForm.reset(); toast({ title: "Event created!" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  function handleDeleteEvent(id: number) {
    deleteEvent.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() }); toast({ title: "Event deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  function handleCreateScripture(data: ScriptureValues) {
    createScripture.mutate({ data }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetLatestScriptureQueryKey() }); scriptureForm.reset(); toast({ title: "Daily scripture updated!" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold flex items-center gap-2"><Shield className="h-6 w-6" /> Admin Panel</h1>
            <p className="text-primary-foreground/70 text-sm mt-1">NTPC Administration Dashboard</p>
          </div>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 rounded-full gap-2" onClick={logout} data-testid="button-logout">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="posts">
          <TabsList className="flex flex-wrap h-auto gap-1 mb-8">
            <TabsTrigger value="posts" className="gap-2"><BookOpen className="h-4 w-4" /> Posts</TabsTrigger>
            <TabsTrigger value="events" className="gap-2"><Calendar className="h-4 w-4" /> Events</TabsTrigger>
            <TabsTrigger value="scripture" className="gap-2"><BookMarked className="h-4 w-4" /> Scripture</TabsTrigger>
            <TabsTrigger value="support" className="gap-2"><HeartHandshake className="h-4 w-4" /> Support ({supportList.length})</TabsTrigger>
            <TabsTrigger value="members" className="gap-2"><Users className="h-4 w-4" /> Members ({memberList.length})</TabsTrigger>
          </TabsList>

          {/* POSTS */}
          <TabsContent value="posts" className="space-y-8">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Create New Post</CardTitle></CardHeader>
              <CardContent>
                <Form {...postForm}>
                  <form onSubmit={postForm.handleSubmit(handleCreatePost)} className="space-y-4">
                    <FormField control={postForm.control} name="title" render={({ field }) => (
                      <FormItem><FormLabel>Sermon Title</FormLabel><FormControl><Input data-testid="input-postTitle" placeholder="Title of the sermon..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={postForm.control} name="highlights" render={({ field }) => (
                      <FormItem><FormLabel>Highlights</FormLabel><FormControl><Textarea data-testid="input-postHighlights" rows={4} placeholder="Key highlights from the sermon..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField control={postForm.control} name="photoUrl" render={({ field }) => (
                        <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input data-testid="input-postPhotoUrl" placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={postForm.control} name="facebookUrl" render={({ field }) => (
                        <FormItem><FormLabel>Facebook URL</FormLabel><FormControl><Input data-testid="input-postFacebookUrl" placeholder="https://facebook.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={postForm.control} name="youtubeUrl" render={({ field }) => (
                        <FormItem><FormLabel>YouTube URL</FormLabel><FormControl><Input data-testid="input-postYoutubeUrl" placeholder="https://youtube.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <Button type="submit" className="rounded-full gap-2" disabled={createPost.isPending} data-testid="button-createPost">
                      <Plus className="h-4 w-4" /> {createPost.isPending ? "Creating..." : "Create Post"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-xl">All Posts</h3>
              {loadingPosts ? <Skeleton className="h-24" /> : posts.map(post => (
                <Card key={post.id} data-testid={`card-admin-post-${post.id}`}>
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{post.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{post.highlights}</p>
                      <p className="text-xs text-muted-foreground mt-1">{format(new Date(post.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => handleDeletePost(post.id)} disabled={deletePost.isPending} data-testid={`button-deletePost-${post.id}`} className="shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* EVENTS */}
          <TabsContent value="events" className="space-y-8">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Create New Event</CardTitle></CardHeader>
              <CardContent>
                <Form {...eventForm}>
                  <form onSubmit={eventForm.handleSubmit(handleCreateEvent)} className="space-y-4">
                    <FormField control={eventForm.control} name="title" render={({ field }) => (
                      <FormItem><FormLabel>Event Title</FormLabel><FormControl><Input data-testid="input-eventTitle" placeholder="Event name..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={eventForm.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea data-testid="input-eventDescription" rows={3} placeholder="Description..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={eventForm.control} name="date" render={({ field }) => (
                        <FormItem><FormLabel>Date</FormLabel><FormControl><Input data-testid="input-eventDate" type="date" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={eventForm.control} name="imageUrl" render={({ field }) => (
                        <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input data-testid="input-eventImageUrl" placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <Button type="submit" className="rounded-full gap-2" disabled={createEvent.isPending} data-testid="button-createEvent">
                      <Plus className="h-4 w-4" /> {createEvent.isPending ? "Creating..." : "Create Event"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-xl">All Events</h3>
              {loadingEvents ? <Skeleton className="h-24" /> : events.map(event => (
                <Card key={event.id} data-testid={`card-admin-event-${event.id}`}>
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{format(new Date(event.date), 'MMMM d, yyyy')}</p>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteEvent(event.id)} disabled={deleteEvent.isPending} data-testid={`button-deleteEvent-${event.id}`} className="shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SCRIPTURE */}
          <TabsContent value="scripture">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BookMarked className="h-5 w-5 text-primary" /> Post Daily Scripture</CardTitle></CardHeader>
              <CardContent>
                <Form {...scriptureForm}>
                  <form onSubmit={scriptureForm.handleSubmit(handleCreateScripture)} className="space-y-4">
                    <FormField control={scriptureForm.control} name="verse" render={({ field }) => (
                      <FormItem><FormLabel>Verse Text</FormLabel><FormControl><Textarea data-testid="input-scriptureVerse" rows={4} placeholder="ለኔ ህይወት ክርስቶስ ነዉ!" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={scriptureForm.control} name="reference" render={({ field }) => (
                      <FormItem><FormLabel>Reference</FormLabel><FormControl><Input data-testid="input-scriptureReference" placeholder="e.g. Philippians 1:21" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" className="rounded-full gap-2" disabled={createScripture.isPending} data-testid="button-createScripture">
                      <Plus className="h-4 w-4" /> {createScripture.isPending ? "Saving..." : "Post Scripture"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUPPORT SUBMISSIONS */}
          <TabsContent value="support">
            <h3 className="font-serif font-bold text-xl mb-6">Ministry Support Submissions ({supportList.length})</h3>
            {loadingSupport ? <Skeleton className="h-24" /> : supportList.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><HeartHandshake className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>No submissions yet</p></div>
            ) : (
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {["Name", "Phone", "Email", "Occupation", "Month", "Year", "Reason", "Date"].map(h => (
                        <th key={h} className="text-left p-3 font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {supportList.map((s) => (
                      <tr key={s.id} data-testid={`row-support-${s.id}`} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="p-3 whitespace-nowrap font-medium">{s.firstName} {s.middleName} {s.lastName}</td>
                        <td className="p-3 whitespace-nowrap">{s.phone}</td>
                        <td className="p-3 whitespace-nowrap">{s.email}</td>
                        <td className="p-3 whitespace-nowrap">{s.occupation}</td>
                        <td className="p-3 whitespace-nowrap">{s.amountPerMonth} ETB</td>
                        <td className="p-3 whitespace-nowrap">{s.amountPerYear} ETB</td>
                        <td className="p-3 max-w-[200px] truncate">{s.reason}</td>
                        <td className="p-3 whitespace-nowrap text-muted-foreground">{format(new Date(s.createdAt), 'MMM d, yyyy')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* MEMBERSHIP */}
          <TabsContent value="members">
            <h3 className="font-serif font-bold text-xl mb-6">Membership Requests ({memberList.length})</h3>
            {loadingMembers ? <Skeleton className="h-24" /> : memberList.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><Users className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>No membership requests yet</p></div>
            ) : (
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {["Name", "Phone", "Email", "Occupation", "Prev. Church", "Serving As", "Baptized", "Date"].map(h => (
                        <th key={h} className="text-left p-3 font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {memberList.map((m) => (
                      <tr key={m.id} data-testid={`row-member-${m.id}`} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="p-3 whitespace-nowrap font-medium">{m.firstName} {m.middleName} {m.lastName}</td>
                        <td className="p-3 whitespace-nowrap">{m.phone}</td>
                        <td className="p-3 whitespace-nowrap">{m.email}</td>
                        <td className="p-3 whitespace-nowrap">{m.occupation}</td>
                        <td className="p-3 whitespace-nowrap">{m.previousChurch}</td>
                        <td className="p-3 whitespace-nowrap">{m.servingAs || "—"}</td>
                        <td className="p-3"><Badge variant={m.baptized ? "default" : "secondary"}>{m.baptized ? "Yes" : "No"}</Badge></td>
                        <td className="p-3 whitespace-nowrap text-muted-foreground">{format(new Date(m.createdAt), 'MMM d, yyyy')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Admin() {
  const { role } = useAuthStore();
  if (role !== "admin") return <LoginForm />;
  return <AdminDashboard />;
}
