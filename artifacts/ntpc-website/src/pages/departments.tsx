import { useState } from "react";
import { Link } from "wouter";
import { useListDepartments, getListDepartmentsQueryKey } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/language-provider";
import { ChevronDown, ChevronUp, Users, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Departments() {
  const { language } = useLanguage();
  const { data: departments = [], isLoading } = useListDepartments({
    query: { queryKey: getListDepartmentsQueryKey() },
  });
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="w-full">
      <section className="bg-primary text-primary-foreground py-16 text-center">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            {language === 'am' ? 'ዲፓርትመንቶች ' : 'Our Departments'}
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
            {language === 'am'
              ? 'በቤተ ክርስቲያናችን ውስጥ ያሉ ዲፓርትመንቶች — ለሁሉም ቦታ አለ!'
              : 'Active ministries in our church — there is a place for everyone!'}
          </p>
        </div>
      </section>

      <section className="py-16 container px-4 mx-auto max-w-4xl">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : departments.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-serif">{language === 'am' ? 'ምንም ዲፓርትመንቶች አልተገኙም' : 'No departments found'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {departments.map((dept) => {
              const isOpen = openId === dept.id;
              return (
                <div
                  key={dept.id}
                  data-testid={`card-department-${dept.id}`}
                  className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => setOpenId(isOpen ? null : dept.id)}
                    data-testid={`button-toggle-dept-${dept.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-xl font-serif font-bold">{dept.name}</h2>
                        {dept.meetingTime && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{dept.meetingTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 border-t pt-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
                      {dept.groupPhotoUrl && (
                        <img
                          src={dept.groupPhotoUrl}
                          alt={dept.name}
                          className="w-full h-52 object-cover rounded-xl"
                        />
                      )}
                      <p className="text-muted-foreground leading-relaxed">{dept.description}</p>
                      {dept.activities && (
                        <div>
                          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-primary">
                            {language === 'am' ? 'እንቅስቃሴዎች' : 'Activities'}
                          </h3>
                          <p className="text-muted-foreground text-sm">{dept.activities}</p>
                        </div>
                      )}
                      {Array.isArray(dept.members) && dept.members.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-primary">
                            {language === 'am' ? 'አባላት' : 'Key Members'}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {dept.members.map((m, i) => (
                              <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end">
                        <Button asChild size="sm" className="rounded-full gap-2">
                          <Link href={`/departments/${dept.id}`}>
                            {language === 'am' ? 'ሙሉ ገጽ ይመልከቱ' : 'View Full Page'} <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
