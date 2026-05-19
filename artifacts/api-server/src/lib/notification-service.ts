import { EyParticipant } from "@workspace/db";
import nodemailer from "nodemailer";

export interface NotificationData {
  email?: string;
  phoneNumber?: string;
  registrationNumber: string;
  eventName: string;
  roundNumber: number;
  roundDates?: { from: string; to: string };
  participantName: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  coordinatorId?: string | number;
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface SMSConfig {
  provider: "telebirr" | "custom" | "textbee";
  apiKey: string;
  senderName?: string;
  baseUrl?: string;
}

/**
 * Notification Service
 * Handles email and SMS notifications for participants
 */
export class NotificationService {
  private smtpConfig?: SMTPConfig;
  private smsConfig?: SMSConfig;

  constructor(smtpConfig?: SMTPConfig, smsConfig?: SMSConfig) {
    this.smtpConfig = smtpConfig;
    this.smsConfig = smsConfig;
  }

/**
    * Send email notification to participant
    */
  async sendEmailNotification(data: NotificationData): Promise<boolean> {
    if (!data.email || !this.smtpConfig) {
      console.log("Email notification skipped: missing email or SMTP config");
      return false;
    }

    try {
      const emailBody = this.generateEmailBody(data);
      const emailSubject = `የምዝገባ ማረጋገጫ - ${data.eventName}`;

      const transporter = nodemailer.createTransport(this.smtpConfig);
      
      await transporter.sendMail({
        from: `"መልካም ወጣት" <${this.smtpConfig.auth.user}>`,
        to: data.email,
        subject: emailSubject,
        html: emailBody,
      });

      console.log(`Email sent successfully to ${data.email}`);
      return true;
    } catch (error) {
      console.error("Failed to send email notification:", error);
      return false;
    }
  }

/**
    * Send SMS notification to participant via TextBee
    */
  async sendSMSNotification(data: NotificationData): Promise<boolean> {
    if (!data.phoneNumber || !this.smsConfig) {
      console.log("SMS notification skipped: missing phone number or SMS config");
      return false;
    }

    try {
      const smsBody = this.generateSMSBody(data);

      // TextBee SMS integration
      if (this.smsConfig.provider === "textbee") {
        const deviceId = process.env.TEXTBEE_DEVICE_ID;
        
        if (!deviceId) {
          console.error("TextBee device ID not configured. Set TEXTBEE_DEVICE_ID environment variable.");
          return false;
        }
        
        // TextBee API: POST /api/v1/gateway/devices/{DEVICE_ID}/send-sms
        // Phone number must be in E.164 format (+1234567890)
        const formattedPhone = data.phoneNumber.startsWith("+") 
          ? data.phoneNumber 
          : `+251${data.phoneNumber.replace(/^0/, "")}`;
        
        const response = await fetch(
          `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": this.smsConfig.apiKey,
            },
            body: JSON.stringify({
              recipients: [formattedPhone],
              message: smsBody,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("TextBee SMS failed:", response.status, errorText);
          return false;
        }

        const result = await response.json();
        console.log(`TextBee SMS sent to ${data.phoneNumber}:`, result);
        return true;
      }

      // Other provider placeholders
      console.log(`SMS would be sent to ${data.phoneNumber}: ${smsBody}`);
      return true;
    } catch (error) {
      console.error("Failed to send SMS notification:", error);
      return false;
    }
  }

  /**
   * Send both email and SMS notifications
   */
  async sendNotification(data: NotificationData): Promise<{
    emailSent: boolean;
    smsSent: boolean;
  }> {
    const [emailSent, smsSent] = await Promise.all([
      this.sendEmailNotification(data),
      this.sendSMSNotification(data),
    ]);

    return { emailSent, smsSent };
  }

/**
    * Generate HTML email body
    */
  private generateEmailBody(data: NotificationData): string {
    const fullName = [data.firstName, data.middleName, data.lastName]
      .filter(Boolean)
      .join(" ") || data.participantName;
    
    return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px;">
            <h1>Welcome to ${data.eventName}</h1>
          </div>

          <div style="background: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px;">
            <h2>የምዝገባ ማረጋገጫ</h2>
            <p>Dear ${fullName},</p>
            
            <p>ስለተመዘገቡ እናመሰግናለን <strong>${data.eventName}</strong>. ምዝገባዎ በተሳካ ሁኔታ ተካሂዷል.</p>

            <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3>የምዝገባ ዝርዝሮች</h3>
              <p><strong>የምዝገባ ቁጥር:</strong> ${data.registrationNumber}</p>
              <p><strong>ዙር:</strong> Round ${data.roundNumber}</p>
              ${
                data.roundDates
                  ? `<p><strong>ቀኖች:</strong> ${data.roundDates.from} - ${data.roundDates.to}</p>`
                  : ""
              }
            </div>

            <p>በዝግጅቱ ላይ ለመግባት ስለሚፈልጉ እባክዎን የመመዝገቢያ ቁጥርዎን ያስቀምጡ.</p>
            
            <p style="margin-top: 30px; color: #666; font-size: 12px;">
             ማንኛውም አይነት ጥያቄ ካለዎት እባክዎ የድጋፍ ቡድናችንን ያነጋግሩ።
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© መልካም ወጣት - All rights reserved</p>
          </div>
        </div>
      </body>
    </html>
    `;
  }

/**
    * Generate SMS body with registration details
    */
  private generateSMSBody(data: NotificationData): string {
    const displayName = [data.firstName, data.middleName, data.lastName]
      .filter(Boolean)
      .join(" ") || data.participantName;
    
    const roundInfo = data.roundDates
      ? ` ቀናት: ከ ${data.roundDates.from} እስከ ${data.roundDates.to}.`
      : "";
    return `ሰላም ${displayName}, የ ${data.eventName} ምዝገባዎ በተሳካ ሁኔታ ተጠናቋል! የምዝገባ ቁጥር: Reg#: ${data.registrationNumber}, ዙር ${data.roundNumber}.${roundInfo} አስተባባሪ ID: ${data.coordinatorId || "N/A"}. መልካም ቆይታ ይሁንሎት!`;
  }
}

/**
 * Initialize notification service with configuration from environment variables
 */
export function initializeNotificationService(): NotificationService {
  const smtpConfig: SMTPConfig | undefined = process.env.SMTP_HOST
    ? {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER || "",
          pass: process.env.SMTP_PASS || "",
        },
      }
    : undefined;

  const smsProvider = process.env.SMS_PROVIDER as "telebirr" | "custom" | "textbee" | undefined;
  const smsConfig: SMSConfig | undefined = smsProvider
    ? {
        provider: smsProvider,
        apiKey: process.env.SMS_API_KEY || "",
        senderName: process.env.SMS_SENDER_NAME,
        baseUrl: process.env.TEXTBEE_API_URL,
      }
    : undefined;

  return new NotificationService(smtpConfig, smsConfig);
}
