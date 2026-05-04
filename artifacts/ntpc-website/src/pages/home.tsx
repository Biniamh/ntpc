import { Link } from "wouter";
import { useLanguage } from "@/lib/language-provider";
import { DailyScripture } from "@/components/DailyScripture";
import { useListPosts, useListEvents } from "@workspace/api-client-react";
import { Calendar, ArrowRight, BookOpen, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

import heroBg from "@assets/photo_3_2026-05-03_16-37-24_1777851536098.jpg";

export default function Home() {
  const { t, language } = useLanguage();
  const { data: posts = [] } = useListPosts();
  const { data: events = [] } = useListEvents();

  const recentPosts = posts.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Church Congregation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container px-4 text-center text-white">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="text-sm font-medium tracking-wider uppercase">Welcome to NTPC</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 animate-in fade-in zoom-in-95 duration-1000 delay-150">
            {language === 'am' ? t.hero.slogan : "ለኔ ህይወት ክርስቶስ ነዉ!"}
          </h1>
          
          {language === 'en' && (
            <p className="text-xl md:text-2xl font-serif text-white/80 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              For me to live is Christ!
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg h-auto shadow-[0_0_40px_-10px_rgba(107,33,168,0.5)]">
              <Link href="/join">{t.hero.join_us}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-full px-8 py-6 text-lg h-auto backdrop-blur-md">
              <Link href="/support">{t.hero.support}</Link>
            </Button>
          </div>
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

      <DailyScripture />
    </div>
  );
}
