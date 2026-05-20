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
import { Users, Upload, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
   profilePhotoUrl: z.string().url().optional(),
});

type FormValues = z.infer<typeof schema>;

function PhotoUpload({ onChange, value }: { onChange: (url: string) => void; value?: string }) {
  const { language } = useLanguage();
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(language === 'am' ? 'ፎቶ መጠን ከ5MB አይበልጣም' : 'Photo must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setPreview(null);
    onChange("");
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">
        {language === 'am' ? 'የመገሪያ ፎቶ' : 'Profile Photo'}
      </Label>
      <div className="flex items-center gap-4">
        <motion.div
          className="relative w-24 h-24 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden bg-muted/30"
          whileHover={{ scale: 1.05 }}
        >
          {preview ? (
            <>
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <Camera className="h-8 w-8 text-muted-foreground" />
          )}
        </motion.div>
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-muted cursor-pointer transition-colors"
          >
            <Upload className="h-4 w-4" />
            {language === 'am' ? 'ፎቶ ይ� choice ዩ' : 'Choose Photo'}
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'am' ? 'PNG, JPG ወይም JPEG (max 5MB)' : 'PNG, JPG or JPEG (max 5MB)'}
          </p>
        </div>
      </div>
    </div>
  );
}

const Label = ({ className, ...props }: React.ComponentProps<"label">) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`} {...props} />
);

export default function Join() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const create = useCreateMembershipRequest();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "", middleName: "", lastName: "", phone: "", email: "",
      address: "", occupation: "", previousChurch: "", servingAs: "", baptized: false,
      profilePhotoUrl: "",
    },
  });

  function onSubmit(data: FormValues) {
    const payload = {
      ...data,
      profilePhotoUrl: data.profilePhotoUrl || undefined,
    };
    create.mutate({ data: payload }, {
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Users className="h-14 w-14 mx-auto mb-4 text-white/80" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-3"
          >
            {language === 'am' ? 'አባል ይሁኑ' : 'Join Our Church Family'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/75 text-lg"
          >
            {language === 'am' ? 'ቤታችሁ ነው!' : 'This is your home — you belong here!'}
          </motion.p>
        </div>
      </section>

      <section className="py-16 container px-4 mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card border rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-serif font-bold mb-2 text-center">
            {language === 'am' ? 'የአባልነት ቅጽ' : 'Membership Application Form'}
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            {language === 'am' ? 'ቅጹን ሞልተው ያስገቡ — አስተዳዳሪው ያዩታል' : 'Complete this form and we will reach out to welcome you officially'}
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(["firstName", "middleName", "lastName"] as const).map((name, index) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FormField key={name} control={form.control} name={name} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{name === "firstName" ? (language === 'am' ? 'ስም' : 'First Name') : name === "middleName" ? (language === 'am' ? 'የአባት ስም' : 'Middle Name') : (language === 'am' ? 'የቤተሰብ ስም' : 'Last Name')}</FormLabel>
                        <FormControl><Input data-testid={`input-${name}`} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </motion.div>
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
              <PhotoUpload
                value={form.watch("profilePhotoUrl")}
                onChange={(url) => form.setValue("profilePhotoUrl", url)}
              />
              <FormField control={form.control} name="previousChurch" render={({ field }) => (
                <FormItem><FormLabel>{language === 'am' ? 'ቀድሞ አባል የነበሩበት ቤተ ክርስቲያን' : 'Previous Church Membership'}</FormLabel><FormControl><Input data-testid="input-previousChurch" placeholder={language === 'am' ? 'ቤተ ክርስቲያን ስም...' : 'Church name or N/A'} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="servingAs" render={({ field }) => (
                <FormItem><FormLabel>{language === 'am' ? 'በምን ዘርፍ ያገለግሉ ነበር(ካለ)' : 'Currently Serving As (if any)'}</FormLabel><FormControl><Input data-testid="input-servingAs" placeholder={language === 'am' ? 'ዘማሪ፣ ዲያቆን... ወይም ምንም' : 'Singer, Deacon... or leave blank'} {...field} /></FormControl><FormMessage /></FormItem>
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button type="submit" size="lg" className="w-full rounded-full" disabled={create.isPending} data-testid="button-submit">
                  <AnimatePresence mode="wait">
                    {create.isPending ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {language === 'am' ? 'እየተላከ...' : 'Submitting...'}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {language === 'am' ? 'ቅጹን አስገባ' : 'Submit Application'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </section>
    </div>
  );
}