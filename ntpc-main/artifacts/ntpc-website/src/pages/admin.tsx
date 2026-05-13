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
  const { language, t } = useLanguage();
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
          <CardTitle className="font-serif text-2xl">{t.admin.login.title}</CardTitle>
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
  const { language, t } = useLanguage();
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
        <div className="bg-primary text-primary-foreground py-4 px-6">
          <h1 className="text-xl font-serif font-bold">
            {activeSection === 'church' ? t.admin.header.church_portal : t.admin.header.ey_management}
          </h1>
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
            <DialogTitle>Edit EY Event</DialogTitle>
          </DialogHeader>
          <Form {...eyEventEditForm}>
            <form onSubmit={eyEventEditForm.handleSubmit(handleSaveEyEvent)} className="space-y-4">
              <FormField control={eyEventEditForm.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={eyEventEditForm.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyEventEditForm.control} name="startDate" render={({ field }) => (
                  <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyEventEditForm.control} name="endDate" render={({ field }) => (
                  <FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyEventEditForm.control} name="year" render={({ field }) => (
                  <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyEventEditForm.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter>
                <Button type="submit" className="rounded-full">Save Event</Button>
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
            <DialogTitle>Edit EY Round</DialogTitle>
          </DialogHeader>
          <Form {...eyRoundEditForm}>
            <form onSubmit={eyRoundEditForm.handleSubmit(handleSaveEyRound)} className="space-y-4">
              <FormField control={eyRoundEditForm.control} name="eventId" render={({ field }) => (
                <FormItem><FormLabel>Event</FormLabel><FormControl>
                  <select {...field} className="w-full rounded-md border border-input px-3 py-2">
                    <option value={0}>Select an event</option>
                    {eyEvents.map((event: any) => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={eyRoundEditForm.control} name="roundNumber" render={({ field }) => (
                <FormItem><FormLabel>Round Number</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={eyRoundEditForm.control} name="capacity" render={({ field }) => (
                <FormItem><FormLabel>Capacity</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyRoundEditForm.control} name="fromDate" render={({ field }) => (
                  <FormItem><FormLabel>Round Start</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyRoundEditForm.control} name="toDate" render={({ field }) => (
                  <FormItem><FormLabel>Round End</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter>
                <Button type="submit" className="rounded-full">Save Round</Button>
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
            <DialogTitle>Edit Participant</DialogTitle>
          </DialogHeader>
          <Form {...eyParticipantEditForm}>
            <form onSubmit={eyParticipantEditForm.handleSubmit(handleSaveEyParticipant)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyParticipantEditForm.control} name="firstName" render={({ field }) => (
                  <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyParticipantEditForm.control} name="lastName" render={({ field }) => (
                  <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyParticipantEditForm.control} name="city" render={({ field }) => (
                  <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyParticipantEditForm.control} name="phoneNumber" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={eyParticipantEditForm.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyParticipantEditForm.control} name="faydaVerified" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Fayda Verified</FormLabel>
                    <FormControl>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(event) => field.onChange(event.target.checked)}
                          className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                        />
                        Verified
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={eyParticipantEditForm.control} name="paymentStatus" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Paid</FormLabel>
                    <FormControl>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(event) => field.onChange(event.target.checked)}
                          className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                        />
                        Paid
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={eyParticipantEditForm.control} name="eventId" render={({ field }) => (
                  <FormItem><FormLabel>Event</FormLabel><FormControl>
                    <select {...field} className="w-full rounded-md border border-input px-3 py-2">
                      <option value={0}>Select an event</option>
                      {eyEvents.map((event: any) => (
                        <option key={event.id} value={event.id}>{event.title}</option>
                      ))}
                    </select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyParticipantEditForm.control} name="roundId" render={({ field }) => (
                  <FormItem><FormLabel>Round</FormLabel><FormControl>
                    <select {...field} className="w-full rounded-md border border-input px-3 py-2">
                      <option value={0}>Select a round</option>
                      {eyRounds.map((round: any) => (
                        <option key={round.id} value={round.id}>{`Round ${round.roundNumber} (${eyEvents.find((event:any) => event.id === round.eventId)?.title || 'Unknown'})`}</option>
                      ))}
                    </select>
                  </FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={eyParticipantEditForm.control} name="coordinatorId" render={({ field }) => (
                <FormItem><FormLabel>Coordinator</FormLabel><FormControl>
                  <select {...field} className="w-full rounded-md border border-input px-3 py-2">
                    <option value={0}>Select a coordinator</option>
                    {eyCoordinators.map((coordinator: any) => (
                      <option key={coordinator.id} value={coordinator.id}>{coordinator.name}</option>
                    ))}
                  </select>
                </FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter>
                <Button type="submit" className="rounded-full">Save Participant</Button>
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
            <DialogTitle>Edit Coordinator</DialogTitle>
          </DialogHeader>
          <Form {...eyCoordinatorEditForm}>
            <form onSubmit={eyCoordinatorEditForm.handleSubmit(handleSaveEyCoordinator)} className="space-y-4">
              <FormField control={eyCoordinatorEditForm.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={eyCoordinatorEditForm.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={eyCoordinatorEditForm.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter>
                <Button type="submit" className="rounded-full">Save Coordinator</Button>
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
  return (
    <Tabs defaultValue="posts">
      <TabsList className="flex flex-wrap h-auto gap-1 mb-8">
        <TabsTrigger value="posts" className="gap-2"><BookOpen className="h-4 w-4" /> Sermons</TabsTrigger>
        <TabsTrigger value="events" className="gap-2"><Calendar className="h-4 w-4" /> Events</TabsTrigger>
        <TabsTrigger value="scripture" className="gap-2"><BookMarked className="h-4 w-4" /> Scripture</TabsTrigger>
        <TabsTrigger value="support" className="gap-2"><HeartHandshake className="h-4 w-4" /> Support ({supportList.length})</TabsTrigger>
        <TabsTrigger value="members" className="gap-2"><Users className="h-4 w-4" /> Members ({memberList.length})</TabsTrigger>
      </TabsList>

      {/* POSTS */}
      <TabsContent value="posts" className="space-y-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Create New Sermon</CardTitle></CardHeader>
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

        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={posts}
              columns={[
                { key: "title", header: "Title", searchable: true, sortable: true },
                { key: "highlights", header: "Highlights", searchable: true, render: (value) => (
                  <div className="max-w-xs truncate" title={value}>{value}</div>
                )},
                { key: "createdAt", header: "Date", sortable: true, render: (value) => format(new Date(value), 'MMM d, yyyy') },
              ]}
              searchPlaceholder="Search posts..."
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

        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={events}
              columns={[
                { key: "title", header: "Title", searchable: true, sortable: true },
                { key: "description", header: "Description", searchable: true, render: (value) => (
                  <div className="max-w-xs truncate" title={value}>{value}</div>
                )},
                { key: "date", header: "Date", sortable: true, render: (value) => format(new Date(value), 'MMMM d, yyyy') },
              ]}
              searchPlaceholder="Search events..."
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
        <Card>
          <CardHeader>
            <CardTitle>Ministry Support Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={supportList}
              columns={[
                { key: "firstName", header: "First Name", searchable: true, sortable: true },
                { key: "middleName", header: "Middle Name", searchable: true },
                { key: "lastName", header: "Last Name", searchable: true, sortable: true },
                { key: "phone", header: "Phone", searchable: true },
                { key: "email", header: "Email", searchable: true },
                { key: "occupation", header: "Occupation", searchable: true },
                { key: "amountPerMonth", header: "Monthly (ETB)", render: (value) => `${value} ETB` },
                { key: "amountPerYear", header: "Yearly (ETB)", render: (value) => `${value} ETB` },
                { key: "reason", header: "Reason", searchable: true, render: (value) => (
                  <div className="max-w-xs truncate" title={value}>{value}</div>
                )},
                { key: "createdAt", header: "Date", sortable: true, render: (value) => format(new Date(value), 'MMM d, yyyy') },
              ]}
              searchPlaceholder="Search support submissions..."
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
            <CardTitle>Membership Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={memberList}
              columns={[
                { key: "firstName", header: "First Name", searchable: true, sortable: true },
                { key: "middleName", header: "Middle Name", searchable: true },
                { key: "lastName", header: "Last Name", searchable: true, sortable: true },
                { key: "phone", header: "Phone", searchable: true },
                { key: "email", header: "Email", searchable: true },
                { key: "occupation", header: "Occupation", searchable: true },
                { key: "previousChurch", header: "Previous Church", searchable: true },
                { key: "servingAs", header: "Serving As", searchable: true },
                { key: "baptized", header: "Baptized", render: (value) => (
                  <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>
                )},
                { key: "createdAt", header: "Date", sortable: true, render: (value) => format(new Date(value), 'MMM d, yyyy') },
              ]}
              searchPlaceholder="Search membership requests..."
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
  const participantRows = eyParticipants.map((participant: any) => ({
    ...participant,
    eventName: participant.event?.title || "",
    roundNumber: participant.round?.roundNumber || "",
    roundDates: participant.round ? `${participant.round.fromDate || ""}${participant.round.fromDate && participant.round.toDate ? ` - ${participant.round.toDate}` : ""}` : "",
    coordinatorName: participant.coordinator?.name || participant.coordinatorId || "Unassigned",
    badgeStatus: participant.badgeGenerated ? "Generated" : "Pending",
  }));

  const [searchBy, setSearchBy] = useState("all");
  const [searchByValue, setSearchByValue] = useState<Record<string, string>>({});

  return (
    <Tabs defaultValue="events">
      <TabsList className="flex flex-wrap h-auto gap-1 mb-8">
        <TabsTrigger value="events" className="gap-2"><Calendar className="h-4 w-4" /> Events</TabsTrigger>
        <TabsTrigger value="rounds" className="gap-2"><Target className="h-4 w-4" /> Rounds</TabsTrigger>
        <TabsTrigger value="participants" className="gap-2"><Users className="h-4 w-4" /> Participants</TabsTrigger>
        <TabsTrigger value="coordinators" className="gap-2"><UserCheck className="h-4 w-4" /> Coordinators</TabsTrigger>
      </TabsList>

      {/* EY EVENTS */}
      <TabsContent value="events" className="space-y-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Create New EY Event</CardTitle></CardHeader>
          <CardContent>
            <Form {...eyEventForm}>
              <form onSubmit={eyEventForm.handleSubmit(handleCreateEyEvent)} className="space-y-4">
                <FormField control={eyEventForm.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Event Title</FormLabel><FormControl><Input placeholder="EY Event name..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyEventForm.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} placeholder="Event description..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={eyEventForm.control} name="startDate" render={({ field }) => (
                    <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={eyEventForm.control} name="endDate" render={({ field }) => (
                    <FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField control={eyEventForm.control} name="year" render={({ field }) => (
                    <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={eyEventForm.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="Conference, Training..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={eyEventForm.control} name="imageUrl" render={({ field }) => (
                    <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" className="rounded-full gap-2">
                  <Plus className="h-4 w-4" /> Create Event
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>All EY Events</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              data={eyEvents}
              columns={[
                { key: "title", header: "Title", searchable: true, sortable: true },
                { key: "type", header: "Type", searchable: true, sortable: true },
                { key: "year", header: "Year", sortable: true },
                { key: "startDate", header: "Start Date", sortable: true },
                { key: "endDate", header: "End Date", sortable: true },
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
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Create New Round</CardTitle></CardHeader>
          <CardContent>
            <Form {...eyRoundForm}>
              <form onSubmit={eyRoundForm.handleSubmit(handleCreateEyRound)} className="space-y-4">
                <FormField control={eyRoundForm.control} name="eventId" render={({ field }) => (
                  <FormItem><FormLabel>Event</FormLabel><FormControl>
                    <select {...field} className="w-full rounded-md border border-input px-3 py-2">
                      <option value={0}>Select an event</option>
                      {eyEvents.map((event: any) => (
                        <option key={event.id} value={event.id}>{event.title}</option>
                      ))}
                    </select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyRoundForm.control} name="roundNumber" render={({ field }) => (
                  <FormItem><FormLabel>Round Number</FormLabel><FormControl><Input type="number" min="1" placeholder="1, 2, 3..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyRoundForm.control} name="capacity" render={({ field }) => (
                  <FormItem><FormLabel>Capacity</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={eyRoundForm.control} name="fromDate" render={({ field }) => (
                    <FormItem><FormLabel>Round Start</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={eyRoundForm.control} name="toDate" render={({ field }) => (
                    <FormItem><FormLabel>Round End</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" className="rounded-full gap-2">
                  <Plus className="h-4 w-4" /> Create Round
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>All Rounds</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              data={eyRounds.map((round: any) => ({
                ...round,
                eventName: eyEvents.find((event: any) => event.id === round.eventId)?.title || "Unknown",
                roundDates: `${round.fromDate || ""}${round.fromDate && round.toDate ? ` - ${round.toDate}` : ""}`,
              }))}
              columns={[
                { key: "roundNumber", header: "Round Number", sortable: true },
                { key: "eventName", header: "Event", searchable: true, sortable: true },
                { key: "capacity", header: "Capacity", sortable: true },
                { key: "roundDates", header: "Round Dates", searchable: false, render: (value) => value || "Pending" },
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
          <CardHeader><CardTitle>Registered Participants</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              data={participantRows}
              columns={[
                { key: "registrationNumber", header: "Reg #", searchable: true, sortable: true },
                { key: "firstName", header: "First Name", searchable: true, sortable: true },
                { key: "lastName", header: "Last Name", searchable: true, sortable: true },
                { key: "email", header: "Email", searchable: true },
                { key: "city", header: "City", searchable: true },
                { key: "eventName", header: "Event", searchable: true, sortable: true },
{ key: "roundNumber", header: "Round", searchable: true, sortable: true },
                { key: "roundDates", header: "Round Dates", searchable: false },
                { key: "coordinatorName", header: "Coordinator", searchable: true },
                { key: "badgeStatus", header: "Badge", searchable: false, render: (value) => (
                  <Badge variant={value === "Generated" ? "default" : "secondary"}>{value}</Badge>
                )},
                { key: "faydaVerified", header: "Fayda Verified", render: (value) => (
                  <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>
                )},
                { key: "paymentStatus", header: "Paid", render: (value) => (
                  <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>
                )},
              ]}
              searchBy={searchBy}
              searchByValue={searchByValue}
              onSearchByChange={setSearchBy}
              onSearchByValueChange={setSearchByValue}
              searchByOptions={[
                { value: "all", label: "All" },
                { value: "eventName", label: "Event" },
                { value: "roundNumber", label: "Round" },
                { value: "faydaVerified", label: "Fayda Verified" },
                { value: "paymentStatus", label: "Paid" },
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
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Add Coordinator</CardTitle></CardHeader>
          <CardContent>
            <Form {...eyCoordinatorForm}>
              <form onSubmit={eyCoordinatorForm.handleSubmit(handleCreateEyCoordinator)} className="space-y-4">
                <FormField control={eyCoordinatorForm.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Coordinator name..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyCoordinatorForm.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+251..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={eyCoordinatorForm.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="coordinator@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="rounded-full gap-2">
                  <Plus className="h-4 w-4" /> Add Coordinator
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>All Coordinators</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              data={eyCoordinators}
              columns={[
                { key: "name", header: "Name", searchable: true, sortable: true },
                { key: "phone", header: "Phone", searchable: true },
                { key: "email", header: "Email", searchable: true },
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