import { Link } from "wouter";
import { useLanguage } from "@/lib/language-provider";
import { DailyScripture } from "@/components/DailyScripture";
import { useListPosts, useListEvents } from "@workspace/api-client-react";
import { Calendar, ArrowRight, BookOpen, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import heroBg from "@assets/photo_3_2026-05-03_16-37-24_1777851536098.jpg";
import ntpcBanner from "@assets/ntpcbanner.jpg";
import youthCamp1 from "@assets/home1.jpg";
import youthCamp2 from "@assets/home2.jpg";
import youthCamp3 from "@assets/home3.jpg";
import youthCamp4 from "@assets/home4.jpg";

export default function Home() {
  const { t, language } = useLanguage();
  const { data: posts = [] } = useListPosts();
  const { data: events = [] } = useListEvents();

  const recentPosts = posts.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  // Background image carousel
  const backgroundImages = [ntpcBanner, youthCamp1, youthCamp2, youthCamp3, youthCamp4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="w-full">
{/* Hero Section */}
       <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0">
           <AnimatePresence mode="wait">
             <motion.div
               key={currentImageIndex}
               initial={{ opacity: 0, scale: 1.1 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               className="absolute inset-0"
             >
               <img
                 src={backgroundImages[currentImageIndex]}
                 alt="Church Community"
                 className="w-full h-full object-cover"
               />
             </motion.div>
           </AnimatePresence>
           <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Floating animation elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-20 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm hidden lg:block"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-32 right-32 w-12 h-12 bg-primary/20 rounded-full backdrop-blur-sm hidden lg:block"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm hidden lg:block"
          />
        </div>
        
        <div className="relative z-10 container px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
          >
            <span className="text-sm font-medium tracking-wider uppercase">Welcome to NTPC</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70"
          >
            {language === 'am' ? t.hero.slogan : "ለኔ ህይወት ክርስቶስ ነዉ!"}
          </motion.h1>
          
          {language === 'en' && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl font-serif text-white/80 mb-10 max-w-2xl mx-auto"
            >
              For me to live is Christ!
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg h-auto shadow-[0_0_40px_-10px_rgba(107,33,168,0.5)]">
              <Link href="/join">{t.hero.join_us}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-full px-8 py-6 text-lg h-auto backdrop-blur-md">
              <Link href="/support">{t.hero.support}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Preview Sections */}
      <section className="py-24 bg-card">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Recent Posts */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-bold flex items-center gap-3">
                  <BookOpen className="text-primary h-8 w-8" />
                  {t.nav.posts}
                </h2>
                <Button variant="ghost" asChild className="hidden sm:flex">
                  <Link href="/posts" className="flex items-center gap-2">
                    {t.common.view_all} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-6">
                {recentPosts.length > 0 ? recentPosts.map(post => (
                  <Card key={post.id} className="group hover:shadow-lg transition-all border-none shadow-md bg-background overflow-hidden">
                    <CardContent className="p-0 flex flex-col sm:flex-row h-full">
                      {post.photoUrl && (
                        <div className="w-full sm:w-1/3 shrink-0 overflow-hidden">
                          <img src={post.photoUrl} alt={post.title} className="w-full h-full object-cover min-h-[150px] group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-6 flex flex-col justify-center w-full">
                        <span className="text-xs text-muted-foreground font-medium mb-2">{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                        <h3 className="text-xl font-bold mb-2 font-serif group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.highlights}</p>
                        <Link href={`/posts/${post.id}`} className="text-primary font-medium text-sm inline-flex items-center mt-auto">
                          {t.common.read_more} <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    No recent posts available.
                  </div>
                )}
              </div>
              <Button variant="outline" asChild className="w-full mt-6 sm:hidden">
                <Link href="/posts">{t.common.view_all}</Link>
              </Button>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-bold flex items-center gap-3">
                  <Calendar className="text-secondary h-8 w-8" />
                  {t.nav.events}
                </h2>
                <Button variant="ghost" asChild className="hidden sm:flex">
                  <Link href="/events" className="flex items-center gap-2">
                    {t.common.view_all} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-6">
                {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                  <div key={event.id} className="flex gap-6 group">
                    <div className="bg-secondary/10 text-secondary rounded-xl p-4 flex flex-col items-center justify-center min-w-[80px] shrink-0 border border-secondary/20">
                      <span className="text-sm font-bold uppercase">{format(new Date(event.date), 'MMM')}</span>
                      <span className="text-3xl font-serif font-bold leading-none">{format(new Date(event.date), 'd')}</span>
                    </div>
                    <div className="border-b pb-6 w-full flex flex-col justify-center">
                      <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-secondary transition-colors">{event.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    No upcoming events.
                  </div>
                )}
              </div>
              <Button variant="outline" asChild className="w-full mt-6 sm:hidden">
                <Link href="/events">{t.common.view_all}</Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="container px-4 text-center relative z-10">
          <HeartHandshake className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Be Part of the Community</h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Whether you want to join us for worship, serve in a department, or support the ministry, there is a place for you here.
          </p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button asChild size="lg" variant="secondary" className="rounded-full px-8 bg-white text-primary hover:bg-gray-100">
               <Link href="/join">Become a Member</Link>
             </Button>
             <Button asChild size="lg" className="rounded-full px-8 border-2 border-white/30 bg-transparent hover:bg-white/10 text-white">
               <Link href="/support">Support the Work</Link>
             </Button>
           </div>
         </div>
       </section>

       {/* Decoration Section */}
       <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 relative overflow-hidden">
         <div className="container px-4 relative z-10">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
             {[...Array(8)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1, duration: 0.5 }}
                 className="flex justify-center"
               >
<motion.div
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 4 + (i % 3),
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    }}
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-lg"
                    style={{ opacity: (30 + i * 5) / 100 }}
                  />
               </motion.div>
             ))}
           </div>
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 1, duration: 0.8 }}
             className="text-center mt-12"
           >
             <p className="text-muted-foreground text-lg font-serif italic">
               "Let us consider how we may spur one another on toward love and good deeds"
             </p>
             <p className="text-muted-foreground text-sm mt-2">Hebrews 10:24</p>
           </motion.div>
         </div>
         <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="absolute -top-20 -right-20 w-64 h-64 border-2 border-primary/10 rounded-full"
         />
         <motion.div
           animate={{ rotate: -360 }}
           transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
           className="absolute -bottom-32 -left-32 w-96 h-96 border-2 border-secondary/10 rounded-full"
         />
       </section>

       <DailyScripture />
    </div>
  );
}
