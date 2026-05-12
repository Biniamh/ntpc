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
            <div class="barcode">${badge.registrationNumber}</div>
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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f0f0f0; padding: 20px; }
        
        .badge-page {
          page-break-after: always;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 11in;
          padding: 20px;
        }
        
        .badge {
          width: 4in;
          height: 5.5in;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          padding: 20px;
          color: white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .badge-header {
          text-align: center;
          border-bottom: 2px solid rgba(255,255,255,0.3);
          padding-bottom: 10px;
        }
        
        .badge-header h2 {
          font-size: 16px;
          margin-bottom: 5px;
        }
        
        .event-name {
          font-size: 14px;
          font-weight: bold;
        }
        
        .badge-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 15px 0;
        }
        
        .participant-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          text-align: center;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 12px;
        }
        
        .label {
          font-weight: bold;
        }
        
        .badge-footer {
          text-align: center;
          border-top: 2px solid rgba(255,255,255,0.3);
          padding-top: 10px;
        }
        
        .barcode {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          letter-spacing: 2px;
          margin-bottom: 5px;
        }
        
        .footer-text {
          font-size: 10px;
        }
        
        @media print {
          body { margin: 0; padding: 0; background: white; }
          .badge-page { min-height: auto; page-break-after: always; }
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
