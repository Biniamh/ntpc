import { useMemo, useState } from "react";
import { useListEvents } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/language-provider";
import { Calendar, Clock, Search, Pin } from "lucide-react";
import { format, isSameMonth, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type EventCategory = "youth" | "worship" | "prayer" | "general";

export default function Events() {
  const { language } = useLanguage();
  const { data: events = [], isLoading } = useListEvents();

  const [search, setSearch] = useState("");
  const [activeMonth, setActiveMonth] = useState(new Date());

  /* =========================
     SORT + FILTER + PIN
  ========================== */
  const processedEvents = useMemo(() => {
    const now = new Date();

    let list = [...events];

    // 1. PINNED FIRST
    list.sort((a, b) => {
      if (b.pinned === a.pinned) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return b.pinned ? 1 : -1;
    });

    // 2. FILTER SEARCH
    if (search.trim()) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return list;
  }, [events, search]);

  /* =========================
     NEXT EVENT
  ========================== */
  const nextEvent = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => new Date(e.date) >= now)
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0];
  }, [events]);

  /* =========================
     MONTH GRID (SIMPLE)
  ========================== */
  const monthEvents = useMemo(() => {
    return events.filter((e) =>
      isSameMonth(parseISO(e.date), activeMonth)
    );
  }, [events, activeMonth]);

  return (
    <div className="w-full">
      {/* HEADER */}
      <section className="bg-secondary text-secondary-foreground py-16 text-center">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            {language === "am" ? "መጪ ዝግጅቶች" : "Upcoming Events"}
          </h1>

          <p className="text-secondary-foreground/80 text-lg">
            {language === "am"
              ? "ቀጣዩ ዝግጅት እንዳያልፎዎት!"
              : "Don’t miss what God is doing next!"}
          </p>

          {/* SEARCH */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === "am" ? "ፈልግ..." : "Search events..."}
              className="w-full pl-10 pr-4 py-2 rounded-full border bg-background text-sm"
            />
          </div>
        </div>
      </section>

      {/* NEXT EVENT HIGHLIGHT */}
      {nextEvent && (
        <section className="container mx-auto max-w-5xl px-4 mt-10">
          <div className="bg-primary text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Clock className="h-4 w-4" />
                {format(new Date(nextEvent.date), "EEEE, MMM d")}
              </div>

              <h2 className="text-2xl font-serif font-bold mt-2">
                {language === "am" ? "ቀጣይ ዝግጅት" : "Next Event"}
              </h2>

              <p className="opacity-80">{nextEvent.title}</p>
            </div>

            <span className="px-4 py-2 bg-white text-primary rounded-full text-sm font-bold">
              {nextEvent.category ?? "event"}
            </span>
          </div>
        </section>
      )}

      {/* CONTENT */}
      <section className="py-12 container px-4 mx-auto max-w-5xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            {/* EVENTS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {processedEvents.map((event) => {
                const date = new Date(event.date);

                return (
                  <div
                    key={event.id}
                    className="rounded-2xl border bg-card overflow-hidden hover:shadow-xl transition"
                  >
                    {/* IMAGE */}
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="h-48 bg-secondary/10 flex items-center justify-center">
                        <Calendar className="h-16 w-16 opacity-30" />
                      </div>
                    )}

                    <div className="p-6">
                      {/* DATE + PIN */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-muted-foreground">
                          {format(date, "PPP")}
                        </div>

                        {event.pinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                      </div>

                      {/* CATEGORY */}
                      <div className="mb-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                          {event.category ?? "general"}
                        </span>
                      </div>

                      <h2 className="text-xl font-serif font-bold mb-2">
                        {event.title}
                      </h2>

                      <p className="text-muted-foreground text-sm">
                        {event.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MONTHLY CALENDAR GRID */}
            <div className="mt-16">
              <h2 className="text-2xl font-serif font-bold mb-4">
                {language === "am" ? "የወር እቅድ" : "Monthly View"}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {monthEvents.map((e) => (
                  <div
                    key={e.id}
                    className="p-4 border rounded-xl bg-background"
                  >
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(e.date), "MMM d")}
                    </div>

                    <div className="font-bold text-sm">{e.title}</div>

                    <div className="text-xs text-primary mt-1">
                      {e.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}