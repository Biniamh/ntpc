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

  if (!participant) return null;

  const participantName = participant.middleName
    ? `${participant.firstName} ${participant.middleName} ${participant.lastName}`
    : `${participant.firstName} ${participant.lastName}`;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
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
            <div className="max-w-[min(95vw,42rem)] bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 rounded-2xl shadow-2xl p-4 text-white relative overflow-hidden print:shadow-none">
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
                    <div className="bg-white/15 rounded-full p-4 border-2 border-white/30">
                      <img src={excellentYouthImage} alt="Excellent Youth logo" className="h-20 w-20 rounded-full object-cover" />
                    </div>
                  </div>
                  <h2 className="text-lg font-bold">መልካም ወጣት</h2>
                  <p className="text-xs text-blue-200">Excellent Youth Program</p>
                </div>

                {/* Event Information */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-1">{event?.title || "Event"}</h3>
                  <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs border border-white/20">
                    ዙር {round?.roundNumber || "-"}
                  </div>
                </div>

                {/* Participant Information */}
                <div className="space-y-3 border-t border-b border-white/20 py-3">
                  <div className="text-center">
                    <p className="text-xs text-blue-200 mb-1">የተሳታፊ ሙሉ ስም</p>
                    <p className="text-xl font-bold">{participantName}</p>
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
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
            <Printer className="h-4 w-4 mr-2" />
            {t.admin.ey.print_badge || "Print Badge"}
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
          }          .print\\:hidden {
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
