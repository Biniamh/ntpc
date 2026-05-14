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
} from "lucide-react";

import excellentyouth from "@/assets/excellentyouth.jpeg";

const schema = z.object({
  faydaId: z.string().min(1, "National ID required"),

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

export default function Eyregister() {
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const [step, setStep] = useState(1);

  const [faydaVerified, setFaydaVerified] = useState(false);

  const [registrationNumber, setRegistrationNumber] = useState<
    string | null
  >(null);

  const [coordinatorId, setCoordinatorId] = useState<string | null>(
    null
  );

  const [isVerifying, setIsVerifying] = useState(false);

  const [isProcessingPayment, setIsProcessingPayment] =
    useState(false);

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

  async function verifyFayda(faydaId: string) {
    setIsVerifying(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsVerifying(false);

    return true;
  }

  async function processPayment() {
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

  async function handleVerifyFayda() {
    const faydaId = form.getValues("faydaId");

    if (!faydaId) {
      toast({
        title: t.ey_register.error,
        description: t.ey_register.please_enter_fayda_id,
        variant: "destructive",
      });

      return;
    }

    const verified = await verifyFayda(faydaId);

    if (verified) {
      setFaydaVerified(true);

      toast({
        title: t.common.success,
        description: t.ey_register.national_id_verified,
      });

      setStep(2);
    }
  }

  async function onSubmit(data: FormValues) {
    try {
      const paymentSuccess = await processPayment();

      if (!paymentSuccess) {
        toast({
          title: t.ey_register.payment_failed,
          description: t.ey_register.unable_verify_payment,
          variant: "destructive",
        });

        return;
      }

      createParticipant.mutate(
        {
          data,
        },
        {
          onSuccess: (participant) => {
            setRegistrationNumber(
              participant.registrationNumber
            );

            setCoordinatorId(
              participant.coordinatorId || "N/A"
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
                      <FormField
                        control={form.control}
                        name="faydaId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Fayda ID
                            </FormLabel>

                            <FormControl>
                              <Input
                                placeholder="Enter Fayda ID..."
                                className="h-12 rounded-xl"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        onClick={
                          handleVerifyFayda
                        }
                        disabled={isVerifying}
                        className="w-full mt-6 h-12 rounded-xl"
                      >
                        {isVerifying
                          ? t.ey_register.verifying
                          : t.ey_register.verify_continue}

                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
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
                            <RadioGroup
                              onValueChange={
                                field.onChange
                              }
                              defaultValue={
                                field.value
                              }
                              className="grid md:grid-cols-2 gap-4"
                            >
                              <div className="border rounded-2xl p-6">
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem
                                    value="bank"
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
                                  <RadioGroupItem
                                    value="telebirr"
                                    id="telebirr"
                                  />

                                  <CreditCard className="h-5 w-5" />

                                  <label htmlFor="telebirr">
                                    {t.ey_register.telebirr}
                                  </label>
                                </div>
                              </div>
                            </RadioGroup>
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