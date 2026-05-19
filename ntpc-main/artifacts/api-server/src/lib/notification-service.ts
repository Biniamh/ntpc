import { EyParticipant } from "@workspace/db";

export interface NotificationData {
  email?: string;
  phoneNumber?: string;
  registrationNumber: string;
  eventName: string;
  roundNumber: number;
  roundDates?: { from: string; to: string };
  participantName: string;
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
  provider: "telebirr" | "custom";
  apiKey: string;
  senderName?: string;
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
   * TODO: Integrate with actual email provider (SendGrid, AWS SES, etc.)
   */
  async sendEmailNotification(data: NotificationData): Promise<boolean> {
    if (!data.email || !this.smtpConfig) {
      console.log("Email notification skipped: missing email or SMTP config");
      return false;
    }

    try {
      const emailBody = this.generateEmailBody(data);
      const emailSubject = `Registration Confirmation - ${data.eventName}`;

      // TODO: Replace with actual email sending logic
      console.log(
        `Email would be sent to ${data.email} with subject: ${emailSubject}`,
      );
      console.log("Email body:", emailBody);

      // Example structure for email sending:
      // const transporter = nodemailer.createTransport(this.smtpConfig);
      // await transporter.sendMail({
      //   from: this.smtpConfig.auth.user,
      //   to: data.email,
      //   subject: emailSubject,
      //   html: emailBody,
      // });

      return true;
    } catch (error) {
      console.error("Failed to send email notification:", error);
      return false;
    }
  }

  /**
   * Send SMS notification to participant
   * TODO: Integrate with actual SMS provider (Telebirr, Twilio, etc.)
   */
  async sendSMSNotification(data: NotificationData): Promise<boolean> {
    if (!data.phoneNumber || !this.smsConfig) {
      console.log("SMS notification skipped: missing phone number or SMS config");
      return false;
    }

    try {
      const smsBody = this.generateSMSBody(data);

      // TODO: Replace with actual SMS sending logic based on provider
      console.log(`SMS would be sent to ${data.phoneNumber}: ${smsBody}`);

      // Example structure for different providers:
      // if (this.smsConfig.provider === "telebirr") {
      //   // Telebirr SMS integration
      //   const response = await fetch("https://api.telebirr.com/sms/send", {
      //     method: "POST",
      //     headers: { Authorization: `Bearer ${this.smsConfig.apiKey}` },
      //     body: JSON.stringify({
      //       phone: data.phoneNumber,
      //       message: smsBody,
      //     }),
      //   });
      //   return response.ok;
      // }

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
    return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px;">
            <h1>Welcome to ${data.eventName}</h1>
          </div>

          <div style="background: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px;">
            <h2>Registration Confirmation</h2>
            <p>Dear ${data.participantName},</p>
            
            <p>Thank you for registering for <strong>${data.eventName}</strong>. Your registration has been successfully processed.</p>

            <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea;">
              <h3>Registration Details</h3>
              <p><strong>Registration Number:</strong> ${data.registrationNumber}</p>
              <p><strong>Round:</strong> Round ${data.roundNumber}</p>
              ${
                data.roundDates
                  ? `<p><strong>Event Dates:</strong> ${data.roundDates.from} - ${data.roundDates.to}</p>`
                  : ""
              }
            </div>

            <p>Please save your registration number as you will need it to check in at the event.</p>
            
            <p style="margin-top: 30px; color: #666; font-size: 12px;">
              If you have any questions, please contact our support team.
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© NTPC - All rights reserved</p>
          </div>
        </div>
      </body>
    </html>
    `;
  }

  /**
   * Generate SMS body
   */
  private generateSMSBody(data: NotificationData): string {
    return `Hi ${data.participantName}, your registration for ${data.eventName} is confirmed. Reg#: ${data.registrationNumber}. Round ${data.roundNumber}. Thank you!`;
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

  const smsConfig: SMSConfig | undefined = process.env.SMS_PROVIDER
    ? {
        provider: (process.env.SMS_PROVIDER as "telebirr" | "custom") || "custom",
        apiKey: process.env.SMS_API_KEY || "",
        senderName: process.env.SMS_SENDER_NAME,
      }
    : undefined;

  return new NotificationService(smtpConfig, smsConfig);
}
