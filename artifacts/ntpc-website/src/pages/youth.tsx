import { useLanguage } from "@/lib/language-provider";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import youthCamp1 from "@/assets/youth-camp-1.png";
import youthCamp2 from "@/assets/youth-camp-2.png";
import youthCamp3 from "@/assets/youth-camp-3.png";
import youthCamp4 from "@/assets/youth-camp-4.png";
import congregationPhoto from "@assets/photo_3_2026-05-03_16-37-24_1777851536098.jpg";

export default function Youth() {
  const { language } = useLanguage();

  const campFeatures = [
    {
      icon: "🔥",
      title: language === 'am' ? 'ነፃነት' : 'Deliverance',
      desc: language === 'am' ? 'ሰፊ የጸሎት ጊዜና ነፃነት — ብዙ ወጣቶች ሕይወታቸው ተቀይሮ ይወጣሉ' : 'Powerful prayer sessions and deliverance ministry that has set hundreds of youth free',
    },
    {
      icon: "📖",
      title: language === 'am' ? 'የቃሉ ትምህርት' : 'Bible Teaching',
      desc: language === 'am' ? 'ጥልቅ የቃሉ ትምህርቶች ለወጣቱ ትውልድ' : 'Deep, relevant Scripture teaching tailored for young people',
    },
    {
      icon: "🎵",
      title: language === 'am' ? 'አምልኮ' : 'Worship',
      desc: language === 'am' ? 'ሕያው አምልኮ — ቀናት ሙሉ' : 'Days immersed in anointed worship — an atmosphere of God\'s presence',
    },
    {
      icon: "👥",
      title: language === 'am' ? 'ወዳጅነት' : 'Fellowship',
      desc: language === 'am' ? 'ለዘለዓለም የሚዘልቅ ወዳጅነት ይፈጠራል' : 'Lifelong friendships and spiritual mentorship formed in a few days',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <img src={congregationPhoto} alt="Youth" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative z-10 text-center text-white px-4 py-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-6 tracking-wider uppercase">
            Excellent Youth
          </div>
          <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6">
            {language === 'am' ? 'ለክርስቶስ ሲያቃጥሉ' : 'Burning Bright for Christ'}
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
            {language === 'am'
              ? 'የዚህ ትውልድ ወጣቶች ቅዱሳን ሆነው ዓለምን ይቀይሩ!'
              : 'Raising a generation of young people fully consecrated to Christ — on fire, unashamed, transformed.'}
          </p>
          <Button asChild size="lg" className="rounded-full px-10 bg-white text-primary hover:bg-white/90 font-bold text-lg h-auto py-4">
            <Link href="/join">{language === 'am' ? 'አባልነት ለጥቀቅ' : 'Join the Movement'}</Link>
          </Button>
        </div>
      </section>

      {/* About the Youth Ministry */}
      <section className="py-20 container px-4 mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            {language === 'am' ? 'ስለ ወጣቱ ክፍል' : 'About Excellent Youth'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            {language === 'am'
              ? 'Excellent Youth ቤተ ክርስቲያናችን ወጣቱ ትውልድ ለክርስቶስ ሙሉ በሙሉ እንዲኖር የሚያዘጋጅ ክፍል ነው። ፕሮግራሞቻቸን፣ ዓመታዊ የበጋ ካምፕ፣ ሳምንታዊ ስብሰባ እና ወጣቶች ዓለምን እንዲቀይሩ ዝቅ ዝቅ ማለት ሁሉ ያካትታል።'
              : 'Excellent Youth is the dynamic youth department of NTPC, dedicated to raising young people (ages 13-35) who live fully for Christ. Through weekly Bible studies, mentorship, outreach, and our annual transformative summer camp, we equip a generation to be salt and light in their world.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {campFeatures.map((f, i) => (
            <div key={i} className="bg-card border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-serif font-bold text-lg mb-2 text-primary">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Annual Summer Camp */}
      <section className="py-20 bg-card">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4 uppercase tracking-wide">
              {language === 'am' ? 'ዓመታዊ' : 'Annual Event'}
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              {language === 'am' ? 'የበጋ ካምፕ' : 'Summer Camp'}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {language === 'am'
                ? 'ዓመቱ በጣም የሚጠበቅ ፕሮግራም — ሶስት ቀናት ቀናቶች ሙሉ ኃይለኛ አምልኮ፣ ትምህርት፣ ጸሎትና ነፃነት። ብዙ ወጣቶች ሕይወታቸው ፈፅሞ ተቀይሮ ወጥቷቸዋል።'
                : 'The most anticipated event of the year — three intense days of powerful worship, Bible teaching, prayer, and deliverance. Hundreds of youth have had life-changing encounters with God at this camp.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[youthCamp1, youthCamp2, youthCamp3, youthCamp4].map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden aspect-square">
                <img src={img} alt={`Youth Camp ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { num: '3', label: language === 'am' ? 'ቀናት ካምፕ' : 'Days of Camp' },
              { num: '500+', label: language === 'am' ? 'ተሳታፊ ወጣቶች' : 'Youth Participants' },
              { num: '100s', label: language === 'am' ? 'ሕይወት የተቀየሩ' : 'Lives Transformed' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 rounded-2xl border bg-background">
                <div className="text-5xl font-serif font-bold text-primary mb-2">{stat.num}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-6 text-lg">
              {language === 'am'
                ? 'ዘንድሮ ካምፕ ለምን አይቀላቀሉም? ሕይወትዎ ፈፅሞ ይቀየራል!'
                : 'Why not join us at the next camp? Your life will never be the same.'}
            </p>
            <Button asChild size="lg" className="rounded-full px-10">
              <Link href="/join">{language === 'am' ? 'ይቀላቀሉ' : 'Join Excellent Youth'}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Weekly Meeting */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-3">
            {language === 'am' ? 'ሳምንታዊ ስብሰባ' : 'Weekly Youth Meeting'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-2">
            {language === 'am' ? 'ሁሉም አርብ ከምሽቱ 10:00 — Excellent Youth ስብሰባ!' : 'Every Friday at 10:00 PM — Excellent Youth Service!'}
          </p>
          <p className="text-primary-foreground/60 text-sm">
            {language === 'am' ? 'ጋርጂ፣ አዲስ አበባ' : 'Gerji, Addis Ababa — All youth welcome!'}
          </p>
        </div>
      </section>
    </div>
  );
}
