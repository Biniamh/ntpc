import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-provider";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ey1 from "@/assets/ey1.jpg";
import ey2 from "@/assets/ey2.jpg";
import ey3 from "@/assets/ey3.jpg";
import ey4 from "@/assets/ey4.jpg";
import ey5 from "@/assets/ey5.jpg";
import ey6 from "@/assets/ey6.jpg";
import ey7 from "@/assets/ey7.jpg";
import ey8 from "@/assets/ey8.jpg";
import ey9 from "@/assets/ey9.jpg";
import ey10 from "@/assets/ey10.jpg";
import ey11 from "@/assets/ey11.jpg";
import ey12 from "@/assets/ey12.jpg";
import ey13 from "@/assets/ey13.jpg";
import ey14 from "@/assets/ey14.jpg";
import ey15 from "@/assets/ey15.jpg";
import ey16 from "@/assets/ey16.jpg";
import ey17 from "@/assets/ey17.jpg";
import ey18 from "@/assets/ey18.jpg";
import ey19 from "@/assets/ey18.jpg";
import excellentyouth from "@/assets/excellentyouth.jpeg";

export default function Youth() {
  const { language } = useLanguage();

  const [selectedYear, setSelectedYear] = useState("2025");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  /* AUTO SLIDE */
  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [emblaApi, selectedYear]);

  const campFeatures = [
    {
      icon: "🔥",
      title: language === "am" ? "ነፃነት" : "Deliverance",
      desc:
        language === "am"
          ? "ሰፊ የጸሎት ጊዜና ነፃነት — ብዙ ወጣቶች ሕይወታቸው ተቀይሮ ይወጣሉ"
          : "Powerful prayer sessions and deliverance ministry that has set hundreds of youth free",
    },
    {
      icon: "📖",
      title: language === "am" ? "የቃሉ ትምህርት" : "Bible Teaching",
      desc:
        language === "am"
          ? "ጥልቅ የቃሉ ትምህርቶች ለወጣቱ ትውልድ"
          : "Deep, relevant Scripture teaching tailored for young people",
    },
    {
      icon: "🎵",
      title: language === "am" ? "አምልኮ" : "Worship",
      desc:
        language === "am"
          ? "ሕያው አምልኮ — ቀናት ሙሉ"
          : "Days immersed in anointed worship — an atmosphere of God's presence",
    },
    {
      icon: "👥",
      title: language === "am" ? "ወዳጅነት" : "Fellowship",
      desc:
        language === "am"
          ? "ለዘለዓለም የሚዘልቅ ወዳጅነት ይፈጠራል"
          : "Lifelong friendships and spiritual mentorship formed in a few days",
    },
  ];

   const yearlyPhotos = {
    "2025": [
      ey1,
      ey2,
      ey3,
      ey4,
      ey5,
      ey6,
      ey7,
    ],
    "2024": [
      ey8,
      ey9,
      ey10,
      ey11,
      ey12,
      ey13,
    ],
    "2023": [
      ey14,
      ey15,
      ey16,
      ey17,
      ey18,
    ],
  };

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src={excellentyouth}
          alt="Excellent Youth"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center text-white px-4 py-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-6 tracking-wider uppercase backdrop-blur">
            Excellent Youth
          </div>

          <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6">
            {language === "am" ? "መልካም ወጣት" : "Excellent Youth"}
          </h1>

          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
            {language === "am"
              ? "የዚህ ትውልድ ወጣቶች ቅዱሳን ሆነው ዓለምን ይቀይሩ!"
              : "Raising a generation of young people fully consecrated to Christ — on fire, unashamed, transformed."}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 bg-white text-primary hover:bg-white/90 font-bold text-lg h-auto py-4"
            >
              <Link href="/ey-register">
                {language === "am" ? "ይመዝገቡ" : "Register"}
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-10 border-white text-white bg-transparent hover:bg-white hover:text-primary font-bold text-lg h-auto py-4"
            >
              <Link href="/support">
                {language === "am"
                  ? "መልካም ወጣት ለመደገፍ"
                  : "Support Excellent Youth"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
            {language === "am"
              ? "ስለ መልካም ወጣት"
              : "About Excellent Youth"}
          </h2>

          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            {language === "am"
              ? "መልካም ወጣት ቤተ ክርስቲያናችን ወጣቱ ትውልድ ለክርስቶስ ሙሉ በሙሉ እንዲኖር የሚያዘጋጅ ክፍል ነው።"
              : "Excellent Youth is the dynamic youth department of NTPC, dedicated to raising young people who live fully for Christ through worship, discipleship, mentorship, outreach, and revival gatherings."}
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {campFeatures.map((f, i) => (
            <div
              key={i}
              className="bg-card border rounded-3xl p-8 text-center hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="text-5xl mb-5">{f.icon}</div>

              <h3 className="font-serif font-bold text-xl mb-3 text-primary">
                {f.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24 bg-card">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4 uppercase tracking-wide">
              {language === "am" ? "ዓመታዊ ጋለሪ" : "Yearly Gallery"}
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-5">
              {language === "am"
                ? "የካምፕ ፎቶዎች"
                : "Camp Photo Gallery"}
            </h2>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {language === "am"
                ? "ከየዓመቱ የተመረጡ የመልካም ወጣት ካምፕ ፎቶዎች"
                : "Explore unforgettable moments from Excellent Youth camps over the years."}
            </p>
          </div>

          {/* YEAR TABS */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {Object.keys(yearlyPhotos).map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-8 py-3 rounded-full border transition-all duration-300 font-semibold ${
                  selectedYear === year
                    ? "bg-primary text-white border-primary shadow-lg"
                    : "bg-background hover:bg-primary/10"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* CONTROLS */}
          <div className="flex justify-end gap-3 mb-6">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border bg-background hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border bg-background hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* SLIDER */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {yearlyPhotos[
                selectedYear as keyof typeof yearlyPhotos
              ].map((img, i) => (
                <div
                  key={i}
                  className="min-w-[85%] sm:min-w-[45%] lg:min-w-[30%]"
                >
                  <div className="group rounded-3xl overflow-hidden relative shadow-xl">
                    <img
                      src={img}
                      alt={`Camp ${selectedYear} ${i + 1}`}
                      className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="text-2xl font-serif font-bold mb-1">
                        Excellent Youth
                      </div>

                      <div className="text-white/80 text-sm">
                        {selectedYear} Winter Camp
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {[
              {
                num: "7",
                label: language === "am" ? "ቀናት ካምፕ" : "Days of Camp",
              },
              {
                num: "10000+",
                label:
                  language === "am"
                    ? "ተሳታፊ ወጣቶች"
                    : "Youth Participants",
              },
              {
                num: "10000",
                label:
                  language === "am"
                    ? "ሕይወት የተቀየሩ"
                    : "Lives Transformed",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-10 rounded-3xl border bg-background shadow-sm"
              >
                <div className="text-5xl font-serif font-bold text-primary mb-3">
                  {stat.num}
                </div>

                <div className="text-muted-foreground text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}