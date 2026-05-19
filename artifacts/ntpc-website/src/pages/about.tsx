import { useLanguage } from "@/lib/language-provider";
import visionaryPhoto from "@/assets/visionaryPhoto.jpg";
import ntpcbanner from "@/assets/channels4_banner.jpg";
import congregationPhoto from "@/assets/aboutPhoto.jpg";

export default function About() {
  const { language } = useLanguage();

  return (
    <div className="w-full">
      {/* Banner */}
      <section className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden">
        <img
          src={congregationPhoto}
          alt="Congregation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            {language === "am" ? "ስለ እኛ" : "About Us"}
          </h1>
          <p className="text-lg text-white/80">
            Ethiopian New Testament Priests Church
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold mb-4 text-primary">
                {language === "am" ? "ራዕያችን" : "Our Vision"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "am"
                  ? "ለክርስቶስ ፍፁም የሆኑ ሰዎችን ማቅረብ — ሕይወቱ ክርስቶስ ብቻ የሆነ ትውልድ ማነፅ። ቤተ ክርስቲያናችን ለእያንዳንዱ ሰው የእግዚአብሔርን ሕይወት ተሞልቶ እንዲኖር ያለምናል።"
                  : "To raise a generation fully consecrated to Christ — men and women whose life is Christ alone. We envision a church where every person walks in the fullness of God's life, transformed by the power of His Word and Spirit."}
              </p>
            </div>

            <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-8">
              <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold mb-4 text-secondary">
                {language === "am" ? "ተልዕኳችን" : "Our Mission"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "am"
                  ? "ወንጌልን ማብሰርና ደቀ መዛሙርት ማፍራት — ሰዎችን ከኃጢአት ወደ ነፃነት፣ ከጨለማ ወደ ብርሃን፣ ከሞት ወደ ሕይወት መምራት። በጸሎት፣ ቃሉና አምልኮ አማካኝነት ቤተሰቦቻቸን እናጠናክራለን።"
                  : "To preach the gospel and make disciples — leading people from sin to freedom, from darkness to light, from death to life. Through prayer, the Word, and worship, we strengthen families and equip believers to be salt and light in their communities."}
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-serif font-bold text-center mb-12">
              {language === "am" ? "የእምነታችን መሰረት" : "Our Core Values"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  title: language === "am" ? "ቃሉ" : "The Word",
                  desc:
                    language === "am"
                      ? "መጽሐፍ ቅዱስ የሕይወታችን ምሰሶ ነው"
                      : "Scripture is the foundation of everything we do",
                },
                {
                  title: language === "am" ? "ጸሎት" : "Prayer",
                  desc:
                    language === "am"
                      ? "ጸሎት የቤተ ክርስቲያናችን ትንፋሽ ነው"
                      : "Prayer is the breath of our church — we are a house of prayer",
                },
                {
                  title: language === "am" ? "ፍቅር" : "Love",
                  desc:
                    language === "am"
                      ? "አንዱ ለሌላው ከሚያሳዩት ፍቅር ይታወቃሉ"
                      : "We are known by the love we have for one another",
                },
              ].map((v, i) => (
                <div
                  key={i}
                  className="text-center p-6 rounded-xl border bg-card hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-serif font-bold mb-3 text-primary">
                    {v.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visionary Section */}
      <section className="py-20 bg-card">
        <div className="container px-4 mx-auto max-w-5xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-16">
            {language === "am" ? "ስለ ቤተ ክርስቲያናችን ባለራዕይ" : "Our Visionary"}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-xl" />
              <img
                src={visionaryPhoto}
                alt="Church Visionary"
                className="relative rounded-2xl w-full max-w-md mx-auto object-cover shadow-2xl border-4 border-primary/20"
                style={{ maxHeight: 480, objectPosition: "top" }}
              />
            </div>
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                {language === "am"
                  ? "መሪ አገልጋይ / ባለራዕይ"
                  : "Founding Pastor / Visionary"}
              </div>
              <h3 className="text-3xl font-serif font-bold mb-2">
                {language === "am"
                  ? " አገልጋይ ዮናታን አክሊሉ"
                  : "Pastor Yonatan Aklilu"}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {language === "am"
                  ? ' አገልጋይ ዮናታን አክሊሉ ለሀያ ከሚልቀቁ ዓመታት ለክርስቶስ ሕይወቱን ወስኗል። ቤተ ክርስቲያናችን ሰፊ ጉዞ አድርጋ ዛሬ ወደዚህ ደረጃ የደረሰችው በፀሎቱ፣ ሕይወቱና አስተምህሮው ነው። "ለኔ ህይወት ክርስቶስ ነዉ" የሚለው ቃሉ የቤተ ክርስቲያናችን ዋና ጥቅስ ነው።'
                  : 'Pastor Yonatan Aklilu has dedicated his life to Christ for over two decades. A man of deep prayer and uncompromising faith, he founded NTPC with a burning heart to see Ethiopia transformed by the power of the gospel. His signature message — "For me to live is Christ" (Philippians 1:21) — has become the DNA of this church family.'}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {language === "am"
                  ? "ስብከቱ አዲስ አበባን አልፎ በመላ ኢትዮጵያ ይታወቃል። ብዙ ወጣቶች፣ ቤተሰቦችና ማህበረሰቦች ሕይወታቸው ተቀይሮ ዛሬ ለእግዚአብሔር ሲኖሩ ይታያሉ።"
                  : "His preaching ministry extends far beyond Addis Ababa, reaching all corners of Ethiopia. Thousands of youth, families, and communities have been transformed under his anointed ministry, and the impact continues to multiply every year."}
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                {[
                  {
                    num: "20+",
                    label:
                      language === "am" ? "ዓመት አገልግሎት" : "Years in Ministry",
                  },
                  {
                    num: "10K+",
                    label: language === "am" ? "አባላት" : "Members",
                  },
                  {
                    num: "23",
                    label: language === "am" ? "ዲፓርትመንቶች" : "Departments",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-primary/5 rounded-xl p-4 border border-primary/10"
                  >
                    <div className="text-2xl font-serif font-bold text-primary">
                      {stat.num}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Building Photo */}
      <section className="relative h-[50vh] overflow-hidden">
        <img
          src={ntpcbanner}
          alt="Church Building"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <p className="text-3xl md:text-5xl font-serif font-bold mb-4">
              {language === "am" ? "እንኳን ወደ ቤታችሁ መጣችሁ" : "Welcome Home"}
            </p>
            <p className="text-white/80 text-lg">
              Gerji, Addis Ababa, Ethiopia
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
