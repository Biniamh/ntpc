import { Link } from "wouter";
import { useGetDepartment, getGetDepartmentQueryKey } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/language-provider";
import { ArrowLeft, Users, Clock, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DepartmentDetailProps {
  params: { id: string };
}

export default function DepartmentDetail({ params }: DepartmentDetailProps) {
  const { language } = useLanguage();
  const id = Number(params.id);
  const { data: dept, isLoading } = useGetDepartment(id, {
    query: { enabled: !!id, queryKey: getGetDepartmentQueryKey(id) },
  });

  if (isLoading) {
    return (
      <div className="container px-4 mx-auto max-w-3xl py-16 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p className="text-xl font-serif">{language === 'am' ? 'ክፍሉ አልተገኘም' : 'Department not found'}</p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/departments"><ArrowLeft className="mr-2 h-4 w-4" /> {language === 'am' ? 'ወደ ክፍሎች' : 'Back to Departments'}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Banner */}
      <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="container px-4 mx-auto relative z-10">
          <Button asChild variant="ghost" className="mb-6 text-primary-foreground/70 hover:text-primary-foreground -ml-2">
            <Link href="/departments"><ArrowLeft className="mr-2 h-4 w-4" /> {language === 'am' ? 'ወደ ክፍሎች' : 'All Departments'}</Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold">{dept.name}</h1>
              {dept.meetingTime && (
                <div className="flex items-center gap-2 mt-2 text-primary-foreground/70">
                  <Clock className="h-4 w-4" />
                  <span>{dept.meetingTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 container px-4 mx-auto max-w-4xl">
        {dept.groupPhotoUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <img src={dept.groupPhotoUrl} alt={dept.name} className="w-full h-72 object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full inline-block" />
                {language === 'am' ? 'ስለ ክፍሉ' : 'About This Department'}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{dept.description}</p>
            </div>

            {dept.activities && (
              <div>
                <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                  <Activity className="h-6 w-6 text-primary" />
                  {language === 'am' ? 'እንቅስቃሴዎች' : 'Activities'}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{dept.activities}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {dept.meetingTime && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3 text-primary font-semibold">
                  <Clock className="h-5 w-5" />
                  {language === 'am' ? 'የስብሰባ ሰዓት' : 'Meeting Time'}
                </div>
                <p className="text-muted-foreground text-sm">{dept.meetingTime}</p>
              </div>
            )}

            {Array.isArray(dept.members) && dept.members.length > 0 && (
              <div className="bg-card border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 font-semibold text-primary">
                  <Users className="h-5 w-5" />
                  {language === 'am' ? 'ዋና አባላት' : 'Key Members'}
                </div>
                <ul className="space-y-2">
                  {dept.members.map((member, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      {member}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center">
          <h3 className="text-2xl font-serif font-bold mb-3">
            {language === 'am' ? 'ለመቀላቀል ፍላጎት አለዎት?' : 'Interested in Joining?'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {language === 'am'
              ? 'ወደ ቤተ ክርስቲያናችን ተቀላቀሉ እና ፈቃደኛ ሆነው አገልግሉ!'
              : 'Join our church family and start serving in this or another department.'}
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/join">{language === 'am' ? 'አባል ይሁኑ' : 'Become a Member'}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
