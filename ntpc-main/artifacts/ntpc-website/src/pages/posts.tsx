import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useListPosts } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/language-provider";
import {
  BookOpen,
  Facebook,
  Youtube,
  ArrowRight,
  Search,
  Pin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Posts() {
  const { language } = useLanguage();
  const { data: posts = [], isLoading } = useListPosts();

  const [search, setSearch] = useState("");

  /* =========================
     SORT + PIN + SEARCH
  ========================== */
  const processedPosts = useMemo(() => {
    let list = [...posts];

    // pinned first, then newest
    list.sort((a, b) => {
      if ((b.pinned ?? false) === (a.pinned ?? false)) {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }
      return b.pinned ? 1 : -1;
    });

    if (search.trim()) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.highlights?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return list;
  }, [posts, search]);

  /* =========================
     LATEST POST HIGHLIGHT
  ========================== */
  const latestPost = useMemo(() => {
    return [...posts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )[0];
  }, [posts]);

  return (
    <div className="w-full">
      {/* BANNER */}
      <section className="bg-primary text-primary-foreground py-16 text-center">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            {language === "am"
              ? "ሳምንታዊ ስብከቶች"
              : "Weekly Sermons"}
          </h1>

          <p className="text-primary-foreground/80 text-lg">
            {language === "am"
              ? "ሳምንታዊ የስብከት"
              : "Weekly sermon highlights"}
          </p>

          {/* SEARCH */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                language === "am"
                  ? "ስብከቶች ፈልግ..."
                  : "Search sermons..."
              }
              className="w-full pl-10 pr-4 py-2 rounded-full border bg-background text-sm"
            />
          </div>
        </div>
      </section>

      {/* LATEST POST HIGHLIGHT */}
      {latestPost && (
        <section className="container mx-auto max-w-5xl px-4 mt-10">
          <div className="bg-secondary/10 border rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="text-sm text-muted-foreground">
                {language === "am" ? "በጣም አዲስ" : "Latest Post"}
              </div>

              <h2 className="text-2xl font-serif font-bold mt-1">
                {latestPost.title}
              </h2>

              <p className="text-muted-foreground text-sm mt-1">
                {latestPost.highlights}
              </p>
            </div>

            <Button asChild className="rounded-full">
              <Link href={`/posts/${latestPost.id}`}>
                {language === "am" ? "አንብብ" : "Read"}
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* POSTS LIST */}
      <section className="py-16 container px-4 mx-auto max-w-5xl">
        {isLoading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : processedPosts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />

            <p className="text-xl font-serif">
              {language === "am"
                ? "አሁን ምንም ስብከቶች የለም"
                : "No posts found"}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {processedPosts.map((post) => (
              <article
                key={post.id}
                data-testid={`card-post-${post.id}`}
                className="group grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl border bg-card overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* IMAGE */}
                {post.photoUrl ? (
                  <div className="md:col-span-1 overflow-hidden">
                    <img
                      src={post.photoUrl}
                      alt={post.title}
                      className="w-full h-full object-cover min-h-[200px] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="md:col-span-1 bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center min-h-[200px]">
                    <BookOpen className="h-16 w-16 text-primary/40" />
                  </div>
                )}

                {/* CONTENT */}
                <div className="md:col-span-2 p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-muted-foreground font-medium">
                      {format(
                        new Date(post.createdAt),
                        "MMMM d, yyyy"
                      )}
                    </div>

                    {post.pinned && (
                      <Pin className="h-4 w-4 text-primary" />
                    )}
                  </div>

                  <h2 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.highlights}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-auto">
                    <Button asChild size="sm" className="rounded-full">
                      <Link href={`/posts/${post.id}`}>
                        {language === "am"
                          ? "ተጨማሪ ያንብቡ"
                          : "Read More"}{" "}
                        <ArrowRight className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>

                    {post.facebookUrl && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="rounded-full gap-2"
                      >
                        <a
                          href={post.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Facebook className="h-4 w-4" /> Facebook
                        </a>
                      </Button>
                    )}

                    {post.youtubeUrl && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="rounded-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <a
                          href={post.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Youtube className="h-4 w-4" /> YouTube
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}