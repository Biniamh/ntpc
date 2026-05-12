import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateEyParticipant, useListEyEvents, useListEyRounds } from "@workspace/api-client-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CreditCard, Building } from "lucide-react";
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
  paymentSlip: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Eyregister() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [registrationNumber, setRegistrationNumber] = useState<string | null>(null);
  const [coordinatorId, setCoordinatorId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [roundCapacityStatus, setRoundCapacityStatus] = useState<{
    available: number;
    isFull: boolean;
    message: string;
  } | null>(null);

  const { data: eyEvents = [], isLoading: loadingEyEvents } = useListEyEvents();
  const { data: eyRounds = [], isLoading: loadingEyRounds } = useListEyRounds();
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
      paymentSlip: "",
    },
  });

  const selectedEventId = Number(form.watch("eventId"));
  const selectedRoundId = Number(form.watch("roundId"));
  const paymentMethod = form.watch("paymentMethod");

  const availableRounds = eyRounds.filter((round) => round.eventId === selectedEventId);

  useEffect(() => {
    if (selectedRoundId > 0) {
      loadSelectedRoundCapacity(selectedRoundId);
    } else {
      setRoundCapacityStatus(null);
    }
  }, [selectedRoundId]);

  async function fetchRoundCapacity(roundId: number) {
    try {
      const response = await fetch(`/api/ey-participants/round/${roundId}/capacity`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async function verifyFayda(faydaId: string): Promise<boolean> {
    setIsVerifying(true);
    // Mock Fayda verification - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsVerifying(false);
    return true; // Mock success
  }

  async function processPayment(paymentMethod: string, reference?: string): Promise<boolean> {
    setIsProcessingPayment(true);
    // Mock payment processing - replace with actual payment gateway
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessingPayment(false);
    return true; // Mock success
  }

  async function loadSelectedRoundCapacity(roundId: number) {
    const capacity = await fetchRoundCapacity(roundId);
    if (capacity) {
      setRoundCapacityStatus({
        available: capacity.available,
        isFull: capacity.isFull,
        message: capacity.message,
      });
    } else {
      setRoundCapacityStatus(null);
    }
  }

  function generateRegistrationNumber(): string {
    return `EY${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  async function onSubmit(data: FormValues) {
    try {
      // Verify Fayda
      const faydaVerified = await verifyFayda(data.faydaId);
      if (!faydaVerified) {
        toast({
          title: "Verification Failed",
          description: "Fayda ID verification failed. Please check your National ID.",
          variant: "destructive",
        });
        return;
      }

      // Real capacity check via backend
      const capacityResult = await fetchRoundCapacity(data.roundId);
      if (!capacityResult) {
        toast({
          title: "Error",
          description: "Unable to verify round capacity. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setRoundCapacityStatus({
        available: capacityResult.available,
        isFull: capacityResult.isFull,
        message: capacityResult.message,
      });

      if (capacityResult.isFull) {
        toast({
          title: "Round Full",
          description: capacityResult.message,
          variant: "destructive",
        });
        return;
      }

      // Process payment
      const paymentSuccess = await processPayment(data.paymentMethod, data.bankReference);
      if (!paymentSuccess) {
        toast({
          title: "Payment Failed",
          description: "Payment verification failed. Please try again.",
          variant: "destructive",
        });
        return;
      }

      createParticipant.mutate(
        {
          data: {
            ...data,
            paymentMethod: data.paymentMethod,
            bankReference: data.bankReference || undefined,
            paymentSlip: data.paymentSlip || undefined,
          },
        },
        {
          onSuccess: (participant) => {
            setRegistrationNumber(participant.registrationNumber);
            setCoordinatorId(participant.coordinatorId || "Not assigned");
            toast({
              title: "Registration Successful!",
              description: `Registration Number: ${participant.registrationNumber}`,
            });
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Registration failed during API submission.",
              variant: "destructive",
            });
          },
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (registrationNumber && coordinatorId) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-serif">Registration Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Registration Number</p>
              <Badge variant="default" className="text-lg px-4 py-2">{registrationNumber}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Coordinator ID</p>
              <Badge variant="secondary" className="text-lg px-4 py-2">{coordinatorId}</Badge>
            </div>
            <Button
              onClick={() => window.print()}
              className="w-full mt-6"
            >
              Print Registration Details
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="relative h-[35vh] min-h-60 flex items-center justify-center overflow-hidden">
        <img
          src={excellentyouth}
          alt="Excellent Youth Registration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 text-center text-white px-4">
          <Users className="h-14 w-14 mx-auto mb-4 text-white/80" />
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-3">
            {language === "am"
              ? "የመልካም ወጣት ምዝገባ"
              : "Excellent Youth Registration"}
          </h1>
          <p className="text-white/75 text-lg">
            {language === "am" ? "2026 ዓመት" : "2026 Winter Camp"}
          </p>
        </div>
      </section>

      <section className="py-16 container px-4 mx-auto max-w-2xl">
        <div className="bg-card border rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-serif font-bold mb-2 text-center">
            {language === "am"
              ? "የመልካም ወጣት ምዝገባ ቅጽ"
              : "Excellent Youth Registration Form"}
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            {language === "am"
              ? "ቅጹን ሞልተው ያስገቡ"
              : "Complete this form to register for the Excellent Youth Winter Camp"}
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Fayda Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    National ID Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="faydaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>National ID (Fayda)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your National ID..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      const faydaId = form.getValues("faydaId");
                      if (faydaId) {
                        const verified = await verifyFayda(faydaId);
                        toast({
                          title: verified ? "Verified" : "Verification Failed",
                          description: verified ? "National ID verified successfully" : "Please check your National ID",
                          variant: verified ? "default" : "destructive",
                        });
                      }
                    }}
                    disabled={isVerifying}
                  >
                    {isVerifying ? "Verifying..." : "Verify ID"}
                  </Button>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name (Optional)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Event Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Event & Round Selection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="eventId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event</FormLabel>
                        <Select
                          value={field.value ? field.value.toString() : undefined}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an event" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eyEvents.map((event) => (
                              <SelectItem key={event.id} value={event.id.toString()}>
                                {event.title} ({event.type} {event.year})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roundId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Round</FormLabel>
                        <Select
                          value={field.value ? field.value.toString() : undefined}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a round" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableRounds.map((round) => (
                              <SelectItem key={round.id} value={round.id.toString()}>
                                Round {round.roundNumber}
                                {round.fromDate && round.toDate ? ` (${round.fromDate} - ${round.toDate})` : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {selectedRoundId > 0 && roundCapacityStatus && (
                    <div className="rounded-lg border border-muted p-4 bg-muted/50 text-sm">
                      <p className="font-semibold">Round Capacity</p>
                      <p>{roundCapacityStatus.message}</p>
                      <p>{roundCapacityStatus.isFull ? "Please choose another round." : `${roundCapacityStatus.available} seats remain.`}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="bank" id="bank" />
                              <label htmlFor="bank" className="text-sm">Bank Transfer</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="telebirr" id="telebirr" />
                              <label htmlFor="telebirr" className="text-sm">TeleBirr</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {paymentMethod === "bank" && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="bankReference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reference Number</FormLabel>
                            <FormControl><Input placeholder="Enter reference number..." {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="paymentSlip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Slip Upload</FormLabel>
                            <FormControl>
                              <Input type="file" accept="image/*,.pdf" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {paymentMethod === "telebirr" && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        TeleBirr payment instructions will be shown here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={isVerifying || isProcessingPayment}
              >
                {isProcessingPayment ? "Processing Payment..." : "Complete Registration"}
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
