import { useLanguage } from "@/lib/language-provider";
import { MapPin, Phone, Mail, Clock, Facebook, Youtube } from "lucide-react";

export default function Contact() {
  const { language } = useLanguage();

  return (
    <div className="w-full">
      {/* Banner */}
      <section className="bg-primary text-primary-foreground py-16 text-center">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            {language === 'am' ? 'አድራሻ' : 'Contact Us'}
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            {language === 'am' ? 'ደስ ደስ ብሎን ከእናንተ ጋር ለመነጋገር እንዘጋጃለን' : 'We would love to hear from you'}
          </p>
        </div>
      </section>

      <section className="py-16 container px-4 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">
                {language === 'am' ? 'አድራሻ መረጃ' : 'Get In Touch'}
              </h2>
              <p className="text-muted-foreground mb-8">
                {language === 'am'
                  ? 'ጥያቄ ካለዎት፣ ጸሎት ካስፈለጎት፣ ወይም ለቤተ ክርስቲያን ጉብኝት ካሰቡ — እናስተናግዳለን!'
                  : 'Have questions, prayer requests, or want to visit? We are always ready to welcome you with open arms.'}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{language === 'am' ? 'አድራሻ' : 'Location'}</h3>
                  <p className="text-muted-foreground">Gerji, Addis Ababa, Ethiopia</p>
                  <p className="text-muted-foreground text-sm">ገርጂ፣ አዲስ አበባ</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{language === 'am' ? 'ስልክ' : 'Phone'}</h3>
                  <p className="text-muted-foreground">+251 911 234 567</p>
                  <p className="text-muted-foreground">+251 922 345 678</p>
                  <p className="text-muted-foreground">+251 933 456 789</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{language === 'am' ? 'ኢሜይል' : 'Email'}</h3>
                  <p className="text-muted-foreground">info@ntpcethiopia.org</p>
                  <p className="text-muted-foreground">admin@ntpcethiopia.org</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{language === 'am' ? 'ፕሮግራም ሰዓቶች' : 'Service Times'}</h3>
                  <div className="space-y-1 text-muted-foreground text-sm">
                    <p><span className="font-medium text-foreground">{language === 'am' ? 'አርብ:' : 'Friday:'}</span> {language === 'am' ? 'ከጠዋቱ 10:00' : '10:00 AM (Local)'}</p>
                    <p><span className="font-medium text-foreground">{language === 'am' ? 'እሁድ:' : 'Sunday:'}</span> {language === 'am' ? 'ከሰዓት 3:00' : '3:00 PM (Local)'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Facebook className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{language === 'am' ? 'ማህበራዊ ሚዲያ' : 'Social Media'}</h3>
                  <div className="flex gap-4 mt-2">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline text-sm">
                      <Facebook className="h-4 w-4" /> Facebook
                    </a>
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-secondary hover:underline text-sm">
                      <Youtube className="h-4 w-4" /> YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">
              {language === 'am' ? 'ካርታ' : 'Find Us On The Map'}
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-lg border h-[400px] lg:h-[520px]">
              <iframe
                title="NTPC Location — Gerji, Addis Ababa"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.2!2d38.8!3d9.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85d7a3f04e57%3A0xb36e6a8e1c8b5a1!2sGerji%2C%20Addis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2set!4v1"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3 text-center">
              {language === 'am' ? 'ገርጂ፣ አዲስ አበባ፣ ኢትዮጵያ' : 'Gerji, Addis Ababa, Ethiopia'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
