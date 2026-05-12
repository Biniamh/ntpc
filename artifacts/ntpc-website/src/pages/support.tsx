import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateSupportSubmission } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/language-provider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HeartHandshake } from "lucide-react";
import congregationPhoto from "@assets/youth-camp-4.png";

const schema = z.object({
  firstName: z.string().min(1, "First name required"),
  middleName: z.string().min(1, "Middle name required"),
  lastName: z.string().min(1, "Last name required"),
  phone: z.string().min(1, "Phone required"),
  email: z.string().email("Valid email required"),
  address: z.string().min(1, "Address required"),
  occupation: z.string().min(1, "Occupation required"),
  amountPerMonth: z.coerce.number().min(0, "Must be >= 0"),
  amountPerYear: z.coerce.number().min(0, "Must be >= 0"),
  reason: z.string().min(1, "Reason required"),
});

type FormValues = z.infer<typeof schema>;

export default function Support() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const create = useCreateSupportSubmission();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "", middleName: "", lastName: "", phone: "", email: "",
      address: "", occupation: "", amountPerMonth: 0, amountPerYear: 0, reason: "",
    },
  });

  function onSubmit(data: FormValues) {
    create.mutate({ data }, {
      onSuccess: () => {
        toast({ title: language === 'am' ? 'ተቀብሏል!' : 'Submitted!', description: language === 'am' ? 'ምስጋና ለዓምላካዊ ልግስናዎ!' : 'Thank you for your generous support!' });
        form.reset();
      },
      onError: () => {
        toast({ title: language === 'am' ? 'ስህተት ተፈጥሯል' : 'Error', description: language === 'am' ? 'እባክዎ እንደገና ይሞክሩ' : 'Please try again', variant: "destructive" });
      },
    });
  }

  return (
    <div className="w-full">
      <section className="relative h-[35vh] min-h-[240px] flex items-center justify-center overflow-hidden">
        <img src={congregationPhoto} alt="Support" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4">
          <HeartHandshake className="h-14 w-14 mx-auto mb-4 text-white/80" />
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-3">
            {language === 'am' ? 'አገልግሎቱን ይደግፉ' : 'Support This Ministry'}
          </h1>
          <p className="text-white/75 text-lg">
            {language === 'am' ? 'ጸጋ ምላሽ ይሰጣሉ — ለእግዚአብሔር ክብር' : 'Your generosity advances the Kingdom of God'}
          </p>
        </div>
      </section>

      <section className="py-16 container px-4 mx-auto max-w-2xl">
        <div className="bg-card border rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-serif font-bold mb-2 text-center">
            {language === 'am' ? 'ቅጹን ይሙሉ' : 'Fill In Your Details'}
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            {language === 'am' ? 'ቅጹን ሞልተው ያስገቡ — አስተዳዳሪው ያዩታል' : 'Complete this form and our admin team will follow up with you'}
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(["firstName", "middleName", "lastName"] as const).map((name) => (
                  <FormField key={name} control={form.control} name={name} render={({ field }) => (
                    <FormItem>
                      <FormLabel>{name === "firstName" ? (language === 'am' ? 'ስም' : 'First Name') : name === "middleName" ? (language === 'am' ? 'የአባት ስም' : 'Middle Name') : (language === 'am' ? 'የቤተሰብ ስም' : 'Last Name')}</FormLabel>
                      <FormControl><Input data-testid={`input-${name}`} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>{language === 'am' ? 'ስልክ' : 'Phone'}</FormLabel><FormControl><Input data-testid="input-phone" type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>{language === 'am' ? 'ኢሜይል' : 'Email'}</FormLabel><FormControl><Input data-testid="input-email" type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel>{language === 'am' ? 'አድራሻ' : 'Address'}</FormLabel><FormControl><Input data-testid="input-address" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="occupation" render={({ field }) => (
                <FormItem><FormLabel>{language === 'am' ? 'ሥራ' : 'Occupation'}</FormLabel><FormControl><Input data-testid="input-occupation" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="amountPerMonth" render={({ field }) => (
                  <FormItem><FormLabel>{language === 'am' ? 'በወር (ብር)' : 'Amount/Month (ETB)'}</FormLabel><FormControl><Input data-testid="input-amountPerMonth" type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="amountPerYear" render={({ field }) => (
                  <FormItem><FormLabel>{language === 'am' ? 'በዓመት (ብር)' : 'Amount/Year (ETB)'}</FormLabel><FormControl><Input data-testid="input-amountPerYear" type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="reason" render={({ field }) => (
                <FormItem><FormLabel>{language === 'am' ? 'ምክንያት' : 'Reason'}</FormLabel><FormControl><Textarea data-testid="input-reason" rows={4} placeholder={language === 'am' ? 'ለምን ይደግፋሉ...' : 'Why do you want to support...'} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" size="lg" className="w-full rounded-full" disabled={create.isPending} data-testid="button-submit">
                {create.isPending ? (language === 'am' ? 'እየተላከ...' : 'Submitting...') : (language === 'am' ? 'አስገባ' : 'Submit')}
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
