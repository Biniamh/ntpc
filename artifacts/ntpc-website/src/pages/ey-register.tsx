import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  useCreateEyParticipant,
  useListEyEvents,
  useListEyRounds,
} from "@workspace/api-client-react";

import { useLanguage } from "@/lib/language-provider";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Users,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Building2,
  LogIn,
} from "lucide-react";

import excellentyouth from "@/assets/excellentyouth.jpeg";

const schema = z.object({
  faydaId: z.string().optional(),

  firstName: z.string().min(1, "First name required"),

  middleName: z.string().optional(),

  lastName: z.string().min(1, "Last name required"),

  city: z.string().min(1, "City required"),

  phoneNumber: z.string().min(1, "Phone number required"),

  email: z.string().email("Valid email required"),

  eventId: z.coerce.number().min(1, "Event selection required"),

  roundId: z.coerce.number().min(1, "Round selection required"),

  paymentMethod: z.enum(["bank", "telebirr"]),

  bankReference: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type FaydaVerificationResult = {
  verified: boolean;
  id: string;
  name?: string;
  birthDate?: string;
  gender?: string;
  status?: string;
  authUrl?: string;
  state?: string;
  codeVerifier?: string;
  claims?: Record<string, unknown>;
  phone?: string;
  email?: string;
  error?: string;
};

export default function Eyregister() {
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const [step, setStep] = useState(1);

  const [faydaVerified, setFaydaVerified] = useState(false);
  const [faydaVerificationProfile, setFaydaVerificationProfile] =
    useState<FaydaVerificationResult | null>(null);

  const [registrationNumber, setRegistrationNumber] = useState<
    string | null
  >(null);

  const [coordinatorId, setCoordinatorId] = useState<string | null>(
    null
  );

   const [isVerifying, setIsVerifying] = useState(false);
   
   const [isProcessingPayment, setIsProcessingPayment] =
     useState(false);
     
   const [isVerifyingTelebirr, setIsVerifyingTelebirr] = useState(false);
   
   const [telebirrPaymentVerified, setTelebirrPaymentVerified] = useState(false);

  const [roundCapacityStatus, setRoundCapacityStatus] =
    useState<any>(null);

  const { data: eyEvents = [] } = useListEyEvents();

  const { data: eyRounds = [] } = useListEyRounds();

  const createParticipant = useCreateEyParticipant();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      faydaId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      city: "",
      phoneNumber: "",
      email: "",
      eventId: 0,
      roundId: 0,
      paymentMethod: "bank",
      bankReference: "",
    },
  });

  const selectedEventId = Number(form.watch("eventId"));

  const selectedRoundId = Number(form.watch("roundId"));

  const paymentMethod = form.watch("paymentMethod");

  const availableRounds = useMemo(() => {
    return eyRounds.filter(
      (round) => round.eventId === selectedEventId
    );
  }, [eyRounds, selectedEventId]);

   useEffect(() => {
     if (selectedRoundId > 0) {
       loadSelectedRoundCapacity(selectedRoundId);
     }
   }, [selectedRoundId]);
 
   useEffect(() => {
     const params = new URLSearchParams(window.location.search);
     const code = params.get("code");
     const state = params.get("state");
 
     if (!code || !state) return;
 
     const storedState = sessionStorage.getItem("fayda_state");
     const codeVerifier = sessionStorage.getItem("fayda_code_verifier");
 
     if (state !== storedState || !codeVerifier) {
       toast({
         title: t.ey_register.error,
         description: t.ey_register.something_wrong,
         variant: "destructive",
       });
       return;
     }
 
     verifyFayda(undefined, { code, codeVerifier }).then((verified) => {
       if (!verified) return;
 
       setFaydaVerified(true);
       setStep(2);
       toast({
         title: t.common.success,
         description: t.ey_register.national_id_verified,
       });
 
       sessionStorage.removeItem("fayda_state");
       sessionStorage.removeItem("fayda_code_verifier");
       window.history.replaceState({}, "", window.location.pathname);
     });
   }, []);
   
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const transactionId = params.get("transactionId");
      const status = params.get("status");
      
      // Check if we're returning from Telebirr payment
      if (transactionId && paymentMethod === "telebirr") {
        // Verify the payment
        verifyTelebirrPayment(transactionId);
      }
    }, [paymentMethod, window.location.search]);

    // Auto-proceed with registration after Telebirr payment verification (from URL callback)
    useEffect(() => {
      // Only auto-proceed if we're coming from a Telebirr callback (real mode)
      // In mock mode, verification happens immediately in processPayment
      const isMockEnabled = import.meta.env.VITE_TELEBIRR_MOCK_ENABLED === "true";
      if (!isMockEnabled && step === 3 && paymentMethod === "telebirr" && telebirrPaymentVerified && !isProcessingPayment && !isVerifyingTelebirr) {
        // Automatically submit the form to proceed with registration
        onSubmit(form.getValues());
      }
    }, [step, paymentMethod, telebirrPaymentVerified, isProcessingPayment, isVerifyingTelebirr]);

  async function fetchRoundCapacity(roundId: number) {
    try {
      const response = await fetch(
        `/api/ey-participants/round/${roundId}/capacity`
      );

      if (!response.ok) return null;

      return await response.json();
    } catch {
      return null;
    }
  }

  async function verifyFayda(
    faydaId?: string,
    options: { code?: string; codeVerifier?: string } = {},
  ) {
    setIsVerifying(true);

    try {
      const response = await fetch("/api/fayda/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faydaId,
          code: options.code,
          codeVerifier: options.codeVerifier,
        }),
      });
      const result = (await response.json()) as FaydaVerificationResult;

      if (result.authUrl && result.state && result.codeVerifier) {
        sessionStorage.setItem("fayda_state", result.state);
        sessionStorage.setItem("fayda_code_verifier", result.codeVerifier);
        window.location.assign(result.authUrl);
        return false;
      }

      if (!response.ok || !result.verified) {
        toast({
          title: t.ey_register.error,
          description: result.error || t.ey_register.something_wrong,
          variant: "destructive",
        });
        return false;
      }

      setFaydaVerificationProfile(result);
      
      if (result.id) {
        form.setValue("faydaId", result.id);
      }
      
      const nameParts = (result.name || "").trim().split(/\s+/).filter(Boolean);
      if (nameParts.length >= 2 && !form.getValues("firstName") && !form.getValues("lastName")) {
        form.setValue("firstName", nameParts[0]);
        form.setValue("lastName", nameParts[nameParts.length - 1]);
        if (nameParts.length > 2) form.setValue("middleName", nameParts.slice(1, -1).join(" "));
      }
      
      if (result.phone && !form.getValues("phoneNumber")) {
        form.setValue("phoneNumber", result.phone);
      }
      
      if (result.email && !form.getValues("email")) {
        form.setValue("email", result.email);
      }

      return true;
    } catch {
      toast({
        title: t.ey_register.error,
        description: t.ey_register.something_wrong,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  }

    async function processPayment(paymentMethod: string) {
      if (paymentMethod === "telebirr") {
        // Check if we're in mock mode
        const isMockEnabled = import.meta.env.VITE_TELEBIRR_MOCK_ENABLED === "true";
        
        if (isMockEnabled) {
          // In mock mode, automatically verify payment
          setIsVerifyingTelebirr(true);
          // Simulate payment processing delay
          await new Promise((resolve) => setTimeout(resolve, 1500));
          // Generate a mock transaction ID and store it in bankReference for backend verification
          const mockTransactionId = `MOCK-${Date.now()}`;
          setTelebirrPaymentVerified(true);
          setIsVerifyingTelebirr(false);
          // Update the form's bankReference with the mock transaction ID
          form.setValue("bankReference", mockTransactionId);
          return true;
        } else {
          // In real mode, initiate payment and wait for callback
          setIsProcessingPayment(true);
          try {
            const response = await fetch("/api/telebirr/initiate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: 100,
                orderTitle: "Excellent Youth Registration",
                merchOrderId: `EY-${Date.now()}`,
                callbackInfo: "EY Registration Payment",
              }),
            });

            if (!response.ok) {
              setIsProcessingPayment(false);
              toast({
                title: t.ey_register.payment_failed,
                description: t.ey_register.unable_verify_payment,
                variant: "destructive",
              });
              return false;
            }

            const result = await response.json();
            
            // Check for new API response format
            if (result.code === "0" && result.msg === "success") {
              // In real mode, we should always get a paymentUrl to redirect to
              if (result.data?.toPayUrl) {
                // Redirect to Telebirr payment page
                window.location.assign(result.data.toPayUrl);
                return true;
              } else {
                // No paymentUrl means something went wrong
                setIsProcessingPayment(false);
                toast({
                  title: t.ey_register.payment_failed,
                  description: t.ey_register.unable_verify_payment,
                  variant: "destructive",
                });
                return false;
              }
            } else {
              // Handle error response
              setIsProcessingPayment(false);
              toast({
                title: t.ey_register.payment_failed,
                description: result.msg || t.ey_register.unable_verify_payment,
                variant: "destructive",
              });
              return false;
            }
          } catch (error) {
            setIsProcessingPayment(false);
            toast({
              title: t.ey_register.payment_failed,
              description: t.ey_register.unable_verify_payment,
              variant: "destructive",
            });
            return false;
          }
        }
      }

      setIsProcessingPayment(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsProcessingPayment(false);
      return true;
    }

   async function loadSelectedRoundCapacity(roundId: number) {
     const capacity = await fetchRoundCapacity(roundId);
 
     if (capacity) {
       setRoundCapacityStatus(capacity);
     }
   }
   
    async function verifyTelebirrPayment(transactionId: string) {
      setIsVerifyingTelebirr(true);
      try {
        const response = await fetch(`/api/telebirr/verify/${transactionId}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to verify payment");
        }

        const result = await response.json();
        
        // Check for new API response format
        if (result.code === "0" && result.msg === "success") {
          // New API format
          const isVerified = result.data && result.data.verified === true;
          if (isVerified) {
            setTelebirrPaymentVerified(true);
            setIsVerifyingTelebirr(false);
            toast({
              title: t.common.success,
              description: t.ey_register.payment_verified,
            });
            // Don't change step - let user continue through normal flow
          } else {
            toast({
              title: t.ey_register.payment_failed,
              description: t.ey_register.unable_verify_payment,
              variant: "destructive",
            });
            setIsVerifyingTelebirr(false);
          }
        } else if (result.success && result.verified) {
          // Old API format (backward compatibility)
          setTelebirrPaymentVerified(true);
          setIsVerifyingTelebirr(false);
          toast({
            title: t.common.success,
            description: t.ey_register.payment_verified,
          });
          // Don't change step - let user continue through normal flow
        } else {
          // Handle error response
          toast({
            title: t.ey_register.payment_failed,
            description: (result.msg || result.error || t.ey_register.unable_verify_payment),
            variant: "destructive",
          });
          setIsVerifyingTelebirr(false);
        }
      } catch (error) {
        toast({
          title: t.ey_register.payment_failed,
          description: t.ey_register.unable_verify_payment,
          variant: "destructive",
        });
        setIsVerifyingTelebirr(false);
      }
    }

  async function handleSignInWithFayda() {
    setIsVerifying(true);

    try {
      const response = await fetch("/api/fayda/auth-url", {
        method: "POST",
      });

      if (!response.ok) {
        toast({
          title: t.ey_register.error,
          description: t.ey_register.something_wrong,
          variant: "destructive",
        });
        return;
      }

      const auth = await response.json();
      
      // In mock mode, verification is returned directly with verified status
      if (auth.verified && auth.name) {
        setFaydaVerificationProfile(auth);
        setFaydaVerified(true);
        setStep(2);
        toast({
          title: t.common.success,
          description: t.ey_register.national_id_verified,
        });
        
        const nameParts = (auth.name || "").trim().split(/\s+/).filter(Boolean);
        if (nameParts.length >= 2) {
          form.setValue("firstName", nameParts[0]);
          form.setValue("lastName", nameParts[nameParts.length - 1]);
          if (nameParts.length > 2) form.setValue("middleName", nameParts.slice(1, -1).join(" "));
        }
        if (auth.phone && !form.getValues("phoneNumber")) {
          form.setValue("phoneNumber", auth.phone);
        }
        if (auth.email && !form.getValues("email")) {
          form.setValue("email", auth.email);
        }
        if (auth.id) {
          form.setValue("faydaId", auth.id);
        }
        return;
      }
      
      if (auth.authUrl && auth.state && auth.codeVerifier) {
        sessionStorage.setItem("fayda_state", auth.state);
        sessionStorage.setItem("fayda_code_verifier", auth.codeVerifier);
        window.location.assign(auth.authUrl);
      }
    } catch {
      toast({
        title: t.ey_register.error,
        description: t.ey_register.something_wrong,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  }

    async function onSubmit(data: FormValues) {
      try {
        // Handle Telebirr payment verification
        if (data.paymentMethod === "telebirr") {
          // If already verified, proceed with registration
          if (telebirrPaymentVerified) {
            // Proceed with registration (use current form data)
            const currentData = form.getValues();
            createParticipant.mutate(
              {
                data: currentData,
              },
              {
                onSuccess: (participant) => {
                  setRegistrationNumber(
                    participant.registrationNumber
                  );

                  setCoordinatorId(
                    participant.coordinatorId?.toString() || "N/A"
                  );

                  setStep(4);

                  toast({
                    title: t.common.success,
                    description:
                      participant.registrationNumber,
                  });
                },

                onError: () => {
                  toast({
                    title: t.ey_register.registration_failed,
                    description:
                      t.ey_register.unable_complete_registration,
                    variant: "destructive",
                  });
                },
              }
            );
            return;
          } else {
            // Initiate Telebirr payment process
            const paymentSuccess = await processPayment(data.paymentMethod);
            if (!paymentSuccess) {
              toast({
                title: t.ey_register.payment_failed,
                description: t.ey_register.unable_verify_payment,
                variant: "destructive",
              });
              return;
            }
            // For Telebirr:
            // - In mock mode: processPayment sets telebirrPaymentVerified=true and updates bankReference, we should proceed with registration
            // - In real mode: processPayment redirects to payment page, we should wait for callback
            const isMockEnabled = import.meta.env.VITE_TELEBIRR_MOCK_ENABLED === "true";
            if (!isMockEnabled) {
              // In real mode, we DON'T proceed with registration yet (wait for callback)
              return;
            }
            // In mock mode, we fall through to proceed with registration with updated form data
          }
        } else {
          // Handle bank payment (existing logic)
          const paymentSuccess = await processPayment(data.paymentMethod);
          if (!paymentSuccess) {
            toast({
              title: t.ey_register.payment_failed,
              description: t.ey_register.unable_verify_payment,
              variant: "destructive",
            });
            return;
          }
        }

        // Proceed with registration (for bank or verified telebirr)
        // Use current form data to ensure we have any updates made during payment processing
        const currentData = form.getValues();
        createParticipant.mutate(
          {
            data: currentData,
          },
          {
            onSuccess: (participant) => {
              setRegistrationNumber(
                participant.registrationNumber
              );

              setCoordinatorId(
                participant.coordinatorId?.toString() || "N/A"
              );

              setStep(4);

              toast({
                title: t.common.success,
                description:
                  participant.registrationNumber,
              });
            },

            onError: () => {
              toast({
                title: t.ey_register.registration_failed,
                description:
                  t.ey_register.unable_complete_registration,
                variant: "destructive",
              });
            },
          }
        );
      } catch {
        toast({
          title: t.ey_register.error,
          description: t.ey_register.something_wrong,
          variant: "destructive",
        });
      }
    }

  const progress = (step / 4) * 100;

  return (
    <div className="w-full min-h-screen bg-background">
      {/* HERO */}
      <section className="relative h-[35vh] min-h-72 flex items-center justify-center overflow-hidden">
        <img
          src={excellentyouth}
          alt="Excellent Youth Registration"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center text-white px-4">
          <Users className="h-14 w-14 mx-auto mb-4 text-white/80" />

          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            {t.ey_register.title}
          </h1>

          <p className="text-white/70 text-lg">
            {t.ey_register.subtitle}
          </p>
        </div>
      </section>

      {/* PROGRESS */}
      <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <Card className="rounded-3xl shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex justify-between text-sm mb-3">
              <span className="font-semibold">
                {t.ey_register.step} {step} {t.ey_register.of} 4
              </span>

              <span className="text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-4 gap-3 mt-5 text-center text-xs">
              <div
                className={
                  step >= 1 ? "text-primary font-bold" : ""
                }
              >
                {t.ey_register.verification}
              </div>

              <div
                className={
                  step >= 2 ? "text-primary font-bold" : ""
                }
              >
                {t.ey_register.details}
              </div>

              <div
                className={
                  step >= 3 ? "text-primary font-bold" : ""
                }
              >
                {t.ey_register.payment}
              </div>

              <div
                className={
                  step >= 4 ? "text-primary font-bold" : ""
                }
              >
                {t.ey_register.complete}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
            >
{/* STEP 1 */}
               {step === 1 && (
                 <Card className="rounded-3xl shadow-xl">
                   <CardContent className="p-8 md:p-12">
                     <div className="text-center mb-10">
                       <ShieldCheck className="h-14 w-14 mx-auto text-primary mb-4" />

                       <h2 className="text-3xl font-serif font-bold">
                         {t.ey_register.fayda_verification}
                       </h2>

                       <p className="text-muted-foreground mt-2">
                         {t.ey_register.verify_first}
                       </p>
                     </div>

                     <div className="max-w-xl mx-auto">
                       <Button
                         type="button"
                         onClick={handleSignInWithFayda}
                         disabled={isVerifying}
                         className="w-full mt-6 h-12 rounded-xl"
                       >
                         {isVerifying
                           ? t.ey_register.verifying
                           : t.ey_register.sign_in_with_fayda}

                         <LogIn className="ml-2 h-4 w-4" />
                       </Button>

                       {faydaVerified && faydaVerificationProfile && (
                         <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
                           <div className="font-semibold text-primary">
                             {t.ey_register.verified}
                           </div>
                           <div className="mt-1 text-muted-foreground">
                             {faydaVerificationProfile.name || faydaVerificationProfile.id}
                           </div>
                         </div>
                       )}
                     </div>
                   </CardContent>
                 </Card>
               )}

              {/* STEP 2 */}
              {step === 2 && (
                <Card className="rounded-3xl shadow-xl">
                  <CardContent className="p-8 md:p-12">
                    <div className="mb-10">
                      <h2 className="text-3xl font-serif font-bold">
                        {t.ey_register.participant_details}
                      </h2>

                      <p className="text-muted-foreground mt-2">
                        {t.ey_register.fill_personal_info}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t.ey_register.first_name}
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t.ey_register.middle_name}
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t.ey_register.last_name}
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t.ey_register.city}
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t.ey_register.phone_number}
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mb-5">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t.ey_register.email}
                            </FormLabel>

                            <FormControl>
                              <Input
                                type="email"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      <FormField
                        control={form.control}
                        name="eventId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t.ey_register.select_event}
                            </FormLabel>

                            <Select
                              value={
                                field.value
                                  ? field.value.toString()
                                  : undefined
                              }
                              onValueChange={(
                                value
                              ) =>
                                field.onChange(
                                  Number(value)
                                )
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t.ey_register.select_event} />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                {eyEvents.map(
                                  (event) => (
                                    <SelectItem
                                      key={
                                        event.id
                                      }
                                      value={event.id.toString()}
                                    >
                                      {
                                        event.title
                                      }
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="roundId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t.ey_register.select_round}
                            </FormLabel>

                            <Select
                              value={
                                field.value
                                  ? field.value.toString()
                                  : undefined
                              }
                              onValueChange={(
                                value
                              ) =>
                                field.onChange(
                                  Number(value)
                                )
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t.ey_register.select_round} />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                {availableRounds.map(
                                  (round) => (
                                    <SelectItem
                                      key={
                                        round.id
                                      }
                                      value={round.id.toString()}
                                    >
                                      Round{" "}
                                      {
                                        round.roundNumber
                                      }
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    {roundCapacityStatus && (
                      <div className="bg-muted p-4 rounded-xl text-sm mb-6">
                        <p className="font-semibold">
                          {
                            roundCapacityStatus.message
                          }
                        </p>

                        {!roundCapacityStatus.isFull && (
                          <p>
                            {
                              roundCapacityStatus.available
                            } {t.ey_register.seats_remaining}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setStep(1)
                        }
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {t.ey_register.back}
                      </Button>

                      <Button
                        type="button"
                        onClick={() =>
                          setStep(3)
                        }
                      >
                        {t.ey_register.continue}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <Card className="rounded-3xl shadow-xl">
                  <CardContent className="p-8 md:p-12">
                    <div className="mb-10">
                      <h2 className="text-3xl font-serif font-bold">
                        {t.ey_register.payment}
                      </h2>

                      <p className="text-muted-foreground mt-2">
                        {t.ey_register.complete_registration}
                      </p>
                    </div>

                     <FormField
                       control={form.control}
                       name="paymentMethod"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>
                               {t.ey_register.payment_method}
                           </FormLabel>

                           <FormControl>
                             <div className="grid md:grid-cols-2 gap-4">
                               <div className="border rounded-2xl p-6">
                                 <div className="flex items-center gap-3">
                                   <input
                                     type="radio"
                                     value="bank"
                                     checked={field.value === "bank"}
                                     onChange={(e) => {
                                       field.onChange(e.target.value);
                                     }}
                                     id="bank"
                                   />

                                   <Building2 className="h-5 w-5" />

                                   <label htmlFor="bank">
                                     {t.ey_register.bank_transfer}
                                   </label>
                                 </div>
                               </div>

                               <div className="border rounded-2xl p-6">
                                 <div className="flex items-center gap-3">
                                   <input
                                     type="radio"
                                     value="telebirr"
                                     checked={field.value === "telebirr"}
                                     onChange={(e) => {
                                       field.onChange(e.target.value);
                                     }}
                                     id="telebirr"
                                   />

                                   <CreditCard className="h-5 w-5" />

                                   <label htmlFor="telebirr">
                                     {t.ey_register.telebirr}
                                   </label>
                                 </div>
                               </div>
                             </div>
                           </FormControl>
                         </FormItem>
                       )}
                     />

                    {paymentMethod === "bank" && (
                      <div className="mt-6">
                        <FormField
                          control={form.control}
                          name="bankReference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t.ey_register.reference_number}
                              </FormLabel>

                              <FormControl>
                                <Input
                                  placeholder={t.ey_register.enter_payment_reference}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                      <div className="flex justify-between mt-10">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setStep(2)
                          }
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          {t.ey_register.back}
                        </Button>

                        {(paymentMethod === "telebirr" && !telebirrPaymentVerified) ? (
                          <Button
                            type="button"
                            onClick={() => {
                              // Trigger Telebirr payment process
                              onSubmit(form.getValues());
                            }}
                            disabled={
                              isProcessingPayment || isVerifyingTelebirr
                            }
                          >
                            {isProcessingPayment || isVerifyingTelebirr
                              ? t.ey_register.processing
                              : t.ey_register.pay_with_telebirr}
                            <CreditCard className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            disabled={
                              isProcessingPayment
                            }
                          >
                            {isProcessingPayment
                              ? t.ey_register.processing
                              : t.ey_register.complete_registration}
                            <CheckCircle2 className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                  </CardContent>
                </Card>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <Card className="rounded-3xl shadow-2xl border-0 overflow-hidden">
                  <CardContent className="p-10 text-center">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>

                    <h2 className="text-4xl font-serif font-bold mb-4">
                      {t.ey_register.registration_complete}
                    </h2>

                    <p className="text-muted-foreground mb-8">
                      {t.ey_register.registration_successful}
                    </p>

                    <div className="space-y-5 max-w-md mx-auto">
                      <div className="border rounded-2xl p-5">
                        <div className="text-sm text-muted-foreground mb-2">
                          {t.ey_register.registration_number}
                        </div>

                        <Badge className="text-lg px-5 py-2">
                          {registrationNumber}
                        </Badge>
                      </div>

                      <div className="border rounded-2xl p-5">
                        <div className="text-sm text-muted-foreground mb-2">
                          {t.ey_register.coordinator_id}
                        </div>

                        <Badge variant="secondary">
                          {coordinatorId}
                        </Badge>
                      </div>
                    </div>

                   
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
