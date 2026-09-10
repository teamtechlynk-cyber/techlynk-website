declare module "resend" {
  export interface EmailAttachment {
    filename: string
    content: Buffer | string
    contentType?: string
  }

  export interface SendEmailOptions {
    from: string
    to: string | string[]
    subject: string
    replyTo?: string
    html?: string
    text?: string
    attachments?: EmailAttachment[]
  }

  export interface SendEmailResponse {
    data?: { id: string }
    error?: { message: string }
  }

  export class Resend {
    constructor(apiKey?: string)
    emails: {
      send(options: SendEmailOptions): Promise<SendEmailResponse>
    }
  }
}
