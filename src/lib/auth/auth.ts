import "server-only";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { createPool } from "mysql2/promise";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import VerifyEmail from "@/components/emails/verify-email";
import { serverEnvs } from "@/core/config/envs.server";
import { ac, admin, user } from "./permissions/admin-roles";

const resend = new Resend(serverEnvs.RESEND_API_KEY);

const databasePool = createPool({
  host: serverEnvs.DATABASE_HOST,
  port: serverEnvs.DATABASE_PORT,
  user: serverEnvs.DATABASE_USER,
  password: serverEnvs.DATABASE_PASSWORD,
  database: serverEnvs.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const auth = betterAuth({
  appName: "Marketing Dashboard",
  secret: serverEnvs.BETTER_AUTH_SECRET,
  trustedOrigins: [serverEnvs.BETTER_AUTH_URL],
  database: databasePool,
  user: {
    additionalFields: {
      personId: {
        type: "number",
        required: false,
        input: false,
        fieldName: "personId",
      },
      sellerId: {
        type: "number",
        required: false,
        input: false,
        fieldName: "sellerId",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const response = await resend.emails.send({
        from: `${serverEnvs.EMAIL_SENDER_NAME} <${serverEnvs.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: "Reset your password",
        react: ForgotPasswordEmail({
          username: user.name,
          resetUrl: url,
          userEmail: user.email,
        }),
      });

      if (response.error) {
        console.error("Failed to send email:", response.error);
      } else {
        console.log("Email sent successfully:", response.data);
      }
    },
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: `${serverEnvs.EMAIL_SENDER_NAME} <${serverEnvs.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: "Verify your email",
        react: VerifyEmail({ username: user.name, verifyUrl: url }),
      });
    },
    sendOnSignUp: true,
  },
  session: {
    expiresIn: 60 * 60 * 8, // 8 horas
    updateAge: 60 * 60, // renova a cada 1 hora de atividade
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // cache de 5 minutos
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
      },
    }),
    nextCookies(),
  ],
});
