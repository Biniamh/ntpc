import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateMembershipRequest } from "@workspace/api-client-react";
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
import { Users } from "lucide-react";
import excellentyouth from "@/assets/excellentyouth.jpeg";

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

export default function Eyregister() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const create = useCreateMembershipRequest();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      occupation: "",
      previousChurch: "",
      servingAs: "",
      baptized: false,
    },
  });

  function onSubmit(data: FormValues) {
    create.mutate(
      { data },
      {
        onSuccess: () => {
          toast({
            title: language === "am" ? "ተቀብሏል!" : "Request Submitted!",
            description:
              language === "am"
                ? "ምዝገባው በስኬት ተጠናቁዋል, አስተባባሪዎች ይደውልሎታል!"
                : "Registration successful ! We will be in touch.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            title: language === "am" ? "ስህተት ተፈጥሯል" : "Error",
            description:
              language === "am" ? "እባክዎ እንደገና ይሞክሩ" : "Please try again",
            variant: "destructive",
          });
        },
      },
    );
  }

  return (
    <div className="w-full">
      <section className="relative h-[35vh] min-h-[240px] flex items-center justify-center overflow-hidden">
        <img
          src={excellentyouth}
          alt="Join Us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 text-center text-white px-4">
          <Users className="h-14 w-14 mx-auto mb-4 text-white/80" />
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-3">
            {language === "am"
              ? "2019 መልካም ወጣት ምዝገባ"
              : "Register for 2027 Excellent Youth"}
          </h1>
          <p className="text-white/75 text-lg">
            {language === "am" ? " 2018!" : "2026!"}
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
              ? "ቅጹን ሞልተው ያስገቡ — አስተዳዳሪው ያዩታል"
              : "Complete this form and we will reach out to welcome you officially"}
          </p>

          <p> Registration is not open yet</p>
        </div>
      </section>
    </div>
  );
}
