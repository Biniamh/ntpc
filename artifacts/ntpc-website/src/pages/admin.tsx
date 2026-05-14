import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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
  useUpdatePost,
  useUpdateEvent,
  useCreateScripture,
  getListSupportSubmissionsQueryKey,
  getListMembershipRequestsQueryKey,
  getListPostsQueryKey,
  getListEventsQueryKey,
  getGetLatestScriptureQueryKey,
  useListEyEvents,
  useListEyRounds,
  useListEyParticipants,
  useListEyCoordinators,
  useCreateEyEvent,
  useDeleteEyEvent,
  useUpdateEyEvent,
  useCreateEyRound,
  useDeleteEyRound,
  useUpdateEyRound,
  useCreateEyCoordinator,
  useDeleteEyCoordinator,
  useUpdateEyCoordinator,
  useUpdateEyParticipant,
  useDeleteEyParticipant,
  getListEyEventsQueryKey,
  getListEyRoundsQueryKey,
  getListEyParticipantsQueryKey,
  getListEyCoordinatorsQueryKey,
} from "@workspace/api-client-react";
import { useAuthStore } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/language-provider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Trash2, Plus, BookOpen, Calendar, Users, HeartHandshake, BookMarked, Shield, Church, Star, Target, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { DataTable } from "@/components/DataTable";
import { PostEditDialog } from "@/components/PostEditDialog";
import { EventEditDialog } from "@/components/EventEditDialog";
import { BadgeGenerationModal } from "@/components/BadgeGenerationModal";

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

const eyEventSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().min(1, "Description required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  imageUrl: z.string().optional(),
  type: z.string().min(1, "Type required"),
  year: z.coerce.number().min(2000, "Valid year required"),
});
type EyEventValues = z.infer<typeof eyEventSchema>;

const eyRoundSchema = z.object({
  eventId: z.coerce.number().min(1, "Event required"),
  roundNumber: z.coerce.number().min(1, "Round number required"),
  capacity: z.coerce.number().min(1, "Capacity required"),
  fromDate: z.string().min(1, "Round start date required"),
  toDate: z.string().min(1, "Round end date required"),
});
type EyRoundValues = z.infer<typeof eyRoundSchema>;

const eyCoordinatorSchema = z.object({
  name: z.string().min(1, "Name required"),
  phone: z.string().min(1, "Phone required"),
  email: z.string().min(1, "Email required"),
});
type EyCoordinatorValues = z.infer<typeof eyCoordinatorSchema>;

const eyParticipantEditSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  city: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  faydaVerified: z.boolean().optional(),
  paymentStatus: z.boolean().optional(),
  coordinatorId: z.coerce.number().optional(),
  roundId: z.coerce.number().optional(),
  eventId: z.coerce.number().optional(),
});
type EyParticipantEditValues = z.infer<typeof eyParticipantEditSchema>;

function LoginForm() {
  const { language, setLanguage, t } = useLanguage();
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
          toast({ title: t.admin.login.logged_in });
        } else {
          toast({ title: t.admin.login.access_denied, description: t.admin.login.access_denied_desc, variant: "destructive" });
        }
      },
      onError: () => {
        toast({ title: t.admin.login.invalid_credentials, variant: "destructive" });
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <CardTitle className="font-serif text-2xl">{t.admin.login.title}</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setLanguage(language === "en" ? "am" : "en")}>{language === "en" ? "EN" : "አማ"}</Button>
          </div>
          <p className="text-sm text-muted-foreground">{t.admin.login.subtitle}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem><FormLabel>{t.admin.login.username}</FormLabel><FormControl><Input data-testid="input-username" autoComplete="username" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>{t.admin.login.password}</FormLabel><FormControl><Input data-testid="input-password" type="password" autoComplete="current-password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full rounded-full" disabled={login.isPending} data-testid="button-login">
                {login.isPending ? t.admin.login.logging_in : t.admin.login.login}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboard() {
  const { language, setLanguage, t } = useLanguage();
  const { logout } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Active section state
  const [activeSection, setActiveSection] = useState<'church' | 'ey'>('church');

  const { data: supportList = [], isLoading: loadingSupport } = useListSupportSubmissions();
  const { data: memberList = [], isLoading: loadingMembers } = useListMembershipRequests();
  const { data: posts = [], isLoading: loadingPosts } = useListPosts();
  const { data: events = [], isLoading: loadingEvents } = useListEvents();

  // EY hooks
  const { data: eyEvents = [], isLoading: loadingEyEvents } = useListEyEvents();
  const { data: eyRounds = [], isLoading: loadingEyRounds } = useListEyRounds();
  const { data: eyParticipants = [], isLoading: loadingEyParticipants } = useListEyParticipants();
  const { data: eyCoordinators = [], isLoading: loadingEyCoordinators } = useListEyCoordinators();

  const createPost = useCreatePost();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const updateEvent = useUpdateEvent();
  const createScripture = useCreateScripture();

  // EY mutations
  const createEyEvent = useCreateEyEvent();
  const deleteEyEvent = useDeleteEyEvent();
  const updateEyEvent = useUpdateEyEvent();
  const createEyRound = useCreateEyRound();
  const deleteEyRound = useDeleteEyRound();
  const updateEyRound = useUpdateEyRound();
  const createEyCoordinator = useCreateEyCoordinator();
  const deleteEyCoordinator = useDeleteEyCoordinator();
  const updateEyCoordinator = useUpdateEyCoordinator();
  const updateEyParticipantMutation = useUpdateEyParticipant();
  const deleteEyParticipantMutation = useDeleteEyParticipant();
  const generateBadgeMutation = useMutation({
    mutationFn: async (participantId: number) => {
      const response = await fetch(`/api/ey-participants/${participantId}/generate-badge`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to generate badge");
      // The API updates the database and returns HTML, we just need success confirmation
      return { success: true };
    },
    onSuccess: () => {
      // Badge was successfully generated and marked in the database
      queryClient.invalidateQueries({ queryKey: getListEyParticipantsQueryKey() });
      setShowBadgeModal(false);
      setBadgeParticipant(null);
      toast({
        title: "Badge Generated Successfully!",
        description: "The badge has been generated and saved. The participant list has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error generating badge",
        description: error.message || "Failed to generate badge",
        variant: "destructive",
      });
    },
  });

  // Edit dialog states
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [editingEyEvent, setEditingEyEvent] = useState<any>(null);
  const [editingEyRound, setEditingEyRound] = useState<any>(null);
  const [editingEyParticipant, setEditingEyParticipant] = useState<any>(null);
  const [editingEyCoordinator, setEditingEyCoordinator] = useState<any>(null);
  const [postEditOpen, setPostEditOpen] = useState(false);
  const [eventEditOpen, setEventEditOpen] = useState(false);
  const [eyEventEditOpen, setEyEventEditOpen] = useState(false);
  const [eyRoundEditOpen, setEyRoundEditOpen] = useState(false);
  const [eyParticipantEditOpen, setEyParticipantEditOpen] = useState(false);
  const [eyCoordinatorEditOpen, setEyCoordinatorEditOpen] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeParticipant, setBadgeParticipant] = useState<any>(null);

  const postForm = useForm<PostValues>({ resolver: zodResolver(postSchema), defaultValues: { title: "", highlights: "", photoUrl: "", facebookUrl: "", youtubeUrl: "" } });
  const eventForm = useForm<EventValues>({ resolver: zodResolver(eventSchema), defaultValues: { title: "", description: "", date: "", imageUrl: "" } });
  const scriptureForm = useForm<ScriptureValues>({ resolver: zodResolver(scriptureSchema), defaultValues: { verse: "", reference: "" } });

  // EY forms
  const eyEventForm = useForm<EyEventValues>({ resolver: zodResolver(eyEventSchema), defaultValues: { title: "", description: "", startDate: "", endDate: "", imageUrl: "", type: "", year: new Date().getFullYear() } });
  const eyRoundForm = useForm<EyRoundValues>({ resolver: zodResolver(eyRoundSchema), defaultValues: { eventId: 0, roundNumber: 1, capacity: 50, fromDate: "", toDate: "" } });
  const eyCoordinatorForm = useForm<EyCoordinatorValues>({ resolver: zodResolver(eyCoordinatorSchema), defaultValues: { name: "", phone: "", email: "" } });
  const eyEventEditForm = useForm<EyEventValues>({ resolver: zodResolver(eyEventSchema), defaultValues: { title: "", description: "", startDate: "", endDate: "", imageUrl: "", type: "", year: new Date().getFullYear() } });
  const eyRoundEditForm = useForm<EyRoundValues>({ resolver: zodResolver(eyRoundSchema), defaultValues: { eventId: 0, roundNumber: 1, capacity: 50, fromDate: "", toDate: "" } });
  const eyParticipantEditForm = useForm<EyParticipantEditValues>({ resolver: zodResolver(eyParticipantEditSchema), defaultValues: { firstName: "", lastName: "", city: "", phoneNumber: "", email: "", faydaVerified: false, paymentStatus: false, coordinatorId: 0, roundId: 0, eventId: 0 } });
  const eyCoordinatorEditForm = useForm<EyCoordinatorValues>({ resolver: zodResolver(eyCoordinatorSchema), defaultValues: { name: "", phone: "", email: "" } });

  function handleCreatePost(data: PostValues) {
    createPost.mutate({ data: { ...data, photoUrl: data.photoUrl || undefined, facebookUrl: data.facebookUrl || undefined, youtubeUrl: data.youtubeUrl || undefined } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() }); postForm.reset(); toast({ title: t.admin.posts.created }); },
      onError: () => toast({ title: t.admin.common.error, variant: "destructive" }),
    });
  }

  function handleDeletePost(id: number) {
    deletePost.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() }); toast({ title: t.admin.posts.deleted }); },
      onError: () => toast({ title: t.admin.common.error, variant: "destructive" }),
    });
  }

  function handleCreateEvent(data: EventValues) {
    createEvent.mutate({ data: { ...data, imageUrl: data.imageUrl || undefined } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() }); eventForm.reset(); toast({ title: t.admin.events.created }); },
      onError: () => toast({ title: t.admin.common.error, variant: "destructive" }),
    });
  }

  function handleDeleteEvent(id: number) {
    deleteEvent.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() }); toast({ title: t.admin.events.deleted }); },
      onError: () => toast({ title: t.admin.common.error, variant: "destructive" }),
    });
  }

  function handleCreateScripture(data: ScriptureValues) {
    createScripture.mutate({ data }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetLatestScriptureQueryKey() }); scriptureForm.reset(); toast({ title: t.admin.scripture.updated }); },
      onError: () => toast({ title: t.admin.common.error, variant: "destructive" }),
    });
  }

  function handleEditPost(post: any) {
    setEditingPost(post);
    setPostEditOpen(true);
  }

  function handleEditEvent(event: any) {
    setEditingEvent(event);
    setEventEditOpen(true);
  }

  function handleSavePost(data: any) {
    updatePost.mutate({ id: editingPost.id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
        setPostEditOpen(false);
        setEditingPost(null);
        toast({ title: t.admin.posts.updated });
      },
      onError: () => toast({ title: t.admin.posts.update_error, variant: "destructive" }),
    });
  }

  function handleSaveEvent(data: any) {
    updateEvent.mutate({ id: editingEvent.id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
        setEventEditOpen(false);
        setEditingEvent(null);
        toast({ title: "Event updated!" });
      },
      onError: () => toast({ title: "Error updating event", variant: "destructive" }),
    });
  }

  function handleEditEyEvent(event: any) {
    setEditingEyEvent(event);
    eyEventEditForm.reset({
      title: event.title || "",
      description: event.description || "",
      startDate: event.startDate || "",
      endDate: event.endDate || "",
      imageUrl: event.imageUrl || "",
      type: event.type || "",
      year: event.year || new Date().getFullYear(),
    });
    setEyEventEditOpen(true);
  }

  function handleEditEyRound(round: any) {
    setEditingEyRound(round);
    eyRoundEditForm.reset({
      eventId: round.eventId || 0,
      roundNumber: round.roundNumber || 1,
      capacity: round.capacity || 1,
      fromDate: round.fromDate || "",
      toDate: round.toDate || "",
    });
    setEyRoundEditOpen(true);
  }

  function handleEditEyParticipant(participant: any) {
    setEditingEyParticipant(participant);
    eyParticipantEditForm.reset({
      firstName: participant.firstName || "",
      lastName: participant.lastName || "",
      city: participant.city || "",
      phoneNumber: participant.phoneNumber || "",
      email: participant.email || "",
      faydaVerified: participant.faydaVerified ?? false,
      paymentStatus: participant.paymentStatus ?? false,
      coordinatorId: participant.coordinatorId || 0,
      eventId: participant.eventId || 0,
      roundId: participant.roundId || 0,
    });
    setEyParticipantEditOpen(true);
  }

  function handleEditEyCoordinator(coordinator: any) {
    setEditingEyCoordinator(coordinator);
    eyCoordinatorEditForm.reset({
      name: coordinator.name || "",
      phone: coordinator.phone || "",
      email: coordinator.email || "",
    });
    setEyCoordinatorEditOpen(true);
  }

  function handleSaveEyEvent(data: EyEventValues) {
    updateEyEvent.mutate({ id: editingEyEvent.id, data: { ...data, imageUrl: data.imageUrl || undefined } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEyEventsQueryKey() });
        setEyEventEditOpen(false);
        setEditingEyEvent(null);
        toast({ title: "EY Event updated!" });
      },
      onError: () => toast({ title: "Error updating EY event", variant: "destructive" }),
    });
  }

  function handleSaveEyRound(data: EyRoundValues) {
    const selectedEvent = eyEvents.find(event => event.id === data.eventId);
    if (!selectedEvent) {
      toast({ title: "Error", description: "Selected event not found", variant: "destructive" });
      return;
    }
    const eventStart = new Date(selectedEvent.startDate);
    const eventEnd = new Date(selectedEvent.endDate);
    const roundStart = new Date(data.fromDate);
    const roundEnd = new Date(data.toDate);

    if (roundStart < eventStart || roundEnd > eventEnd) {
      toast({ title: "Invalid Dates", description: "Round dates must be within the event's start and end dates", variant: "destructive" });
      return;
    }

    updateEyRound.mutate({ id: editingEyRound.id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEyRoundsQueryKey() });
        setEyRoundEditOpen(false);
        setEditingEyRound(null);
        toast({ title: "EY Round updated!" });
      },
      onError: () => toast({ title: "Error updating round", variant: "destructive" }),
    });
  }

  function handleSaveEyParticipant(data: any) {
    // Convert string values from select elements to numbers
    const convertedData = {
      ...data,
      coordinatorId: data.coordinatorId ? Number(data.coordinatorId) : 0,
      roundId: data.roundId ? Number(data.roundId) : 0,
      eventId: data.eventId ? Number(data.eventId) : 0,
    };
    updateEyParticipantMutation.mutate({ id: editingEyParticipant.id, data: convertedData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEyParticipantsQueryKey() });
        setEyParticipantEditOpen(false);
        setEditingEyParticipant(null);
        toast({ title: "Participant updated!" });
      },
      onError: (error) => toast({ title: "Error updating participant", description: error.message, variant: "destructive" }),
    });
  }

  function handleSaveEyCoordinator(data: EyCoordinatorValues) {
    updateEyCoordinator.mutate({ id: editingEyCoordinator.id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEyCoordinatorsQueryKey() });
        setEyCoordinatorEditOpen(false);
        setEditingEyCoordinator(null);
        toast({ title: "Coordinator updated!" });
      },
      onError: () => toast({ title: "Error updating coordinator", variant: "destructive" }),
    });
  }

  // EY handlers
  function handleCreateEyEvent(data: EyEventValues) {
    createEyEvent.mutate({ data: { ...data, imageUrl: data.imageUrl || undefined } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEyEventsQueryKey() }); eyEventForm.reset(); toast({ title: "EY Event created!" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  function handleDeleteEyEvent(id: number) {
    deleteEyEvent.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEyEventsQueryKey() }); toast({ title: "Event deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  function handleCreateEyRound(data: EyRoundValues) {
    const selectedEvent = eyEvents.find(event => event.id === data.eventId);
    if (!selectedEvent) {
      toast({ title: "Error", description: "Selected event not found", variant: "destructive" });
      return;
    }
    const eventStart = new Date(selectedEvent.startDate);
    const eventEnd = new Date(selectedEvent.endDate);
    const roundStart = new Date(data.fromDate);
    const roundEnd = new Date(data.toDate);

    if (roundStart < eventStart || roundEnd > eventEnd) {
      toast({ title: "Invalid Dates", description: "Round dates must be within the event's start and end dates", variant: "destructive" });
      return;
    }

    createEyRound.mutate({ data }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEyRoundsQueryKey() }); eyRoundForm.reset(); toast({ title: "Round created!" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  function handleDeleteEyRound(id: number) {
    deleteEyRound.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEyRoundsQueryKey() }); toast({ title: "Round deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  function handleCreateEyCoordinator(data: EyCoordinatorValues) {
    createEyCoordinator.mutate({ data }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEyCoordinatorsQueryKey() }); eyCoordinatorForm.reset(); toast({ title: "Coordinator added!" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  function handleDeleteEyCoordinator(id: number) {
    deleteEyCoordinator.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEyCoordinatorsQueryKey() }); toast({ title: "Coordinator deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  function handleDeleteEyParticipant(id: number) {
    deleteEyParticipantMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEyParticipantsQueryKey() }); toast({ title: "Participant deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t.admin.sidebar.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{t.admin.sidebar.subtitle}</p>
        </div>

        <div className="flex-1 p-4 space-y-2">
          <Button
            variant={activeSection === 'church' ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
            onClick={() => setActiveSection('church')}
          >
            <Church className="h-4 w-4" />
            {t.admin.sidebar.church_portal}
          </Button>

          <Button
            variant={activeSection === 'ey' ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
            onClick={() => setActiveSection('ey')}
          >
            <Star className="h-4 w-4" />
            {t.admin.sidebar.ey_management}
          </Button>
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" /> {t.admin.sidebar.logout}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-serif font-bold">
            {activeSection === 'church' ? t.admin.header.church_portal : t.admin.header.ey_management}
          </h1>
          <Button size="sm" variant="secondary" onClick={() => setLanguage(language === "en" ? "am" : "en")}>{language === "en" ? "EN" : "አማ"}</Button>
        </div>

        <div className="flex-1 p-6">
          {activeSection === 'church' ? (
            <ChurchPortalContent
              supportList={supportList}
              memberList={memberList}
              posts={posts}
              events={events}
              loadingSupport={loadingSupport}
              loadingMembers={loadingMembers}
              loadingPosts={loadingPosts}
              loadingEvents={loadingEvents}
              postForm={postForm}
              eventForm={eventForm}
              scriptureForm={scriptureForm}
              handleCreatePost={handleCreatePost}
              handleDeletePost={handleDeletePost}
              handleCreateEvent={handleCreateEvent}
              handleDeleteEvent={handleDeleteEvent}
              handleCreateScripture={handleCreateScripture}
              handleEditPost={handleEditPost}
              handleEditEvent={handleEditEvent}
              createPost={createPost}
              createEvent={createEvent}
              createScripture={createScripture}
              editingPost={editingPost}
              editingEvent={editingEvent}
              postEditOpen={postEditOpen}
              eventEditOpen={eventEditOpen}
              setPostEditOpen={setPostEditOpen}
              setEventEditOpen={setEventEditOpen}
              setEditingPost={setEditingPost}
              setEditingEvent={setEditingEvent}
              handleSavePost={handleSavePost}
              handleSaveEvent={handleSaveEvent}
            />
          ) : (
<ExcellentYouthContent
               eyEventForm={eyEventForm}
               eyRoundForm={eyRoundForm}
               eyCoordinatorForm={eyCoordinatorForm}
               eyEvents={eyEvents}
               eyRounds={eyRounds}
               eyParticipants={eyParticipants}
               eyCoordinators={eyCoordinators}
               loadingEyEvents={loadingEyEvents}
               loadingEyRounds={loadingEyRounds}
               loadingEyParticipants={loadingEyParticipants}
               loadingEyCoordinators={loadingEyCoordinators}
               handleCreateEyEvent={handleCreateEyEvent}
               handleDeleteEyEvent={handleDeleteEyEvent}
               handleEditEyEvent={handleEditEyEvent}
               handleCreateEyRound={handleCreateEyRound}
               handleDeleteEyRound={handleDeleteEyRound}
               handleEditEyRound={handleEditEyRound}
               handleCreateEyCoordinator={handleCreateEyCoordinator}
               handleDeleteEyCoordinator={handleDeleteEyCoordinator}
               handleEditEyCoordinator={handleEditEyCoordinator}
               handleDeleteEyParticipant={handleDeleteEyParticipant}
               handleEditEyParticipant={handleEditEyParticipant}
               handleGenerateBadge={(participant: any) => {
                 setBadgeParticipant(participant);
                 setShowBadgeModal(true);
               }}
             />
          )}
        </div>
      </div>

      <Dialog open={eyEventEditOpen} onOpenChange={(open) => {
        if (!open) {
          setEyEventEditOpen(false);
          setEditingEyEvent(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.admin.ey.edit_ey_event}</DialogTitle>
          </DialogHeader>
          <Form {...eyEventEditForm}>
            <form onSubmit={eyEventEditForm.handleSubmit(handleSaveEyEvent)} className="space-y-4">
              <FormField control={eyEventEditForm.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>{t.admin.ey.event_title}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={eyEventEditForm.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>{t.admin.church.description}</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyEventEditForm.control} name="startDate" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.start_date}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyEventEditForm.control} name="endDate" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.end_date}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyEventEditForm.control} name="year" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.year}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyEventEditForm.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.church.image_url}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter>
                <Button type="submit" className="rounded-full">{t.admin.ey.save_event}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={eyRoundEditOpen} onOpenChange={(open) => {
        if (!open) {
          setEyRoundEditOpen(false);
          setEditingEyRound(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.admin.ey.edit_ey_round}</DialogTitle>
          </DialogHeader>
          <Form {...eyRoundEditForm}>
            <form onSubmit={eyRoundEditForm.handleSubmit(handleSaveEyRound)} className="space-y-4">
              <FormField control={eyRoundEditForm.control} name="eventId" render={({ field }) => (
                <FormItem><FormLabel>{t.admin.ey.event}</FormLabel><FormControl>
                  <select {...field} className="w-full rounded-md border border-input px-3 py-2">
                    <option value={0}>{t.admin.ey.select_event}</option>
                    {eyEvents.map((event: any) => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={eyRoundEditForm.control} name="roundNumber" render={({ field }) => (
                <FormItem><FormLabel>{t.admin.ey.round_number}</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={eyRoundEditForm.control} name="capacity" render={({ field }) => (
                <FormItem><FormLabel>{t.admin.ey.capacity}</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyRoundEditForm.control} name="fromDate" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.round_start}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyRoundEditForm.control} name="toDate" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.round_end}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter>
                <Button type="submit" className="rounded-full">{t.admin.ey.save_round}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={eyParticipantEditOpen} onOpenChange={(open) => {
        if (!open) {
          setEyParticipantEditOpen(false);
          setEditingEyParticipant(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.admin.ey.edit_participant}</DialogTitle>
          </DialogHeader>
          <Form {...eyParticipantEditForm}>
            <form onSubmit={eyParticipantEditForm.handleSubmit(handleSaveEyParticipant)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyParticipantEditForm.control} name="firstName" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.first_name}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyParticipantEditForm.control} name="lastName" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.last_name}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyParticipantEditForm.control} name="city" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.city}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyParticipantEditForm.control} name="phoneNumber" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.church.phone}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={eyParticipantEditForm.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>{t.admin.ey.email}</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyParticipantEditForm.control} name="faydaVerified" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>{t.admin.ey.fayda_verified}</FormLabel>
                    <FormControl>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(event) => field.onChange(event.target.checked)}
                          className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                        />
                        {t.admin.ey.verified}
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={eyParticipantEditForm.control} name="paymentStatus" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>{t.admin.ey.paid}</FormLabel>
                    <FormControl>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(event) => field.onChange(event.target.checked)}
                          className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                        />
                        {t.admin.ey.paid}
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyParticipantEditForm.control} name="eventId" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.event}</FormLabel><FormControl>
                    <select {...field} className="w-full rounded-md border border-input px-3 py-2">
                      <option value={0}>{t.admin.ey.select_event}</option>
                      {eyEvents.map((event: any) => (
                        <option key={event.id} value={event.id}>{event.title}</option>
                      ))}
                    </select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyParticipantEditForm.control} name="roundId" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.round}</FormLabel><FormControl>
                    <select {...field} className="w-full rounded-md border border-input px-3 py-2">
                      <option value={0}>{t.admin.ey.select_round}</option>
                      {eyRounds.map((round: any) => (
                        <option key={round.id} value={round.id}>{`${t.admin.ey.round} ${round.roundNumber} (${eyEvents.find((event:any) => event.id === round.eventId)?.title || t.admin.ey.unassigned})`}</option>
                      ))}
                    </select>
                  </FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={eyParticipantEditForm.control} name="coordinatorId" render={({ field }) => (
                <FormItem><FormLabel>{t.admin.ey.coordinator}</FormLabel><FormControl>
                  <select {...field} className="w-full rounded-md border border-input px-3 py-2">
                    <option value={0}>{t.admin.ey.select_coordinator}</option>
                    {eyCoordinators.map((coordinator: any) => (
                      <option key={coordinator.id} value={coordinator.id}>{coordinator.name}</option>
                    ))}
                  </select>
                </FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter>
                <Button type="submit" className="rounded-full">{t.admin.ey.save_participant}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={eyCoordinatorEditOpen} onOpenChange={(open) => {
        if (!open) {
          setEyCoordinatorEditOpen(false);
          setEditingEyCoordinator(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.admin.ey.edit_coordinator}</DialogTitle>
          </DialogHeader>
          <Form {...eyCoordinatorEditForm}>
            <form onSubmit={eyCoordinatorEditForm.handleSubmit(handleSaveEyCoordinator)} className="space-y-4">
              <FormField control={eyCoordinatorEditForm.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>{t.admin.church.name}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={eyCoordinatorEditForm.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>{t.admin.church.phone}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={eyCoordinatorEditForm.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>{t.admin.church.email}</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter>
                <Button type="submit" className="rounded-full">{t.admin.ey.save_coordinator}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Badge Generation Modal */}
      {badgeParticipant && (
        <BadgeGenerationModal
          open={showBadgeModal}
          onOpenChange={(open) => {
            if (!open) {
              setShowBadgeModal(false);
              setBadgeParticipant(null);
            }
          }}
          participant={badgeParticipant}
          event={eyEvents.find((e: any) => e.id === badgeParticipant.eventId)}
          round={eyRounds.find((r: any) => r.id === badgeParticipant.roundId)}
          coordinator={eyCoordinators.find((c: any) => c.id === badgeParticipant.coordinatorId)}
          onConfirm={() => generateBadgeMutation.mutate(badgeParticipant.id)}
          isGenerating={generateBadgeMutation.isPending}
        />
      )}
    </div>
  );
}

// Church Portal Content Component
function ChurchPortalContent({
  supportList,
  memberList,
  posts,
  events,
  loadingSupport,
  loadingMembers,
  loadingPosts,
  loadingEvents,
  postForm,
  eventForm,
  scriptureForm,
  handleCreatePost,
  handleDeletePost,
  handleCreateEvent,
  handleDeleteEvent,
  handleCreateScripture,
  handleEditPost,
  handleEditEvent,
  createPost,
  createEvent,
  createScripture,
  editingPost,
  editingEvent,
  postEditOpen,
  eventEditOpen,
  setPostEditOpen,
  setEventEditOpen,
  setEditingPost,
  setEditingEvent,
  handleSavePost,
  handleSaveEvent,
}: any) {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="posts">
      <TabsList className="flex flex-wrap h-auto gap-1 mb-8">
        <TabsTrigger value="posts" className="gap-2"><BookOpen className="h-4 w-4" /> {t.admin.church.weekly_sermons}</TabsTrigger>
        <TabsTrigger value="events" className="gap-2"><Calendar className="h-4 w-4" /> {t.admin.church.events}</TabsTrigger>
        <TabsTrigger value="scripture" className="gap-2"><BookMarked className="h-4 w-4" /> {t.admin.church.scripture}</TabsTrigger>
        <TabsTrigger value="support" className="gap-2"><HeartHandshake className="h-4 w-4" /> {t.admin.church.support_submissions} ({supportList.length})</TabsTrigger>
        <TabsTrigger value="members" className="gap-2"><Users className="h-4 w-4" /> {t.admin.church.membership_requests} ({memberList.length})</TabsTrigger>
      </TabsList>

      {/* POSTS */}
      <TabsContent value="posts" className="space-y-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> {t.admin.church.create_new} {t.admin.church.sermon_title}</CardTitle></CardHeader>
          <CardContent>
            <Form {...postForm}>
              <form onSubmit={postForm.handleSubmit(handleCreatePost)} className="space-y-4">
                <FormField control={postForm.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.church.sermon_title}</FormLabel><FormControl><Input data-testid="input-postTitle" placeholder={t.admin.church.sermon_title} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={postForm.control} name="highlights" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.church.highlights}</FormLabel><FormControl><Textarea data-testid="input-postHighlights" rows={4} placeholder={t.admin.church.highlights} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField control={postForm.control} name="photoUrl" render={({ field }) => (
                    <FormItem><FormLabel>{t.admin.church.photo_url}</FormLabel><FormControl><Input data-testid="input-postPhotoUrl" placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={postForm.control} name="facebookUrl" render={({ field }) => (
                    <FormItem><FormLabel>{t.admin.church.facebook_url}</FormLabel><FormControl><Input data-testid="input-postFacebookUrl" placeholder="https://facebook.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={postForm.control} name="youtubeUrl" render={({ field }) => (
                    <FormItem><FormLabel>{t.admin.church.youtube_url}</FormLabel><FormControl><Input data-testid="input-postYoutubeUrl" placeholder="https://youtube.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" className="rounded-full gap-2" disabled={createPost.isPending} data-testid="button-createPost">
                  <Plus className="h-4 w-4" /> {createPost.isPending ? t.admin.common.loading : t.admin.church.create}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.admin.church.all} {t.admin.church.weekly_sermons}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={posts}
              columns={[
                { key: "title", header: t.admin.church.title, searchable: true, sortable: true },
                { key: "highlights", header: t.admin.church.highlights, searchable: true, render: (value) => (
                  <div className="max-w-xs truncate" title={value}>{value}</div>
                )},
                { key: "createdAt", header: t.admin.church.date, sortable: true, render: (value) => format(new Date(value), 'MMM d, yyyy') },
              ]}
              searchPlaceholder={t.admin.church.search_posts}
              onEdit={handleEditPost}
              onDelete={(post) => handleDeletePost(post.id)}
              loading={loadingPosts}
              exportFileName="posts"
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* EVENTS */}
      <TabsContent value="events" className="space-y-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> {t.admin.church.create_new} {t.admin.church.event_title}</CardTitle></CardHeader>
          <CardContent>
            <Form {...eventForm}>
              <form onSubmit={eventForm.handleSubmit(handleCreateEvent)} className="space-y-4">
                <FormField control={eventForm.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.church.event_title}</FormLabel><FormControl><Input data-testid="input-eventTitle" placeholder={t.admin.church.event_title} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eventForm.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.church.description}</FormLabel><FormControl><Textarea data-testid="input-eventDescription" rows={3} placeholder={t.admin.church.description} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={eventForm.control} name="date" render={({ field }) => (
                    <FormItem><FormLabel>{t.admin.church.date}</FormLabel><FormControl><Input data-testid="input-eventDate" type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={eventForm.control} name="imageUrl" render={({ field }) => (
                    <FormItem><FormLabel>{t.admin.church.image_url}</FormLabel><FormControl><Input data-testid="input-eventImageUrl" placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" className="rounded-full gap-2" disabled={createEvent.isPending} data-testid="button-createEvent">
                  <Plus className="h-4 w-4" /> {createEvent.isPending ? t.admin.common.loading : t.admin.church.create}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.admin.church.all} {t.admin.church.events}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={events}
              columns={[
                { key: "title", header: t.admin.church.title, searchable: true, sortable: true },
                { key: "description", header: t.admin.church.description, searchable: true, render: (value) => (
                  <div className="max-w-xs truncate" title={value}>{value}</div>
                )},
                { key: "date", header: t.admin.church.date, sortable: true, render: (value) => format(new Date(value), 'MMMM d, yyyy') },
              ]}
              searchPlaceholder={t.admin.church.search_events}
              onEdit={handleEditEvent}
              onDelete={(event) => handleDeleteEvent(event.id)}
              loading={loadingEvents}
              exportFileName="events"
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* SCRIPTURE */}
      <TabsContent value="scripture">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BookMarked className="h-5 w-5 text-primary" /> {t.admin.church.create_new} {t.admin.church.scripture}</CardTitle></CardHeader>
          <CardContent>
            <Form {...scriptureForm}>
              <form onSubmit={scriptureForm.handleSubmit(handleCreateScripture)} className="space-y-4">
                <FormField control={scriptureForm.control} name="verse" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.church.verse_text}</FormLabel><FormControl><Textarea data-testid="input-scriptureVerse" rows={4} placeholder={t.admin.church.verse_text} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={scriptureForm.control} name="reference" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.church.reference}</FormLabel><FormControl><Input data-testid="input-scriptureReference" placeholder={t.admin.church.reference} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="rounded-full gap-2" disabled={createScripture.isPending} data-testid="button-createScripture">
                  <Plus className="h-4 w-4" /> {createScripture.isPending ? t.admin.common.loading : t.admin.church.create}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* SUPPORT SUBMISSIONS */}
      <TabsContent value="support">
        <Card>
          <CardHeader>
            <CardTitle>{t.admin.church.support_submissions}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={supportList}
              columns={[
                { key: "firstName", header: t.admin.church.first_name || "First Name", searchable: true, sortable: true },
                { key: "middleName", header: t.admin.church.middle_name || "Middle Name", searchable: true },
                { key: "lastName", header: t.admin.church.last_name || "Last Name", searchable: true, sortable: true },
                { key: "phone", header: t.admin.church.phone, searchable: true },
                { key: "email", header: t.admin.church.email, searchable: true },
                { key: "occupation", header: t.admin.church.occupation, searchable: true },
                { key: "amountPerMonth", header: "Monthly (ETB)", render: (value) => `${value} ETB` },
                { key: "amountPerYear", header: "Yearly (ETB)", render: (value) => `${value} ETB` },
                { key: "reason", header: t.admin.church.reason, searchable: true, render: (value) => (
                  <div className="max-w-xs truncate" title={value}>{value}</div>
                )},
                { key: "createdAt", header: t.admin.church.date, sortable: true, render: (value) => format(new Date(value), 'MMM d, yyyy') },
              ]}
              searchPlaceholder={t.admin.church.search_support}
              loading={loadingSupport}
              exportFileName="support-submissions"
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* MEMBERSHIP */}
      <TabsContent value="members">
        <Card>
          <CardHeader>
            <CardTitle>{t.admin.church.membership_requests}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={memberList}
              columns={[
                { key: "firstName", header: t.admin.church.first_name || "First Name", searchable: true, sortable: true },
                { key: "middleName", header: t.admin.church.middle_name || "Middle Name", searchable: true },
                { key: "lastName", header: t.admin.church.last_name || "Last Name", searchable: true, sortable: true },
                { key: "phone", header: t.admin.church.phone, searchable: true },
                { key: "email", header: t.admin.church.email, searchable: true },
                { key: "occupation", header: t.admin.church.occupation, searchable: true },
                { key: "previousChurch", header: t.admin.church.previous_church || "Previous Church", searchable: true },
                { key: "servingAs", header: t.admin.church.serving_as || "Serving As", searchable: true },
                { key: "baptized", header: t.admin.church.baptized || "Baptized", render: (value) => (
                  <Badge variant={value ? "default" : "secondary"}>{value ? t.admin.church.yes : t.admin.church.no}</Badge>
                )},
                { key: "createdAt", header: t.admin.church.date, sortable: true, render: (value) => format(new Date(value), 'MMM d, yyyy') },
              ]}
              searchPlaceholder={t.admin.church.search_membership}
              loading={loadingMembers}
              exportFileName="membership-requests"
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// Excellent Youth Content Component
function ExcellentYouthContent({
  eyEventForm,
  eyRoundForm,
  eyCoordinatorForm,
  eyEvents,
  eyRounds,
  eyParticipants,
  eyCoordinators,
  loadingEyEvents,
  loadingEyRounds,
  loadingEyParticipants,
  loadingEyCoordinators,
  handleCreateEyEvent,
  handleDeleteEyEvent,
  handleEditEyEvent,
  handleCreateEyRound,
  handleDeleteEyRound,
  handleEditEyRound,
  handleCreateEyCoordinator,
  handleDeleteEyCoordinator,
  handleEditEyCoordinator,
  handleDeleteEyParticipant,
  handleEditEyParticipant,
  handleGenerateBadge,
}: any) {
  const { t } = useLanguage();
  const participantRows = eyParticipants.map((participant: any) => ({
    ...participant,
    eventName: participant.event?.title || "",
    roundNumber: participant.round?.roundNumber || "",
    roundDates: participant.round ? `${participant.round.fromDate || ""}${participant.round.fromDate && participant.round.toDate ? ` - ${participant.round.toDate}` : ""}` : "",
    coordinatorName: participant.coordinator?.name || participant.coordinatorId || t.admin.ey.unassigned,
    badgeStatus: participant.badgeGenerated ? t.admin.ey.generated : t.admin.ey.pending,
  }));

  const [searchBy, setSearchBy] = useState("all");
  const [searchByValue, setSearchByValue] = useState<Record<string, string>>({});

  return (
    <Tabs defaultValue="events">
      <TabsList className="flex flex-wrap h-auto gap-1 mb-8">
        <TabsTrigger value="events" className="gap-2"><Calendar className="h-4 w-4" /> {t.admin.ey.events}</TabsTrigger>
        <TabsTrigger value="rounds" className="gap-2"><Target className="h-4 w-4" /> {t.admin.ey.rounds}</TabsTrigger>
        <TabsTrigger value="participants" className="gap-2"><Users className="h-4 w-4" /> {t.admin.ey.participants}</TabsTrigger>
        <TabsTrigger value="coordinators" className="gap-2"><UserCheck className="h-4 w-4" /> {t.admin.ey.coordinators}</TabsTrigger>
      </TabsList>

      {/* EY EVENTS */}
      <TabsContent value="events" className="space-y-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> {t.admin.ey.create_new_event}</CardTitle></CardHeader>
          <CardContent>
            <Form {...eyEventForm}>
              <form onSubmit={eyEventForm.handleSubmit(handleCreateEyEvent)} className="space-y-4">
                <FormField control={eyEventForm.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.event_title}</FormLabel><FormControl><Input placeholder={t.admin.ey.ey_event_name} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyEventForm.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.church.description}</FormLabel><FormControl><Textarea rows={3} placeholder={t.admin.ey.event_description} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={eyEventForm.control} name="startDate" render={({ field }) => (
                    <FormItem><FormLabel>{t.admin.ey.start_date}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={eyEventForm.control} name="endDate" render={({ field }) => (
                    <FormItem><FormLabel>{t.admin.ey.end_date}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField control={eyEventForm.control} name="year" render={({ field }) => (
                    <FormItem><FormLabel>{t.admin.ey.year}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={eyEventForm.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>{t.admin.ey.type}</FormLabel><FormControl><Input placeholder={t.admin.ey.conference_training} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={eyEventForm.control} name="imageUrl" render={({ field }) => (
                    <FormItem><FormLabel>{t.admin.church.image_url}</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" className="rounded-full gap-2">
                  <Plus className="h-4 w-4" /> {t.admin.ey.save_event}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t.admin.ey.all_events}</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              data={eyEvents}
              columns={[
                { key: "title", header: t.admin.ey.event_title, searchable: true, sortable: true },
                { key: "type", header: t.admin.ey.type, searchable: true, sortable: true },
                { key: "year", header: t.admin.ey.year, sortable: true },
                { key: "startDate", header: t.admin.ey.start_date, sortable: true },
                { key: "endDate", header: t.admin.ey.end_date, sortable: true },
              ]}
              onEdit={handleEditEyEvent}
              onDelete={handleDeleteEyEvent}
              loading={loadingEyEvents}
              exportFileName="ey-events"
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* EY ROUNDS */}
      <TabsContent value="rounds" className="space-y-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> {t.admin.ey.create_new_round}</CardTitle></CardHeader>
          <CardContent>
            <Form {...eyRoundForm}>
              <form onSubmit={eyRoundForm.handleSubmit(handleCreateEyRound)} className="space-y-4">
                <FormField control={eyRoundForm.control} name="eventId" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.event}</FormLabel><FormControl>
                    <select {...field} className="w-full rounded-md border border-input px-3 py-2">
                      <option value={0}>{t.admin.ey.select_event}</option>
                      {eyEvents.map((event: any) => (
                        <option key={event.id} value={event.id}>{event.title}</option>
                      ))}
                    </select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyRoundForm.control} name="roundNumber" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.round_number}</FormLabel><FormControl><Input type="number" min="1" placeholder={t.admin.ey.round_1_2_3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyRoundForm.control} name="capacity" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.ey.capacity}</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={eyRoundForm.control} name="fromDate" render={({ field }) => (
                    <FormItem><FormLabel>{t.admin.ey.round_start}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={eyRoundForm.control} name="toDate" render={({ field }) => (
                    <FormItem><FormLabel>{t.admin.ey.round_end}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" className="rounded-full gap-2">
                  <Plus className="h-4 w-4" /> {t.admin.ey.save_round}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t.admin.ey.all_rounds}</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              data={eyRounds.map((round: any) => ({
                ...round,
                eventName: eyEvents.find((event: any) => event.id === round.eventId)?.title || t.admin.ey.unassigned,
                roundDates: `${round.fromDate || ""}${round.fromDate && round.toDate ? ` - ${round.toDate}` : ""}`,
              }))}
              columns={[
                { key: "roundNumber", header: t.admin.ey.round_number, sortable: true },
                { key: "eventName", header: t.admin.ey.event, searchable: true, sortable: true },
                { key: "capacity", header: t.admin.ey.capacity, sortable: true },
                { key: "roundDates", header: t.admin.ey.round_dates, searchable: false, render: (value) => value || t.admin.ey.pending },
              ]}
              onEdit={handleEditEyRound}
              onDelete={handleDeleteEyRound}
              loading={loadingEyRounds}
              exportFileName="ey-rounds"
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* REGISTERED PARTICIPANTS */}
      <TabsContent value="participants" className="space-y-8">
        <Card>
          <CardHeader><CardTitle>{t.admin.ey.registered_participants}</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              data={participantRows}
              columns={[
                { key: "registrationNumber", header: t.admin.ey.reg_number, searchable: true, sortable: true },
                { key: "firstName", header: t.admin.ey.first_name, searchable: true, sortable: true },
                { key: "lastName", header: t.admin.ey.last_name, searchable: true, sortable: true },
                { key: "email", header: t.admin.ey.email, searchable: true },
                { key: "city", header: t.admin.ey.city, searchable: true },
                { key: "eventName", header: t.admin.ey.event, searchable: true, sortable: true },
                { key: "roundNumber", header: t.admin.ey.round, searchable: true, sortable: true },
                { key: "roundDates", header: t.admin.ey.round_dates, searchable: false },
                { key: "coordinatorName", header: t.admin.ey.coordinator, searchable: true },
                { key: "badgeStatus", header: t.admin.ey.badge, searchable: false, render: (value) => (
                  <Badge variant={value === t.admin.ey.generated ? "default" : "secondary"}>{value}</Badge>
                )},
                { key: "faydaVerified", header: t.admin.ey.fayda_verified, render: (value) => (
                  <Badge variant={value ? "default" : "secondary"}>{value ? t.admin.ey.yes : t.admin.ey.no}</Badge>
                )},
                { key: "paymentStatus", header: t.admin.ey.paid, render: (value) => (
                  <Badge variant={value ? "default" : "secondary"}>{value ? t.admin.ey.yes : t.admin.ey.no}</Badge>
                )},
              ]}
              searchBy={searchBy}
              searchByValue={searchByValue}
              onSearchByChange={setSearchBy}
              onSearchByValueChange={setSearchByValue}
              searchByOptions={[
                { value: "all", label: t.admin.church.all },
                { value: "eventName", label: t.admin.ey.event },
                { value: "roundNumber", label: t.admin.ey.round },
                { value: "faydaVerified", label: t.admin.ey.fayda_verified },
                { value: "paymentStatus", label: t.admin.ey.paid },
              ]}
              onEdit={handleEditEyParticipant}
              onDelete={handleDeleteEyParticipant}
              onGenerateBadge={handleGenerateBadge}
              loading={loadingEyParticipants}
              exportFileName="ey-participants"
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* COORDINATORS */}
      <TabsContent value="coordinators" className="space-y-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> {t.admin.ey.add_coordinator}</CardTitle></CardHeader>
          <CardContent>
            <Form {...eyCoordinatorForm}>
              <form onSubmit={eyCoordinatorForm.handleSubmit(handleCreateEyCoordinator)} className="space-y-4">
                <FormField control={eyCoordinatorForm.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.church.full_name}</FormLabel><FormControl><Input placeholder={t.admin.ey.coordinator_name} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyCoordinatorForm.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.church.phone_number}</FormLabel><FormControl><Input placeholder="+251..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyCoordinatorForm.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>{t.admin.church.email}</FormLabel><FormControl><Input type="email" placeholder="coordinator@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="rounded-full gap-2">
                  <Plus className="h-4 w-4" /> {t.admin.ey.add_coordinator}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t.admin.ey.all_coordinators}</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              data={eyCoordinators}
              columns={[
                { key: "name", header: t.admin.church.name, searchable: true, sortable: true },
                { key: "phone", header: t.admin.church.phone, searchable: true },
                { key: "email", header: t.admin.church.email, searchable: true },
              ]}
              onEdit={handleEditEyCoordinator}
              onDelete={handleDeleteEyCoordinator}
              loading={loadingEyCoordinators}
              exportFileName="ey-coordinators"
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default function Admin() {
  const { role } = useAuthStore();
  if (role !== "admin") return <LoginForm />;
  return <AdminDashboard />;
}