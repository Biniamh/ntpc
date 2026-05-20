import { Link } from "wouter";
import { useLanguage } from "@/lib/language-provider";
import { DailyScripture } from "@/components/DailyScripture";
import { useListPosts, useListEvents } from "@workspace/api-client-react";
import { Calendar, ArrowRight, BookOpen, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
            <span className="text-sm font-medium tracking-wider uppercase">{t.home.welcome}</span>
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
              {t.home.hero_subtitle}
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
                    {t.home.no_posts}
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
                    {t.home.no_events}
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

        {/* Church Information Section */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          />
          <div className="container px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                {t.home.our_story}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary">
                {t.home.about_church}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t.home.church_description}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Our Mission",
                  description: "To make disciples of all nations, teaching them to obey everything Jesus commanded, and to be a blessing to our community through love, service, and the proclamation of the Gospel.",
                  icon: "🎯",
                  color: "primary"
                },
                {
                  title: "Our Vision",
                  description: "To be a thriving church that transforms lives, impacts communities, and advances God's kingdom on earth through authentic worship, biblical teaching, and compassionate outreach.",
                  icon: "👁️",
                  color: "secondary"
                },
                {
                  title: "Our Values",
                  description: "We are committed to biblical truth, authentic community, passionate worship, compassionate service, and global missions. Every believer is valued and equipped to serve.",
                  icon: "❤️",
                  color: "primary"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 50, rotateX: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <div className="bg-card border rounded-2xl p-8 text-center hover:shadow-xl transition-all h-full relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${item.color} to-${item.color}/50`}></div>
                    <motion.div 
                      className="text-5xl mb-4 group-hover:scale-110 transition-transform"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    >
                      {item.icon}
                    </motion.div>
                    <h3 className="text-2xl font-serif font-bold mb-4 text-primary">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Church History Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-20 max-w-4xl mx-auto"
            >
              <h3 className="text-2xl font-serif font-bold text-center mb-8 text-primary">Our Journey</h3>
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20"></div>
                {[
                  { year: "2010", event: "Church Founded", desc: "Started with 50 faithful members" },
                  { year: "2015", event: "First Expansion", desc: "Moved to current location" },
                  { year: "2020", event: "Community Impact", desc: "Launched outreach programs" },
                  { year: "2024", event: "Digital Ministry", desc: "Online services and global reach" }
                ].map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <h4 className="font-bold text-primary">{item.event}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <motion.div 
                      className="w-2/12 flex justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {item.year}
                      </div>
                    </motion.div>
                    <div className="w-5/12"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <div className="inline-flex items-center gap-4 bg-primary/5 px-8 py-4 rounded-full">
                <span className="text-primary font-serif text-lg">{t.home.worship_sunday}</span>
              </div>
            </motion.div>
</div>
        </section>

        {/* Testimonial Section */}
        <section className="py-24 bg-card relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-3"></div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 border-2 border-primary/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-96 h-96 border-2 border-secondary/10 rounded-full"
          />
          
          <div className="container px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                {t.home.testimonies}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary">
                {t.home.lives_transformed}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.home.testimonies_intro}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  name: "Brother Yohannes M.",
                  role: "5 years at NTPC",
                  quote: "This church has been my family. Through every trial, the community has stood by me and helped me grow in my faith.",
                  avatar: "👨"
                },
                {
                  name: "Sister Mekdes T.",
                  role: "3 years at NTPC",
                  quote: "The youth ministry shaped who I am today. I found purpose, friendship, and a deeper relationship with Jesus.",
                  avatar: "👩"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-background rounded-2xl p-8 border relative"
                >
                  <div className="absolute top-4 right-4 text-4xl opacity-10">"</div>
                  <p className="text-lg italic mb-6 relative z-10">"{item.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
          <div className="container px-4 text-center relative z-10">
            <HeartHandshake className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">{t.home.be_part}</h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              {t.home.cta_intro}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8 bg-white text-primary hover:bg-gray-100">
                <Link href="/join">{t.home.become_member}</Link>
              </Button>
              <Button asChild size="lg" className="rounded-full px-8 border-2 border-white/30 bg-transparent hover:bg-white/10 text-white">
                <Link href="/support">{t.home.support_work}</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Church Services & Ministries Section */}
        <section className="py-24 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                {t.home.our_ministries}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary">
                {t.home.ministries_section_title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t.home.ministries_intro}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Sunday Worship",
                  description: "Join us every Sunday at 9:00 AM for powerful worship, inspiring messages, and meaningful fellowship. Experience the presence of God in a welcoming atmosphere.",
                  icon: "⛪",
                  time: "Sundays 9:00 AM",
                  color: "primary"
                },
                {
                  title: "Prayer & Fasting",
                  description: "Mid-week prayer meetings every Wednesday at 6:00 PM. A time for intercession, spiritual warfare, and seeking God's face for breakthroughs.",
                  icon: "🙏",
                  time: "Wednesdays 6:00 PM",
                  color: "secondary"
                },
                {
                  title: "Youth Ministry",
                  description: "Empowering the next generation through Excellent Youth programs, mentorship, and leadership development. Ages 13-25 welcome!",
                  icon: "✝️",
                  time: "Saturdays 4:00 PM",
                  color: "primary"
                },
                {
                  title: "Women's Fellowship",
                  description: "Building strong women of faith through Bible study, prayer groups, and community service. Monthly gatherings and special events.",
                  icon: "👩",
                  time: "2nd Saturday 3:00 PM",
                  color: "secondary"
                },
                {
                  title: "Men's Ministry",
                  description: "Developing godly men through accountability groups, leadership training, and service opportunities. Building character and spiritual strength.",
                  icon: "👨",
                  time: "1st Saturday 8:00 AM",
                  color: "primary"
                },
                {
                  title: "Children's Church",
                  description: "Safe, engaging environment where children learn about Jesus through age-appropriate lessons, songs, and activities during Sunday services.",
                  icon: "👶",
                  time: "Sundays 9:00 AM",
                  color: "secondary"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 50, rotateX: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <div className="bg-card border rounded-2xl p-8 h-full hover:shadow-xl transition-all relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${item.color} to-${item.color}/50`}></div>
                    <motion.div 
                      className="text-6xl mb-4 group-hover:scale-110 transition-transform"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                    >
                      {item.icon}
                    </motion.div>
                    <h3 className="text-2xl font-serif font-bold mb-3 text-primary">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm">{item.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {item.time}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <DailyScripture />
      </div>
    );
  }
