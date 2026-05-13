import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateMembershipRequest } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/language-provider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import congregationPhoto from "@assets/channels4_banner.jpg";

const schema = z.object({
  firstName: z.string().min(1, "First name required"),
  middleName: z.string().min(1, "Middle name required"),
  lastName: z.string().min(1, "Last name required"),
  phone: z.string().min(1, "Phone required"),
  email: z.string().email("Valid email required"),
  address: z.string().min(1, "Address required"),
  occupation: z.string().min(1, "Occupation required"),
  previousChurch: z.string().min(1, "Previous church required"),
  servingAs: z.string().min(0),
  baptized: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function Join() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const create = useCreateMembershipRequest();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "", middleName: "", lastName: "", phone: "", email: "",
      address: "", occupation: "", previousChurch: "", servingAs: "", baptized: false,
    },
  });

  function onSubmit(data: FormValues) {
    create.mutate({ data }, {
      onSuccess: () => {
        toast({ title: language === 'am' ? 'ተቀብሏል!' : 'Request Submitted!', description: language === 'am' ? 'እንኩዋን ወደ ቤተሰባችን ተቀላቀሉ, አስተባባሪዎች ይደውልሎታል!' : 'Welcome to the family! We will be in touch.' });
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
        <img src={congregationPhoto} alt="Join Us" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 text-center text-white px-4">
          <Users className="h-14 w-14 mx-auto mb-4 text-white/80" />
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-3">
            {language === 'am' ? 'አባል ይሁኑ' : 'Join Our Church Family'}
          </h1>
          <p className="text-white/75 text-lg">
            {language === 'am' ? 'ቤተ ቤታችሁ ነው!' : 'This is your home — you belong here!'}
          </p>
        </div>
      </section>

      <section className="py-16 container px-4 mx-auto max-w-2xl">
        <div className="bg-card border rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-serif font-bold mb-2 text-center">
            {language === 'am' ? 'የአባልነት ቅጽ' : 'Membership Application Form'}
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            {language === 'am' ? 'ቅጹን ሞልተው ያስገቡ — አስተዳዳሪው ያዩታል' : 'Complete this form and we will reach out to welcome you officially'}
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
              <FormField control={form.control} name="previousChurch" render={({ field }) => (
                <FormItem><FormLabel>{language === 'am' ? 'ቀድሞ ያባሉ ቤተ ክርስቲያን' : 'Previous Church Membership'}</FormLabel><FormControl><Input data-testid="input-previousChurch" placeholder={language === 'am' ? 'ቤተ ክርስቲያን ስም...' : 'Church name or N/A'} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="servingAs" render={({ field }) => (
                <FormItem><FormLabel>{language === 'am' ? 'ስለምን እናያዝ (ካሉ)' : 'Currently Serving As (if any)'}</FormLabel><FormControl><Input data-testid="input-servingAs" placeholder={language === 'am' ? 'ዘማሪ፣ ዲያቆን... ወይም ምንም' : 'Singer, Deacon... or leave blank'} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="baptized" render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'am' ? 'ተጠምቀዋል?' : 'Are you Baptized?'}</FormLabel>
                  <Select onValueChange={(v) => field.onChange(v === "true")} value={String(field.value)}>
                    <FormControl>
                      <SelectTrigger data-testid="select-baptized">
                        <SelectValue placeholder={language === 'am' ? 'ይምረጡ...' : 'Select...'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">{language === 'am' ? 'አዎ' : 'Yes'}</SelectItem>
                      <SelectItem value="false">{language === 'am' ? 'አይ' : 'No'}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" size="lg" className="w-full rounded-full" disabled={create.isPending} data-testid="button-submit">
                {create.isPending ? (language === 'am' ? 'እየተላከ...' : 'Submitting...') : (language === 'am' ? 'ቅጹን አስገባ' : 'Submit Application')}
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
