export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      departments: "Departments",
      programs: "Programs",
      events: "Events",
      posts: "Weekly Posts",
      youth: "Youth",
      support: "Support",
      join: "Join Us",
      contact: "Contact",
      admin: "Admin",
      members: "Members",
    },
    hero: {
      slogan: "For me to live is Christ!",
      join_us: "Join Our Family",
      support: "Support Ministry",
    },
    footer: {
      description: "Ethiopian New Testament Priests Church. A vibrant community of faith in Addis Ababa.",
      rights: "All rights reserved.",
    },
    common: {
      loading: "Loading...",
      submit: "Submit",
      error: "An error occurred",
      success: "Success",
      read_more: "Read More",
      view_all: "View All",
    }
  },
  am: {
    nav: {
      home: "መነሻ",
      about: "ስለ እኛ",
      departments: "ክፍሎች",
      programs: "ፕሮግራሞች",
      events: "ዝግጅቶች",
      posts: "ሳምንታዊ ጽሑፎች",
      youth: "ወጣቶች",
      support: "ድጋፍ",
      join: "አባል ይሁኑ",
      contact: "አድራሻ",
      admin: "አስተዳዳሪ",
      members: "አባላት",
    },
    hero: {
      slogan: "ለኔ ህይወት ክርስቶስ ነዉ!",
      join_us: "ቤተሰባችንን ይቀላቀሉ",
      support: "አገልግሎቱን ይደግፉ",
    },
    footer: {
      description: "የኢትዮጵያ አዲስ ኪዳን ካህናት ቤተክርስቲያን። በአዲስ አበባ የሚገኝ ህያው የእምነት ማህበረሰብ።",
      rights: "መብቱ በህግ የተጠበቀ ነው።",
    },
    common: {
      loading: "በመጫን ላይ...",
      submit: "አስገባ",
      error: "ስህተት ተፈጥሯል",
      success: "በተሳካ ሁኔታ ተጠናቋል",
      read_more: "ተጨማሪ ያንብቡ",
      view_all: "ሁሉንም ይመልከቱ",
    }
  }
};

export type Language = 'en' | 'am';
export type TranslationKey = keyof typeof translations.en;
