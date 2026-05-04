import { useLanguage } from "@/lib/language-provider";
import congregationPhoto from "@assets/photo_3_2026-05-03_16-37-24_1777851536098.jpg";
import buildingPhoto from "@assets/photo_4_2026-05-03_16-37-24_1777851536098.jpg";

export default function Programs() {
  const { language } = useLanguage();

  const programs = [
    {
      day: language === 'am' ? 'አርብ' : 'Friday',
      time: language === 'am' ? 'ከጠዋቱ 10:00 (ሀበሻ ሰዓት)' : '10:00 AM (Local Ethiopian Time)',
      title: language === 'am' ? 'ሳምንታዊ የቃሉ ጥናትና አምልኮ' : 'Weekly Bible Study & Worship',
      description: language === 'am'
        ? 'ጥልቅ የቃሉ ጥናት፣ የጸሎት ሰዓትና አምልኮ። ሁሉም አቅምና እድሜ ያላቸው ምዕምናን ይሳተፋሉ። ይህ ፕሮግራም ሳምንቱን ሙሉ ለቀጣዩ ሳምንት ያዘጋጃል።'
        : 'An in-depth exploration of Scripture combined with powerful worship. Open to all believers. This gathering is the mid-week anchor that keeps our congregation spiritually fueled throughout the week.',
      highlights: [
        language === 'am' ? 'ጥልቅ የቃሉ ጥናት' : 'In-depth Bible teaching',
        language === 'am' ? 'ቡድናዊ ጸሎት' : 'Corporate prayer',
        language === 'am' ? 'አምልኮ' : 'Praise & worship',
        language === 'am' ? 'ምስክርነት' : 'Testimonies',
      ],
      image: buildingPhoto,
      accentColor: 'primary',
    },
    {
      day: language === 'am' ? 'እሁድ' : 'Sunday',
      time: language === 'am' ? 'ከሰዓት 3:00 (ሀበሻ ሰዓት)' : '3:00 PM (Local Ethiopian Time)',
      title: language === 'am' ? 'የዋናው አምልኮ ፕሮግራም' : 'Main Sunday Service',
      description: language === 'am'
        ? 'ድምቅ የሆነ ዋናው አምልኮ ፕሮግራም — ፓስተሩ ቃሉን ሲሰብኩ፣ NTPC መዘምራን፣ ልዩ የተጋበዙ ዘማሪዎችና ሌሎች ፕሮግራሞች። ቤተ ክርስቲያናችን ይህ ሳምንቱ ዋናው ስብሰባ ነው።'
        : 'Our main weekly gathering — a powerful service featuring the preached Word of God, worship by the NTPC Choir, performances by guest singers, and other uplifting programs. This is the heartbeat of our weekly rhythm.',
      highlights: [
        language === 'am' ? 'ስብከተ ወንጌል' : 'Preaching of God\'s Word',
        language === 'am' ? 'NTPC ዘማሪዎች' : 'NTPC Choir worship',
        language === 'am' ? 'ልዩ የተጋበዙ ዘማሪዎች' : 'Guest singer performances',
        language === 'am' ? 'አልታር ጥሪ' : 'Altar call & ministry',
      ],
      image: congregationPhoto,
      accentColor: 'secondary',
    },
  ];

  return (
    <div className="w-full">
      {/* Banner */}
      <section className="relative h-[35vh] min-h-[240px] flex items-center justify-center overflow-hidden">
        <img src={congregationPhoto} alt="Programs" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-3">
            {language === 'am' ? 'ዘወትራዊ ፕሮግራሞቻችን' : 'Our Regular Programs'}
          </h1>
          <p className="text-white/75 text-lg">Ethiopian New Testament Priests Church</p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 container px-4 mx-auto max-w-5xl">
        <div className="space-y-16">
          {programs.map((program, index) => (
            <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${program.accentColor === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                  {program.day}
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">{program.title}</h2>
                <div className={`text-lg font-semibold mb-5 ${program.accentColor === 'primary' ? 'text-primary' : 'text-secondary'}`}>
                  {program.time}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-8">{program.description}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {program.highlights.map((h, i) => (
                    <li key={i} className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${program.accentColor === 'primary' ? 'border-primary/20 bg-primary/5' : 'border-secondary/20 bg-secondary/5'}`}>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${program.accentColor === 'primary' ? 'bg-primary' : 'bg-secondary'}`} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img src={program.image} alt={program.title} className="w-full h-72 object-cover" />
                  <div className={`absolute inset-0 ${program.accentColor === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'}`} />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl p-4 text-white">
                    <div className="font-serif font-bold text-lg">{program.day} — {program.time}</div>
                    <div className="text-sm text-white/80">{language === 'am' ? 'ሁሉም ሰው ተቀባይነት አለው!' : 'All are welcome!'}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location CTA */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-4">
            {language === 'am' ? 'ጋርጂ፣ አዲስ አበባ' : 'Gerji, Addis Ababa, Ethiopia'}
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
            {language === 'am'
              ? 'ወደ ቤተ ክርስቲያናችን እንኳን ደህና መጡ — ቤት የሆነ ቦታ!'
              : 'Come as you are. You belong here. See you at our next gathering!'}
          </p>
        </div>
      </section>
    </div>
  );
}
