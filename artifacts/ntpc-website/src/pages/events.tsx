import { useListEvents } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/language-provider";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Events() {
  const { language } = useLanguage();
  const { data: events = [], isLoading } = useListEvents();

  return (
    <div className="w-full">
      {/* Banner */}
      <section className="bg-secondary text-secondary-foreground py-16 text-center">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            {language === 'am' ? 'መጪ ዝግጅቶች' : 'Upcoming Events'}
          </h1>
          <p className="text-secondary-foreground/80 text-lg">
            {language === 'am' ? 'ቀጣዩ ዝግጅት እንዳያልፎዎት!' : 'Don\'t miss what God is doing next!'}
          </p>
        </div>
      </section>

      <section className="py-16 container px-4 mx-auto max-w-5xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Calendar className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-serif">{language === 'am' ? 'አሁን ምንም ዝግጅት የለም' : 'No upcoming events at this time'}</p>
            <p className="text-sm mt-2">{language === 'am' ? 'ቶሎ ይምጡ!' : 'Check back soon!'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              return (
                <div key={event.id} data-testid={`card-event-${event.id}`} className="group rounded-2xl border bg-card overflow-hidden hover:shadow-xl transition-all duration-300">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                      <Calendar className="h-20 w-20 text-secondary/40" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-secondary/10 text-secondary rounded-xl p-3 text-center min-w-[60px] border border-secondary/20">
                        <div className="text-xs font-bold uppercase">{format(eventDate, 'MMM')}</div>
                        <div className="text-2xl font-serif font-bold leading-none">{format(eventDate, 'd')}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <h2 className="text-xl font-serif font-bold mb-2 group-hover:text-secondary transition-colors">{event.title}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
