import { Link } from "wouter";
import { useGetPost, getGetPostQueryKey } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/language-provider";
import { ArrowLeft, Facebook, Youtube, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface PostDetailProps {
  params: { id: string };
}

export default function PostDetail({ params }: PostDetailProps) {
  const { language } = useLanguage();
  const id = Number(params.id);
  const { data: post, isLoading } = useGetPost(id, {
    query: { enabled: !!id, queryKey: getGetPostQueryKey(id) },
  });

  if (isLoading) {
    return (
      <div className="container px-4 mx-auto max-w-3xl py-16">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-60 mb-6" />
        <Skeleton className="h-4 mb-2" />
        <Skeleton className="h-4 mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p className="text-xl font-serif">{language === 'am' ? 'ጽሑፉ አልተገኘም' : 'Post not found'}</p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/posts"><ArrowLeft className="mr-2 h-4 w-4" /> {language === 'am' ? 'ወደ ጽሑፎች ተመለስ' : 'Back to Posts'}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {post.photoUrl && (
        <div className="relative h-[40vh] overflow-hidden">
          <img src={post.photoUrl} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      <div className="container px-4 mx-auto max-w-3xl py-12">
        <Button asChild variant="ghost" className="mb-8 rounded-full -ml-3">
          <Link href="/posts"><ArrowLeft className="mr-2 h-4 w-4" /> {language === 'am' ? 'ወደ ጽሑፎች' : 'Back to Posts'}</Link>
        </Button>
        <div className="text-sm text-muted-foreground mb-3">
          {format(new Date(post.createdAt), 'MMMM d, yyyy')}
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">{post.title}</h1>
        <div className="prose prose-lg max-w-none dark:prose-invert mb-10">
          <p className="text-muted-foreground leading-relaxed text-lg">{post.highlights}</p>
        </div>
        <div className="flex flex-wrap gap-4 pt-8 border-t">
          {post.facebookUrl && (
            <Button asChild size="lg" variant="outline" className="rounded-full gap-2">
              <a href={post.facebookUrl} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
                {language === 'am' ? 'ፌስቡክ ላይ ይመልከቱ' : 'View on Facebook'}
              </a>
            </Button>
          )}
          {post.youtubeUrl && (
            <Button asChild size="lg" variant="outline" className="rounded-full gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950">
              <a href={post.youtubeUrl} target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5" />
                {language === 'am' ? 'ዩቲዩብ ላይ ይመልከቱ' : 'Watch on YouTube'}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
