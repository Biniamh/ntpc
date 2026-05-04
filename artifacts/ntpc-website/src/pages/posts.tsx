import { Link } from "wouter";
import { useListPosts } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/language-provider";
import { BookOpen, Facebook, Youtube, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Posts() {
  const { language } = useLanguage();
  const { data: posts = [], isLoading } = useListPosts();

  return (
    <div className="w-full">
      {/* Banner */}
      <section className="bg-primary text-primary-foreground py-16 text-center">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            {language === 'am' ? 'ሳምንታዊ ስብከቶች ' : 'Weekly Sermons'}
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            {language === 'am' ? 'ሳምንታዊ የስብከትና ዜና ጽሑፎቻችን' : 'Weekly sermon highlights and church news'}
          </p>
        </div>
      </section>

      <section className="py-16 container px-4 mx-auto max-w-5xl">
        {isLoading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-serif">{language === 'am' ? 'አሁን ምንም ጽሑፍ የለም' : 'No posts yet'}</p>
          </div>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <article key={post.id} data-testid={`card-post-${post.id}`} className="group grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl border bg-card overflow-hidden hover:shadow-xl transition-all duration-300">
                {post.photoUrl ? (
                  <div className="md:col-span-1 overflow-hidden">
                    <img src={post.photoUrl} alt={post.title} className="w-full h-full object-cover min-h-[200px] group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="md:col-span-1 bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center min-h-[200px]">
                    <BookOpen className="h-16 w-16 text-primary/40" />
                  </div>
                )}
                <div className="md:col-span-2 p-8 flex flex-col">
                  <div className="text-xs text-muted-foreground font-medium mb-2">
                    {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                  </div>
                  <h2 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">{post.highlights}</p>
                  <div className="flex flex-wrap gap-3 mt-auto">
                    <Button asChild size="sm" className="rounded-full">
                      <Link href={`/posts/${post.id}`}>
                        {language === 'am' ? 'ተጨማሪ ያንብቡ' : 'Read More'} <ArrowRight className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>
                    {post.facebookUrl && (
                      <Button asChild size="sm" variant="outline" className="rounded-full gap-2">
                        <a href={post.facebookUrl} target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-4 w-4" /> Facebook
                        </a>
                      </Button>
                    )}
                    {post.youtubeUrl && (
                      <Button asChild size="sm" variant="outline" className="rounded-full gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950">
                        <a href={post.youtubeUrl} target="_blank" rel="noopener noreferrer">
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
