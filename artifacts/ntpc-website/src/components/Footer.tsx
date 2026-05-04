import { Link } from "wouter";
import { useLanguage } from "@/lib/language-provider";
import { Facebook, Youtube, Instagram, MapPin, Phone, Mail } from "lucide-react";
import logoUrl from "@assets/photo_1_2026-05-03_16-37-24_1777851536098.jpg";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary/5 dark:bg-card border-t mt-12 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img src={logoUrl} alt="NTPC Logo" className="h-12 w-12 rounded-full object-cover border-2 border-primary/20" />
              <span className="font-serif font-bold text-xl text-primary">NTPC</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-serif text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">{t.nav.about}</Link></li>
              <li><Link href="/programs" className="hover:text-primary transition-colors">{t.nav.programs}</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">{t.nav.events}</Link></li>
              <li><Link href="/posts" className="hover:text-primary transition-colors">{t.nav.posts}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-serif text-lg">Get Involved</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/youth" className="hover:text-primary transition-colors">{t.nav.youth}</Link></li>
              <li><Link href="/departments" className="hover:text-primary transition-colors">{t.nav.departments}</Link></li>
              <li><Link href="/join" className="hover:text-primary transition-colors">{t.nav.join}</Link></li>
              <li><Link href="/support" className="hover:text-primary transition-colors">{t.nav.support}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-serif text-lg">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Gerji, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+251 911 234 567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>info@ntpcethiopia.org</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t.footer.description} {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
