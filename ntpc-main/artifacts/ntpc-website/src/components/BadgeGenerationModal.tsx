import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, X } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/lib/language-provider";
import excellentYouthImage from "@/assets/excellentyouth.jpeg";

interface BadgeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: any;
  event: any;
  round: any;
  coordinator: any;
  onConfirm?: () => void;
  isGenerating?: boolean;
}

export function BadgeGenerationModal({
  open,
  onOpenChange,
  participant,
  event,
  round,
  coordinator,
  onConfirm,
  isGenerating = false,
}: BadgeModalProps) {
  const { t } = useLanguage();
  const [isPrinting, setIsPrinting] = useState(false);
  const badgeSize = {
    width: "min(95vw, 4in)",
    height: "calc(min(95vw, 4in) * 1.375)",
  };

  if (!participant) return null;

  const participantName = participant.middleName
    ? `${participant.firstName} ${participant.middleName} ${participant.lastName}`
    : `${participant.firstName} ${participant.lastName}`;

  const buildBadgeHtml = () => {
    const title = event?.title || "Event";
    const roundLabel = round?.roundNumber ? `ዙር ${round.roundNumber}` : "ዙር -";
    const registrationNumber = participant.registrationNumber || "N/A";
    const city = participant.city || "N/A";
    const email = participant.email || "N/A";
    const coordinatorName = coordinator?.name || t.admin.ey.unassigned;
    const dateRange = round?.fromDate && round?.toDate
      ? `${format(new Date(round.fromDate), "MMM d")} - ${format(new Date(round.toDate), "MMM d, yyyy")}`
      : "N/A";
    const logoUrl = new URL(excellentYouthImage, window.location.href).href;

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Print Badge</title>
    <style>
      @page {
        size: 4in 5.5in;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        font-family: Inter, system-ui, sans-serif;
        color: #0f172a;
      }
      .badge-root {
        width: 4in;
        height: 5.5in;
        margin: 0 auto;
      }
      .badge {
        position: relative;
        box-sizing: border-box;
        width: 4in;
        height: 5.5in;
        background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
        border-radius: 0.15in;
        overflow: hidden;
        color: #ffffff;
        padding: 0.22in;
      }
      .badge::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: url('${logoUrl}');
        background-size: cover;
        background-position: center;
        opacity: 0.15;
        transform: scale(1.1);
      }
      .badge-content {
        position: relative;
        z-index: 1;
      }
      .top-bar {
        height: 0.25rem;
        width: 100%;
        background: linear-gradient(90deg, #fbbf24, #fb7185, #eab308);
        border-radius: 9999px;
        margin-bottom: 1rem;
      }
      .logo-wrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 0.5rem;
      }
      .logo-circle {
        width: 0.95in;
        height: 0.95in;
        border-radius: 9999px;
        background: rgba(255,255,255,0.14);
        border: 2px solid rgba(255,255,255,0.3);
        display: grid;
        place-items: center;
      }
      .logo-circle img {
        width: 0.7in;
        height: 0.7in;
        object-fit: cover;
        border-radius: 9999px;
      }
      .badge-header {
        text-align: center;
        border-bottom: 1px solid rgba(255,255,255,0.22);
        padding-bottom: 0.5rem;
      }
      .badge-header h2 {
        margin: 0.25rem 0 0;
        font-size: 0.18in;
        font-weight: 700;
      }
      .badge-header p {
        margin: 0.25rem 0 0;
        font-size: 0.75rem;
        color: rgba(209, 213, 219, 1);
      }
      .event-title {
        margin: 0.75rem 0 0.25rem;
        text-align: center;
        font-size: 0.2in;
        font-weight: 700;
      }
      .round-badge {
        display: inline-block;
        margin: 0 auto;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.2);
        font-size: 0.75rem;
      }
      .participant-info {
        border-top: 1px solid rgba(255,255,255,0.22);
        border-bottom: 1px solid rgba(255,255,255,0.22);
        padding: 0.75rem 0;
      }
      .participant-info .label {
        display: block;
        font-size: 0.6875rem;
        color: rgba(191, 219, 254, 1);
        letter-spacing: 0.08em;
        margin-bottom: 0.25rem;
        font-weight: 600;
      }
      .participant-name {
        font-size: 0.24in;
        font-weight: 800;
        margin: 0 0 0.75rem;
        text-align: center;
      }
      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.5rem;
        font-size: 0.13in;
      }
      .info-item {
        line-height: 1.35;
      }
      .info-item span {
        display: block;
      }
      .footer {
        margin-top: 0.75rem;
        text-align: center;
      }
      .footer-code {
        display: inline-block;
        padding: 0.375rem 0.625rem;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 0.5rem;
        background: rgba(255,255,255,0.1);
        letter-spacing: 0.12em;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 0.75rem;
        margin-bottom: 0.375rem;
        font-weight: 700;
      }
      .footer-note {
        margin: 0;
        font-size: 0.6875rem;
        color: rgba(203,213,225,1);
        font-style: italic;
      }
      @media print {
        body {
          padding: 0;
          background: white;
        }
        .badge-root {
          margin: 0;
          width: 4in;
          height: 5.5in;
        }
        .badge {
          box-shadow: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="badge-root">
      <article class="badge">
        <div class="badge-content">
          <div class="top-bar"></div>
          <div class="logo-wrapper">
            <div class="logo-circle">
              <img src="${logoUrl}" alt="Excellent Youth logo" />
            </div>
          </div>
          <div class="badge-header">
            <h2>መልካም ወጣት</h2>
            <p>Excellent Youth Program</p>
          </div>
          <div class="event-title">${title}</div>
          <div class="round-badge">${roundLabel}</div>
          <div class="participant-info">
            <div class="participant-name">${participantName}</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">REG #</span>
                <span>${registrationNumber}</span>
              </div>
              <div class="info-item">
                <span class="label">CITY</span>
                <span>${city}</span>
              </div>
              <div class="info-item" style="grid-column: span 2;">
                <span class="label">EMAIL</span>
                <span>${email}</span>
              </div>
              <div class="info-item" style="grid-column: span 2;">
                <span class="label">COORDINATOR</span>
                <span>${coordinatorName}</span>
              </div>
            </div>
          </div>
          <div class="footer">
            <div class="footer-code">${registrationNumber}</div>
            <p class="footer-note">Please wear this badge throughout the event</p>
          </div>
        </div>
      </article>
    </div>
    <script>
      window.onload = function() {
        window.print();
      };
    </script>
  </body>
</html>`;
  };

  const handlePrint = () => {
    setIsPrinting(true);
    const html = buildBadgeHtml();
    const blob = new Blob([html], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    const badgeWindow = window.open(blobUrl, "_blank", "width=900,height=700");

    if (!badgeWindow) {
      URL.revokeObjectURL(blobUrl);
      setIsPrinting(false);
      return;
    }

    badgeWindow.focus();

    const cleanup = () => {
      URL.revokeObjectURL(blobUrl);
      setIsPrinting(false);
    };

    setTimeout(cleanup, 500);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto badge-dialog">
        <DialogHeader>
          <DialogTitle>Generate Event Badge</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Badge Preview */}
          <div className="flex justify-center py-3 bg-gray-50 rounded-lg print:bg-white badge-print-area">
            <div
              className="badge-preview-card bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 rounded-xl shadow-2xl p-5 text-white relative overflow-hidden print:shadow-none"
              style={badgeSize}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300"></div>

              {/* Watermark */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <img src={excellentYouthImage} alt="Excellent Youth watermark" className="absolute inset-0 h-full w-full object-cover opacity-15 transform scale-110" />
              </div>

              <div className="relative z-10 space-y-2">
                {/* Header with Logo */}
                <div className="text-center border-b border-white/20 pb-2">
                  <div className="flex justify-center mb-2">
                    <div className="bg-white/15 rounded-full p-3 border-2 border-white/30">
                      <img src={excellentYouthImage} alt="Excellent Youth logo" className="h-14 w-14 rounded-full object-cover" />
                    </div>
                  </div>
                  <h2 className="text-lg font-bold">መልካም ወጣት</h2>
                  <p className="text-xs text-blue-200">Excellent Youth Program</p>
                </div>

                {/* Event Information */}
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-1">{event?.title || "Event"}</h3>
                  <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs border border-white/20">
                    ዙር {round?.roundNumber || "-"}
                  </div>
                </div>

                {/* Participant Information */}
                <div className="space-y-3 border-t border-b border-white/20 py-3">
                  <div className="text-center">
                    <p className="text-xs text-blue-200 mb-1">የተሳታፊ ሙሉ ስም</p>
                    <p className="text-lg font-bold">{participantName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-blue-200 text-[11px] font-semibold">REG #</p>
                      <p className="font-mono font-bold text-sm">{participant.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-[11px] font-semibold">CITY</p>
                      <p className="font-bold text-sm">{participant.city || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-blue-200 text-[11px] font-semibold">EMAIL</p>
                      <p className="font-bold text-sm truncate">{participant.email}</p>
                    </div>
                  </div>

                  {coordinator && (
                    <div>
                      <p className="text-blue-200 text-xs font-semibold">COORDINATOR</p>
                      <p className="font-bold text-sm">{coordinator.name}</p>
                    </div>
                  )}
                </div>

                {/* Status Information */}
                <div className="flex justify-around text-center text-xs">
                  
            
                </div>

                {/* Footer */}
                <div className="text-center border-t border-white/20 pt-3">
                  <div className="bg-white/10 p-2 rounded mb-2 border border-white/20 font-mono text-xs tracking-widest font-bold">
                    {participant.registrationNumber}
                  </div>
                  <p className="text-[11px] text-blue-200 italic">Please wear this badge throughout the event</p>
                </div>
              </div>
            </div>
          </div>

          {/* Badge Information Display */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-blue-50 p-4 rounded-lg print:hidden">
            <div>
              <p className="text-gray-600 font-semibold">{t.admin.ey.event}</p>
              <p className="text-gray-900 font-medium">{event?.title}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">{t.admin.ey.round}</p>
              <p className="text-gray-900 font-medium">{t.admin.ey.round} {round?.roundNumber}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">{t.admin.ey.round_dates}</p>
              <p className="text-gray-900 font-medium">
                {round?.fromDate && round?.toDate
                  ? `${format(new Date(round.fromDate), "MMM d")} - ${format(new Date(round.toDate), "MMM d, yyyy")}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">{t.admin.ey.coordinator}</p>
              <p className="text-gray-900 font-medium">{coordinator?.name || t.admin.ey.unassigned}</p>
            </div>
          </div>

          {/* Print Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm print:hidden">
            <h4 className="font-semibold text-amber-900 mb-2">📋 Print Instructions</h4>
            <ul className="text-amber-800 space-y-1 list-disc list-inside">
              <li>Use 4x5.5 inch badge paper or regular A4 paper</li>
              <li>Set margins to 0.5 inches</li>
              <li>Use color printing for best results</li>
              <li>Cut along the edges if using regular paper</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            {t.admin.common.cancel}
          </Button>
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700" disabled={isPrinting}>
            <Printer className="h-4 w-4 mr-2" />
            {isPrinting ? t.admin.common.loading : t.admin.ey.print_badge || "Print Badge"}
          </Button>
          <Button 
            onClick={handleConfirm} 
            className="bg-green-600 hover:bg-green-700"
            disabled={isGenerating}
          >
            {isGenerating ? t.admin.common.loading : t.admin.ey.generate_badge}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: 4in 5.5in;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          [role="dialog"], .badge-dialog, .badge-print-area {
            position: static !important;
            border: none !important;
            box-shadow: none !important;
            max-height: none !important;
            max-width: none !important;
            overflow: visible !important;
          }
          body * {
            visibility: hidden;
          }
          .badge-dialog,
          .badge-dialog *,
          .badge-print-area,
          .badge-print-area * {
            visibility: visible;
          }
          .badge-print-area {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            padding: 0 !important;
          }
          .badge-preview-card {
            width: 4in !important;
            height: 5.5in !important;
            max-width: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </Dialog>
  );
}
