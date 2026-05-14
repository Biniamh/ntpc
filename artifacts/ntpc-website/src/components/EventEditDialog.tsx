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

const eventEditSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().min(1, "Description required"),
  date: z.string().min(1, "Date required"),
  imageUrl: z.string().optional(),
});

type EventEditValues = z.infer<typeof eventEditSchema>;

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  createdAt: string;
}

interface EventEditDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: EventEditValues) => void;
  loading?: boolean;
}

export function EventEditDialog({ event, open, onOpenChange, onSave, loading }: EventEditDialogProps) {
  const { t } = useLanguage();
  const form = useForm<EventEditValues>({
    resolver: zodResolver(eventEditSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      imageUrl: "",
    },
  });

  React.useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        description: event.description,
        date: event.date.split('T')[0], // Convert to date input format
        imageUrl: event.imageUrl || "",
      });
    }
  }, [event, form]);

  const handleSubmit = (data: EventEditValues) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t.admin.events.edit}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.admin.events.title}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.admin.events.title} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.admin.events.description}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder={t.admin.events.description} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.admin.events.date}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.admin.events.image_url}</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t.admin.common.cancel}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t.admin.common.loading : t.admin.common.save}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}