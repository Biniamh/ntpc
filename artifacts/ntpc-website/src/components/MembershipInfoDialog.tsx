import { useTheme } from "@/lib/theme-provider";
import { useLanguage } from "@/lib/language-provider";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Printer } from "lucide-react";
import logoUrl from "@assets/logo.jpg";

interface MembershipInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    occupation: string;
    previousChurch: string;
    servingAs: string;
    baptized: boolean;
    profilePhotoUrl?: string;
    status: string;
    createdAt: string;
  } | null;
  onSaveStatus?: (id: number, status: string) => void;
  isSavingStatus?: boolean;
}

const STATUS_OPTIONS = ["pending", "approved", "rejected"] as const;

const STATUS_COLORS: Record<string, { pill: string; bar: string; rule: string; label: string }> = {
  pending: {
    pill: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-600",
    bar:  "bg-amber-500/25",
    rule: "border-amber-300/50",
    label:"text-amber-700/70 dark:text-amber-400/60",
  },
  approved: {
    pill: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-600",
    bar:  "bg-emerald-500/25",
    rule: "border-emerald-300/50",
    label:"text-emerald-700/70 dark:text-emerald-400/60",
  },
  rejected: {
    pill: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-600",
    bar:  "bg-red-500/25",
    rule: "border-red-300/50",
    label:"text-red-700/70 dark:text-red-400/60",
  },
};

export function MembershipInfoDialog({ open, onOpenChange, member, onSaveStatus, isSavingStatus }: MembershipInfoDialogProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  const handlePrint = () => {
    window.print();
  };

  const currentStatus = member?.status || "pending";
  const sc = STATUS_COLORS[currentStatus as keyof typeof STATUS_COLORS] || STATUS_COLORS.pending;
  const md = t.admin.membershipDialog;

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #membership-print-root, #membership-print-root * { visibility: visible !important; }
          #membership-print-root {
            position: absolute; left: 0; top: 0; width: 100%;
            background: #fff !important; color: #000 !important;
          }
          .print-only { display: block !important; }
          .no-print   { display: none !important; }
          @page {
            size: A4;
            margin: 18mm 16mm 18mm 16mm;
          }
        }
      `}</style>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="
            max-w-4xl
            max-h-[90vh] overflow-y-auto
            print:max-h-none print:overflow-visible print:shadow-none print:border-0
          "
        >
          <DialogHeader className="print:hidden">
            <DialogTitle>{md.title}</DialogTitle>
          </DialogHeader>

          {member && (
            <div
              id="membership-print-root"
              style={{
                background: isDark ? "hsl(var(--card))" : "#fff",
                color: isDark ? "hsl(var(--card-foreground))" : "#111",
              }}
              className={`
                rounded-none border shadow-sm print:border-0 print:shadow-none print:p-0
                ${isDark ? 'border-white/10' : 'border-primary/15'}
                print:bg-white
              `}
            >
              {/* ── PAPER HEADER ────────────────────────────────────────── */}
              <div
                className={`
                  relative overflow-hidden
                  px-7 pt-7 pb-5
                  ${isDark ? 'border-white/10' : 'border-b-4 border-primary'}
                `}
              >
                {/* Corner flourish */}
                <div className="absolute top-0 right-0 w-28 h-28 opacity-[0.05]">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current text-primary">
                    <path d="M100 0L200 0L200 100C200 44.77 155.23 0 100 0Z" />
                    <path d="M200 100L200 200L100 200C44.77 200 0 155.23 0 100L0 0L100 0C100 44.77 144.77 0 200 0Z" />
                    <circle cx="100" cy="100" r="40" />
                  </svg>
                </div>

                <div className="flex items-start gap-5">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <img
                      src={logoUrl}
                      alt={md.churchName}
                      className="h-16 w-16 rounded-full object-cover border-2 border-primary/30 shadow-sm"
                    />
                  </div>

                  {/* Title block */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
                      {md.churchName}
                    </h1>
                    <p className="no-print">
                      <span className="text-xs uppercase tracking-[0.2em] mt-0.5 text-muted-foreground font-medium">
                        {md.formTitle}
                      </span>
                    </p>
                    <p className="text-xs text-black/40 font-medium print:!text-black/60 mt-0.5 print-only">
                      {md.formTitle}
                    </p>
                  </div>

                  {/* Meta block */}
                  <div className="text-right text-xs flex-shrink-0 pt-1 no-print space-x-4">
                    <div>
                      <span className="font-semibold text-muted-foreground block">{md.memberId}</span>
                      <span className="font-mono text-lg font-bold text-primary">#{member.id}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground block">{md.dateFiled}</span>
                      <span>{new Date(member.createdAt).toLocaleDateString("en-GB")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── BODY ─────────────────────────────────────────────────── */}
              <div className="px-7 py-6 space-y-6">

                {/* ─── Profile Photo */}
                {member.profilePhotoUrl && (
                  <div
                    className={`
                      relative flex items-center gap-5
                      p-5 rounded-lg border-2 border-dashed
                      bg-gradient-to-r from-primary/[0.03] to-transparent
                      ${isDark ? 'border-white/15' : 'border-primary/20'}
                    `}
                  >
                    <span className="absolute top-2 left-3 text-[10px] font-mono text-primary/30 tracking-wider uppercase select-none no-print">
                      {md.profilePhoto}
                    </span>
                    <img
                      src={member.profilePhotoUrl}
                      alt={`${member.firstName} profile`}
                      className="h-24 w-24 rounded-lg object-cover border-2 border-primary/25 shadow-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="no-print text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{md.profilePhoto}</p>
                      <p className={`no-print text-sm ${isDark ? 'text-white/45' : 'text-muted-foreground'}`}>{md.providedByApplicant}</p>
                    </div>
                    <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-primary/20 rounded-r" />
                  </div>
                )}

                {/* ─── Personal Information */}
                <Section
                  title={md.personalInfo}
                  isDark={isDark}
                  cols="sm:grid-cols-3"
                  items={[
                    { label: md.fullName,   value: `${member.firstName} ${member.middleName} ${member.lastName}` },
                    { label: md.phone,      value: member.phone },
                    { label: md.email,      value: member.email },
                  ]}
                />

                {/* ─── Address & Occupation */}
                <Section
                  title={md.addressOccupation}
                  isDark={isDark}
                  accent="secondary"
                  cols="sm:grid-cols-2"
                  items={[
                    { label: md.residentialAddress, value: member.address },
                    { label: md.occupation,     value: member.occupation },
                  ]}
                />

                {/* ─── Church Background */}
                <div className="space-y-3">
                  <h2 className={`
                    text-[11px] uppercase tracking-[0.18em] font-bold
                    border-b pb-1.5 flex items-center gap-2
                    ${sc.label}
                    ${isDark ? 'border-white/10' : sc.rule}
                  `}>
                    <span className={`inline-block w-2 h-2 rounded-full ${sc.bar}`} />
                    {md.churchBackground}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                    <FieldPair label={md.previousChurch} value={member.previousChurch} isDark={isDark} />
                    <FieldPair label={md.currentlyServing} value={member.servingAs || "N/A"} isDark={isDark} />
                    <div>
                      <Label className={`
                        block text-[10px] uppercase tracking-[0.14em]
                        font-semibold mb-0.5
                        ${isDark ? 'text-white/45' : 'text-muted-foreground/70'}
                      `}>
                        {md.baptized}
                      </Label>
                      <div className="relative">
                        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-secondary/15 rounded-full no-print" />
                        <p className={`pl-3 text-sm font-semibold ${isDark ? 'text-white/90' : 'text-foreground/90'}`}>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                            member.baptized
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-600"
                              : "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
                          }`}>
                            {member.baptized ? md.yes : md.no}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── DECORATIVE DIVIDER */}
              <div className="mx-7 flex items-center gap-3 no-print">
                <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-primary/10'}`} />
                <span className={`text-[10px] font-mono tracking-widest ${isDark ? 'text-white/20' : 'text-primary/25'}`}>{md.churchAcronym}</span>
                <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-primary/10'}`} />
              </div>

              {/* ── SIGNATURE AREA */}
              <div className="px-7 pb-5 pt-6 no-print">
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  {[md.memberSignature, md.date].map((label) => (
                    <div key={label}>
                      <Label className={`block text-[10px] uppercase tracking-[0.14em] font-semibold mb-1 ${isDark ? 'text-white/45' : 'text-muted-foreground/70'}`}>
                        {label}
                      </Label>
                      <div className={`border-b-2 h-10 ${isDark ? 'border-white/15' : 'border-muted-foreground/20'}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin notes */}
              <div className="px-7 pb-7 border-t pt-5">
                <Label className={`no-print block text-[10px] uppercase tracking-[0.14em] font-semibold mb-1 ${isDark ? 'text-white/35' : 'text-muted-foreground/60'}`}>
                  {md.adminNotes}
                </Label>
                <div className={`border-b border-dashed h-8 print:border-b print:border-gray-400 ${isDark ? 'border-white/10' : 'border-muted-foreground/20'}`} />
              </div>
            </div>
          )}

          {/* ── ACTION FOOTER */}
          <DialogFooter className="no-print items-center justify-between pt-4">
            {onSaveStatus && member && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="status-select" className="text-xs font-medium whitespace-nowrap">
                    {md.statusLabel}
                  </Label>
                  <Select
                    value={currentStatus}
                    onValueChange={(val) => onSaveStatus(member.id, val)}
                    disabled={isSavingStatus}
                  >
                    <SelectTrigger id="status-select" className="w-36 h-9">
                      <SelectValue placeholder={md.selectStatus} />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt === "pending" ? md.statusPending : opt === "approved" ? md.statusApproved : md.statusRejected}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {isSavingStatus && (
                  <span className="text-xs text-muted-foreground animate-pulse">{md.saving}</span>
                )}
              </div>
            )}

            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
                {md.close}
              </Button>
              <Button
                onClick={handlePrint}
                className="gap-2 rounded-full bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-shadow"
              >
                <Printer className="h-4 w-4" />
                {md.printForm}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

interface SectionProps {
  title: string;
  isDark: boolean;
  cols: string;
  items: { label: string; value: string }[];
  accent?: "primary" | "secondary";
}

function Section({ title, isDark, cols, items, accent = "primary" }: SectionProps) {
  const accentColor = accent === "secondary" ? "secondary/40" : "primary/40";
  return (
    <div className="space-y-3">
      <h2 className={`
        text-[11px] uppercase tracking-[0.18em] font-bold
        border-b pb-1.5 flex items-center gap-2
        ${isDark ? 'text-white/70 border-white/10' : `text-primary/70 border-primary/15`}
      `}>
        <span className={`inline-block w-2 h-2 rounded-full ${accent === 'secondary' ? 'bg-secondary/50' : 'bg-primary/40'}`} />
        {title}
      </h2>
      <div className={`grid grid-cols-1 ${cols} gap-x-6 gap-y-4`}>
        {items.map(({ label, value }) => (
          <FieldPair key={label} label={label} value={value} isDark={isDark} accentBar={accent === "secondary" ? "secondary" : "primary"} />
        ))}
      </div>
    </div>
  );
}

interface FieldPairProps {
  label: string;
  value: string;
  isDark: boolean;
  accentBar?: "primary" | "secondary";
}

function FieldPair({ label, value, isDark, accentBar = "primary" }: FieldPairProps) {
  const barColor = accentBar === "secondary" ? "bg-secondary/15" : "bg-primary/15";
  return (
    <div>
      <Label className={`
        block text-[10px] uppercase tracking-[0.14em]
        font-semibold mb-0.5
        ${isDark ? 'text-white/45' : 'text-muted-foreground/70'}
      `}>{label}</Label>
      <div className="relative">
        <span className={`absolute left-0 top-0 bottom-0 w-[2px] ${barColor} rounded-full no-print`} />
        <p className={`pl-3 text-sm font-semibold break-words ${isDark ? 'text-white/90' : 'text-foreground/90'}`}>{value}</p>
      </div>
    </div>
  );
}
