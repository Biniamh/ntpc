import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/language-provider";
import { useListPosts, useListEvents, useListSupportSubmissions, useListMembershipRequests } from "@workspace/api-client-react";
import { useListEyEvents, useListEyRounds, useListEyParticipants, useListEyCoordinators } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users, Calendar, BookOpen, HeartHandshake, BookMarked, BarChart3, TrendingUp, CheckCircle2, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: "up" | "down";
  description?: string;
  color?: string;
}

function StatCard({ title, value, icon, change, changeType, description, color = "primary" }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            color === "primary" ? "bg-primary/10 text-primary" :
            color === "destructive" ? "bg-destructive/10 text-destructive" :
            color === "success" ? "bg-green-500/10 text-green-500" :
            color === "warning" ? "bg-amber-500/10 text-amber-500" :
            "bg-secondary/10 text-secondary"
          }`}>
            {icon}
          </div>
          {change && (
            <span className={`flex items-center gap-1 text-xs font-medium ${
              changeType === "up" ? "text-green-500" : "text-red-500"
            }`}>
              {changeType === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {change}
            </span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-serif font-bold">{value}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function DataTable<T extends { id: number | string }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  loading = false,
  itemsPerPage = 10,
}: {
  data: T[];
  columns: { key: keyof T | string; header: string; render?: (value: any, item: T) => React.ReactNode; sortable?: boolean; searchable?: boolean }[];
  searchPlaceholder?: string;
  loading?: boolean;
  itemsPerPage?: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;
    const trimmedSearch = searchTerm.trim().toLowerCase();
    if (trimmedSearch) {
      filtered = filtered.filter((item) =>
        columns.some((column) => {
          if (!column.searchable) return false;
          const value = item[column.key as keyof T];
          return value?.toString().toLowerCase().includes(trimmedSearch);
        })
      );
    }
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn as keyof T];
        const bValue = b[sortColumn as keyof T];
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [data, searchTerm, sortColumn, sortDirection, columns]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  if (loading) {
    return <Skeleton className="h-96 rounded-2xl" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key as string}
                  className={column.sortable ? "cursor-pointer select-none hover:bg-muted/50" : ""}
                  onClick={() => column.sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                  {columns.map((column) => (
                    <TableCell key={column.key as string}>
                      {column.render
                        ? column.render(item[column.key as keyof T], item)
                        : String(item[column.key as keyof T] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedData.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{" "}
            {filteredAndSortedData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-input bg-background text-sm disabled:opacity-50 hover:bg-muted"
            >
              ← Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNumber > totalPages) return null;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === pageNumber
                        ? "bg-primary text-primary-foreground"
                        : "border border-input bg-background hover:bg-muted"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-input bg-background text-sm disabled:opacity-50 hover:bg-muted"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChurchPortalStats() {
  const { t } = useLanguage();
  const { data: posts = [], isLoading: loadingPosts } = useListPosts();
  const { data: events = [], isLoading: loadingEvents } = useListEvents();
  const { data: supportList = [], isLoading: loadingSupport } = useListSupportSubmissions();
  const { data: memberList = [], isLoading: loadingMembers } = useListMembershipRequests();

  const loading = loadingPosts || loadingEvents || loadingSupport || loadingMembers;

  const totalSupportAmount = useMemo(() => {
    return supportList.reduce((sum, s) => sum + (Number(s.amountPerYear) || 0), 0);
  }, [supportList]);

  const avgMonthlySupport = useMemo(() => {
    const total = supportList.reduce((sum, s) => sum + (Number(s.amountPerMonth) || 0), 0);
    return supportList.length > 0 ? (total / supportList.length).toFixed(2) : "0";
  }, [supportList]);

  const baptizedCount = useMemo(() => {
    return memberList.filter((m) => m.baptized).length;
  }, [memberList]);

  const departments = useMemo(() => {
    const deptMap: Record<string, number> = {};
    memberList.forEach((m) => {
      const dept = m.servingAs || "Not Assigned";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    return Object.entries(deptMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [memberList]);

  const recentPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  }, [posts]);

  const upcomingEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter((e) => new Date(e.date) >= new Date())
      .slice(0, 5);
  }, [events]);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Posts"
          value={posts.length}
          icon={<BookOpen className="h-6 w-6" />}
          color="primary"
          description="Weekly sermons published"
        />
        <StatCard
          title="Total Events"
          value={events.length}
          icon={<Calendar className="h-6 w-6" />}
          color="success"
          description="Upcoming church events"
        />
        <StatCard
          title="Support Submissions"
          value={supportList.length}
          icon={<HeartHandshake className="h-6 w-6" />}
          color="warning"
          description="Ministry support requests"
        />
        <StatCard
          title="Membership Requests"
          value={memberList.length}
          icon={<Users className="h-6 w-6" />}
          color="primary"
          description="Pending & approved members"
        />
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Annual Support"
          value={`ETB ${totalSupportAmount.toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="success"
        />
        <StatCard
          title="Avg Monthly Support/Donor"
          value={`ETB ${avgMonthlySupport}`}
          icon={<BarChart3 className="h-6 w-6" />}
          color="primary"
        />
        <StatCard
          title="Baptized Members"
          value={`${baptizedCount} / ${memberList.length}`}
          icon={<CheckCircle2 className="h-6 w-6" />}
          color="warning"
        />
      </div>

      {/* Department Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t.reports.departmentBreakdown}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.length > 0 ? (
              departments.map((dept) => (
                <div key={dept.name} className="bg-muted/50 rounded-lg p-4 flex items-center justify-between border border-border/50">
                  <span className="font-medium text-sm">{dept.name}</span>
                  <Badge variant="secondary" className="text-base">{dept.count}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground col-span-full">
                <p>No membership data available yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {t.reports.recentPosts}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={recentPosts}
            loading={loadingPosts}
            columns={[
              { key: "title", header: t.admin.church.title, searchable: true, sortable: true },
              { key: "highlights", header: t.admin.church.highlights, searchable: true, render: (value) => (
                <div className="max-w-xs truncate" title={value}>{value}</div>
              )},
              { key: "photoUrl", header: t.admin.church.photo_url, render: (value) => value ? (
                <img src={value} alt="" className="w-10 h-10 rounded object-cover" />
              ) : <span className="text-muted-foreground text-xs">No image</span> },
              { key: "facebookUrl", header: "Facebook", render: (value) => value ? (
                <a href={value} target="_blank" rel="noopener" className="text-blue-500 text-xs hover:underline">Link</a>
              ) : <span className="text-muted-foreground text-xs">—</span> },
              { key: "youtubeUrl", header: "YouTube", render: (value) => value ? (
                <a href={value} target="_blank" rel="noopener" className="text-blue-500 text-xs hover:underline">Link</a>
              ) : <span className="text-muted-foreground text-xs">—</span> },
              { key: "createdAt", header: t.admin.church.date, sortable: true, render: (value) => format(new Date(value), "MMM d, yyyy") },
            ]}
            itemsPerPage={5}
          />
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t.reports.upcomingEvents}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={upcomingEvents}
            loading={loadingEvents}
            columns={[
              { key: "title", header: t.admin.church.title, searchable: true, sortable: true },
              { key: "description", header: t.admin.church.description, searchable: true, render: (value) => (
                <div className="max-w-xs truncate" title={value}>{value}</div>
              )},
              { key: "date", header: t.admin.church.date, sortable: true, render: (value) => format(new Date(value), "MMM d, yyyy") },
              { key: "imageUrl", header: t.admin.church.image_url, render: (value) => value ? (
                <img src={value} alt="" className="w-10 h-10 rounded object-cover" />
              ) : <span className="text-muted-foreground text-xs">No image</span> },
            ]}
            itemsPerPage={5}
          />
        </CardContent>
      </Card>

      {/* Support Submissions Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" />
            {t.reports.supportSubmissions}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={supportList}
            loading={loadingSupport}
            columns={[
              { key: "firstName", header: t.admin.church.first_name, searchable: true },
              { key: "middleName", header: t.admin.church.middle_name, searchable: true },
              { key: "lastName", header: t.admin.church.last_name, searchable: true },
              { key: "phone", header: t.admin.church.phone, searchable: true },
              { key: "email", header: t.admin.church.email, searchable: true },
              { key: "occupation", header: t.admin.church.occupation, searchable: true },
              { key: "amountPerMonth", header: t.reports.monthlyAmount, sortable: true, render: (value) => `ETB ${Number(value).toLocaleString()}` },
              { key: "amountPerYear", header: t.reports.yearlyAmount, sortable: true, render: (value) => `ETB ${Number(value).toLocaleString()}` },
              { key: "reason", header: t.admin.church.reason, searchable: true, render: (value) => (
                <div className="max-w-xs truncate" title={value}>{value}</div>
              )},
              { key: "createdAt", header: t.admin.church.date, sortable: true, render: (value) => format(new Date(value), "MMM d, yyyy") },
            ]}
            itemsPerPage={5}
          />
        </CardContent>
      </Card>

      {/* Membership Requests Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t.reports.membershipRequests}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={memberList}
            loading={loadingMembers}
            columns={[
              { key: "firstName", header: t.admin.church.first_name, searchable: true },
              { key: "middleName", header: t.admin.church.middle_name, searchable: true },
              { key: "lastName", header: t.admin.church.last_name, searchable: true },
              { key: "phone", header: t.admin.church.phone, searchable: true },
              { key: "email", header: t.admin.church.email, searchable: true },
              { key: "previousChurch", header: t.admin.church.previous_church, searchable: true },
              { key: "servingAs", header: t.admin.church.serving_as, searchable: true },
              { key: "baptized", header: t.admin.church.baptized, sortable: true, render: (value) => (
                <Badge variant={value ? "default" : "secondary"}>{value ? t.admin.church.yes : t.admin.church.no}</Badge>
              )},
              { key: "createdAt", header: t.admin.church.date, sortable: true, render: (value) => format(new Date(value), "MMM d, yyyy") },
            ]}
            itemsPerPage={5}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ExcellentYouthStats() {
  const { t } = useLanguage();
  const { data: eyEvents = [], isLoading: loadingEyEvents } = useListEyEvents();
  const { data: eyRounds = [], isLoading: loadingEyRounds } = useListEyRounds();
  const { data: eyParticipants = [], isLoading: loadingEyParticipants } = useListEyParticipants();
  const { data: eyCoordinators = [], isLoading: loadingEyCoordinators } = useListEyCoordinators();

  const loading = loadingEyEvents || loadingEyRounds || loadingEyParticipants || loadingEyCoordinators;

  // Compute summary statistics
  const totalParticipants = eyParticipants.length;
  const verifiedParticipants = eyParticipants.filter((p) => p.faydaVerified).length;
  const paidParticipants = eyParticipants.filter((p) => p.paymentStatus).length;
  const totalRounds = eyRounds.length;
  const totalEvents = eyEvents.length;
  const totalCoordinators = eyCoordinators.length;
  const badgesGenerated = eyParticipants.filter((p) => p.badgeGenerated).length;

  // Participants per event
  const participantsByEvent = useMemo(() => {
    const eventMap: Record<string, { count: number; event: any }> = {};
    eyParticipants.forEach((p) => {
      const event = eyEvents.find((e) => e.id === p.eventId);
      const eventName = event?.title || "Unknown Event";
      if (!eventMap[eventName]) {
        eventMap[eventName] = { count: 0, event };
      }
      eventMap[eventName].count++;
    });
    return Object.entries(eventMap).map(([name, data]) => ({ name, count: data.count, event: data.event }));
  }, [eyParticipants, eyEvents]);

  // Participants per round
  const participantsByRound = useMemo(() => {
    const roundMap: Record<string, number> = {};
    eyParticipants.forEach((p) => {
      const round = eyRounds.find((r) => r.id === p.roundId);
      const roundName = round ? `Round ${round.roundNumber}` : "Unassigned";
      roundMap[roundName] = (roundMap[roundName] || 0) + 1;
    });
    return Object.entries(roundMap).map(([name, count]) => ({ name, count }));
  }, [eyParticipants, eyRounds]);

  // Coordinator loading
  const coordinatorLoading = useMemo(() => {
    const coordMap: Record<string, { count: number; coordinator: any }> = {};
    eyParticipants.forEach((p) => {
      if (p.coordinatorId) {
        const coord = eyCoordinators.find((c) => c.id === p.coordinatorId);
        const coordName = coord?.name || "Unassigned";
        if (!coordMap[coordName]) {
          coordMap[coordName] = { count: 0, coordinator: coord };
        }
        coordMap[coordName].count++;
      }
    });
    return Object.entries(coordMap).map(([name, data]) => ({ name, count: data.count }));
  }, [eyParticipants, eyCoordinators]);

  const recentParticipants = useMemo(() => {
    return [...eyParticipants].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  }, [eyParticipants]);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Participants"
          value={totalParticipants}
          icon={<Users className="h-6 w-6" />}
          color="primary"
          description="Registered EY participants"
        />
        <StatCard
          title="Fayda Verified"
          value={verifiedParticipants}
          icon={<CheckCircle2 className="h-6 w-6" />}
          color="success"
          description={`${totalParticipants > 0 ? ((verifiedParticipants / totalParticipants) * 100).toFixed(0) : 0}% verified`}
        />
        <StatCard
          title="Payment Complete"
          value={paidParticipants}
          icon={<TrendingUp className="h-6 w-6" />}
          color="warning"
          description={`${totalParticipants > 0 ? ((paidParticipants / totalParticipants) * 100).toFixed(0) : 0}% paid`}
        />
        <StatCard
          title="Badges Generated"
          value={badgesGenerated}
          icon={<BookMarked className="h-6 w-6" />}
          color="primary"
          description="Printable badges created"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total EY Events"
          value={totalEvents}
          icon={<Calendar className="h-6 w-6" />}
          color="success"
        />
        <StatCard
          title="Total Rounds"
          value={totalRounds}
          icon={<BarChart3 className="h-6 w-6" />}
          color="primary"
        />
        <StatCard
          title="Active Coordinators"
          value={totalCoordinators}
          icon={<Users className="h-6 w-6" />}
          color="warning"
        />
      </div>

      {/* Participants by Event */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t.reports.participantsByEvent}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {participantsByEvent.length > 0 ? (
              participantsByEvent.map((item) => (
                <div key={item.name} className="bg-muted/50 rounded-lg p-4 flex items-center justify-between border border-border/50">
                  <div>
                    <span className="font-medium text-sm">{item.name}</span>
                    <p className="text-xs text-muted-foreground">
                      {item.event ? `${format(new Date(item.event.startDate), "MMM d")} – ${format(new Date(item.event.endDate), "MMM d, yyyy")}` : ""}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg">{item.count}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground col-span-full">
                <p>No participant data available yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Participants by Round */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            {t.reports.participantsByRound}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {participantsByRound.length > 0 ? (
              participantsByRound.map((item) => (
                <div key={item.name} className="bg-muted/50 rounded-lg p-4 text-center border border-border/50">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-2xl font-serif font-bold text-primary mt-1">{item.count}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground col-span-full">
                <p>No round data available yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Participants by Coordinator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t.reports.participantsByCoordinator}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coordinatorLoading.length > 0 ? (
              coordinatorLoading.map((item) => (
                <div key={item.name} className="bg-muted/50 rounded-lg p-4 flex items-center justify-between border border-border/50">
                  <span className="font-medium text-sm">{item.name}</span>
                  <Badge variant="secondary">{item.count} {t.reports.participants.toLowerCase()}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground col-span-full">
                <p>No coordinator assignment data available yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* EY Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t.admin.ey.all_events}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={eyEvents}
            loading={loadingEyEvents}
            columns={[
              { key: "title", header: t.admin.ey.event_title, searchable: true, sortable: true },
              { key: "type", header: t.admin.ey.type, searchable: true },
              { key: "year", header: t.admin.ey.year, sortable: true },
              { key: "startDate", header: t.admin.ey.start_date, sortable: true, render: (value) => format(new Date(value), "MMM d, yyyy") },
              { key: "endDate", header: t.admin.ey.end_date, sortable: true, render: (value) => format(new Date(value), "MMM d, yyyy") },
            ]}
            itemsPerPage={5}
          />
        </CardContent>
      </Card>

      {/* EY Rounds Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            {t.admin.ey.all_rounds}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={eyRounds}
            loading={loadingEyRounds}
            columns={[
              { key: "roundNumber", header: t.admin.ey.round_number, sortable: true, render: (value) => `Round ${value}` },
              { key: "capacity", header: t.admin.ey.capacity, sortable: true },
              { key: "fromDate", header: t.admin.ey.round_start, sortable: true, render: (value) => value ? format(new Date(value), "MMM d, yyyy") : "—" },
              { key: "toDate", header: t.admin.ey.round_end, sortable: true, render: (value) => value ? format(new Date(value), "MMM d, yyyy") : "—" },
            ]}
            itemsPerPage={5}
          />
        </CardContent>
      </Card>

      {/* EY Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t.admin.ey.registered_participants}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={recentParticipants}
            loading={loadingEyParticipants}
            columns={[
              { key: "firstName", header: t.admin.ey.first_name, searchable: true },
              { key: "lastName", header: t.admin.ey.last_name, searchable: true },
              { key: "city", header: t.admin.ey.city, searchable: true },
              { key: "registrationNumber", header: t.admin.ey.reg_number, searchable: true, render: (value) => <code className="text-xs">{value}</code> },
              { key: "faydaVerified", header: t.admin.ey.fayda_verified, sortable: true, render: (value) => (
                <Badge variant={value ? "default" : "secondary"}>{value ? t.admin.ey.yes : t.admin.ey.no}</Badge>
              )},
              { key: "paymentStatus", header: t.admin.ey.paid, sortable: true, render: (value) => (
                <Badge variant={value ? "default" : "secondary"}>{value ? t.admin.ey.yes : t.admin.ey.no}</Badge>
              )},
              { key: "badgeGenerated", header: t.reports.badge, sortable: true, render: (value) => (
                <Badge variant={value ? "default" : "secondary"}>{value ? t.admin.ey.generated : t.admin.ey.pending}</Badge>
              )},
            ]}
            itemsPerPage={5}
          />
          {eyParticipants.length > 5 && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Showing 5 of {eyParticipants.length} participants
            </p>
          )}
        </CardContent>
      </Card>

      {/* EY Coordinators Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t.admin.ey.all_coordinators}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={eyCoordinators}
            loading={loadingEyCoordinators}
            columns={[
              { key: "name", header: t.admin.church.name, searchable: true, sortable: true },
              { key: "phone", header: t.admin.church.phone, searchable: true },
              { key: "email", header: t.admin.church.email, searchable: true },
              { key: "createdAt", header: t.admin.church.date, sortable: true, render: (value) => format(new Date(value), "MMM d, yyyy") },
            ]}
            itemsPerPage={5}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function Reports() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<"church" | "ey">("church");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6 px-4">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-serif font-bold">
            {t.reports.title}
          </h1>
          <div className="flex items-center gap-2">
            <Badge
              variant={activeSection === "church" ? "default" : "secondary"}
              className="text-base cursor-pointer"
              onClick={() => setActiveSection("church")}
            >
              {t.reports.church_portal}
            </Badge>
            <Badge
              variant={activeSection === "ey" ? "default" : "secondary"}
              className="text-base cursor-pointer"
              onClick={() => setActiveSection("ey")}
            >
              {t.reports.ey_management}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Quick Summary Row - shown for both sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatCard
              title={t.reports.total_members}
              value="247"
              icon={<Users className="h-6 w-6" />}
              color="primary"
              change="+12"
              changeType="up"
              description={t.reports.active_members_desc}
            />
            <StatCard
              title={t.reports.total_events_all}
              value="38"
              icon={<Calendar className="h-6 w-6" />}
              color="success"
              change="+5"
              changeType="up"
              description={t.reports.events_this_year}
            />
            <StatCard
              title={t.reports.total_donations}
              value="ETB 485,230"
              icon={<TrendingUp className="h-6 w-6" />}
              color="warning"
              change="+18%"
              changeType="up"
              description={t.reports.donations_period}
            />
          </div>

          {/* Section Tabs */}
          <Tabs defaultValue={activeSection === "ey" ? "ey" : "church"} className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1 mb-8">
              <TabsTrigger value="church" className="gap-2" onClick={() => setActiveSection("church")}>
                <BookOpen className="h-4 w-4" /> {t.reports.church_portal}
              </TabsTrigger>
              <TabsTrigger value="ey" className="gap-2" onClick={() => setActiveSection("ey")}>
                <Users className="h-4 w-4" /> {t.reports.ey_management}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="church">
              <ChurchPortalStats />
            </TabsContent>

            <TabsContent value="ey">
              <ExcellentYouthStats />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}