import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLanguage } from "@/lib/language-provider";

const postEditSchema = z.object({
  title: z.string().min(1, "Title required"),
  highlights: z.string().min(1, "Highlights required"),
  photoUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
});

type PostEditValues = z.infer<typeof postEditSchema>;

interface Post {
  id: number;
  title: string;
  highlights: string;
  photoUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  createdAt: string;
}

interface PostEditDialogProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: PostEditValues) => void;
  loading?: boolean;
}

export function PostEditDialog({ post, open, onOpenChange, onSave, loading }: PostEditDialogProps) {
  const { t } = useLanguage();
  const form = useForm<PostEditValues>({
    resolver: zodResolver(postEditSchema),
    defaultValues: {
      title: "",
      highlights: "",
      photoUrl: "",
      facebookUrl: "",
      youtubeUrl: "",
    },
  });

  React.useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        highlights: post.highlights,
        photoUrl: post.photoUrl || "",
        facebookUrl: post.facebookUrl || "",
        youtubeUrl: post.youtubeUrl || "",
      });
    }
  }, [post, form]);

  const handleSubmit = (data: PostEditValues) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t.admin.church.edit} {t.admin.church.sermon_title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.admin.church.sermon_title}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.admin.church.sermon_title} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="highlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.admin.church.highlights}</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder={t.admin.church.highlights} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="photoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.admin.church.photo_url}</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.admin.church.facebook_url}</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.admin.church.youtube_url}</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t.admin.church.cancel}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t.admin.common.loading : t.admin.church.save}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}