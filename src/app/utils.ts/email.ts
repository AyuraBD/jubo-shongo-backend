import ejs from 'ejs';
import nodemailer from 'nodemailer';
/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../errorHelpers/AppError";
import path from "path";
import { EnvVars } from '../../config/env';

const transporter = nodemailer.createTransport({
  host: EnvVars.EMAIL_SENDER_SMTP_HOST,
  port: Number(EnvVars.EMAIL_SENDER_SMTP_PORT),
  secure: true,
  auth: {
    user: EnvVars.EMAIL_SENDER_SMTP_USER,
    pass: EnvVars.EMAIL_SENDER_SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?:{
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[]
}

export const sendEmail = async ({subject, templateData, templateName, to, attachments}:SendEmailOptions) => {
  try {
    const templatePath = path.resolve(`${process.cwd()}/src/app/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: EnvVars.EMAIL_SENDER_SMTP_USER,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      }))
    });
    // await transporter.sendMail({
    //   from: envVars.EMAIL_SENDER_SMTP_USER,
    //   to: to,
    //   subject: subject,
    //   template: templateName,
    //   context: templateData,
    //   attachments: attachments ? [attachments] : undefined
    // });
    console.log(`Email sent to ${to}`, info.messageId);
  } catch (error:any) {
    console.error(`Failed to send email to ${to}:`, error.message);
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email. Please try again." );
  }
}