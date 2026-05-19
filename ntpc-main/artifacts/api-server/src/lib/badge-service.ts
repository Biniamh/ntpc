import { EyParticipant } from "@workspace/db";

interface BadgeData {
  participantId: number;
  name: string;
  registrationNumber: string;
  eventName: string;
  roundNumber: number;
  faydaId: string;
}

/**
 * Badge Generation Service
 * Generates PDF badges for participants to print and use at event entry
 */
export class BadgeGenerationService {
  /**
   * Generate badge data from participant information
   */
  static async generateBadgeData(
    participant: EyParticipant & { event: { title: string }; round: { roundNumber: number } },
  ): Promise<BadgeData> {
    return {
      participantId: participant.id,
      name: `${participant.firstName} ${participant.lastName}`,
      registrationNumber: participant.registrationNumber,
      eventName: participant.event.title,
      roundNumber: participant.round.roundNumber,
      faydaId: participant.faydaId,
    };
  }

  /**
   * Generate HTML badge template for printing
   */
  static generateBadgeHTML(badges: BadgeData[]): string {
    const badgeHTML = badges
      .map(
        (badge) => `
      <div class="badge-page">
        <div class="badge">
          <div class="badge-header">
            <div class="badge-logo">
              <!-- Church Logo Placeholder - In production, replace with actual logo -->
              <div class="logo-container">
                <div class="logo-mark">⛪</div>
                <div class="logo-text">NTPC Church</div>
              </div>
            </div>
            </div>
            <h2>NTPC Event Badge</h2>
            <p class="event-name">${badge.eventName}</p>
          </div>
          
          <div class="badge-body">
            <div class="participant-name">${badge.name}</div>
            <div class="info-row">
              <span class="label">Fayda ID:</span>
              <span class="value">${badge.faydaId}</span>
            </div>
            <div class="info-row">
              <span class="label">Reg #:</span>
              <span class="value">${badge.registrationNumber}</span>
            </div>
            <div class="info-row">
              <span class="label">Round:</span>
              <span class="value">${badge.roundNumber}</span>
            </div>
          </div>

          <div class="badge-footer">
            <div class="barcode-container">
              <div class="barcode">${badge.registrationNumber}</div>
            </div>
            <p class="footer-text">Please wear this badge throughout the event</p>
          </div>
        </div>
      </div>
    `,
      )
      .join("");

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Event Badges</title>
      <style>
        @page { size: 4in 5.5in; margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; padding: 0; }
        
        .badge-page {
          page-break-after: always;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 4in;
          height: 5.5in;
          padding: 0;
        }
        
        .badge {
          width: 4in;
          height: 5.5in;
          background: linear-gradient(135deg, #2c3e50 0%, #4a6fa5 100%);
          border-radius: 15px;
          padding: 25px;
          color: white;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        
        .badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #f39c12, #e67e22, #f1c40f);
        }
        
        .badge-header {
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .badge-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-mark {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .logo-text {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.95);
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .badge-header h2 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #ecf0f1;
        }
        
        .event-name {
          font-size: 16px;
          font-weight: 500;
          color: #fdcb6e;
          background: rgba(255,255,255,0.1);
          padding: 4px 12px;
          border-radius: 20px;
          display: inline-block;
        }
        
        .badge-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 10px 0;
        }
        
        .participant-name {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 18px;
          text-align: center;
          letter-spacing: 0.5px;
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 13px;
        }
        
        .label {
          font-weight: 600;
          color: #bdc3c7;
          min-width: 70px;
        }
        
        .value {
          font-weight: 500;
          color: #ecf0f1;
          text-align: right;
          flex: 1;
        }
        
        .badge-footer {
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.2);
          padding-top: 15px;
        }
        
        .barcode-container {
          background: rgba(0,0,0,0.3);
          padding: 8px;
          border-radius: 8px;
          display: inline-block;
          margin-bottom: 10px;
        }
        
        .barcode {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          letter-spacing: 3px;
          background: white;
          color: #2c3e50;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
          font-weight: bold;
        }
        
        .footer-text {
          font-size: 11px;
          color: #bdc3c7;
          font-style: italic;
        }
        
        /* Security watermark */
        .badge::after {
          content: "NTPC";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          font-size: 80px;
          color: rgba(255,255,255,0.05);
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%) rotate(15deg);
          pointer-events: none;
          z-index: 1;
        }
        
        @media print {
          body { margin: 0; padding: 0; background: white; }
          .badge-page { width: 4in; height: 5.5in; page-break-after: always; }
          .badge { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      ${badgeHTML}
    </body>
    </html>
    `;
  }

  /**
   * Mark badges as generated for participants
   */
  static async markBadgesGenerated(participantIds: number[]): Promise<void> {
    // This would be called after successful badge generation
    // Implementation depends on the database update logic
    console.log(`Marked badges as generated for participants: ${participantIds.join(", ")}`);
  }
}
