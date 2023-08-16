import * as dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '../../.env' });

const Environment = {
  DATABASE_HOST: String(process.env['POSTGRES_HOST']),
  DATABASE_PORT: Number(process.env['POSTGRES_PORT']),
  DATABASE_USER: String(process.env['POSTGRES_USER']),
  DATABASE_PASSWORD: String(process.env['POSTGRES_PASSWORD']),
  DATABASE_NAME: String(process.env['POSTGRES_DB']),
  TWILIO_ACCOUNT_SID: String(process.env['TWILIO_ACCOUNT_SID']),
  TWILIO_AUTH_TOKEN: String(process.env['TWILIO_AUTH_TOKEN']),
  TWILIO_PHONE_NUMBER: String(process.env['TWILIO_PHONE_NUMBER']),
  SERVICE_API_AUTH_URL: String(process.env['SERVICE_API_AUTH_URL']),
  SMTP_HOST: String(process.env['SMTP_HOST']),
  SMTP_PORT: Number(process.env['SMTP_PORT']),
  SMTP_USERNAME: String(process.env['SMTP_USERNAME']),
  SMTP_PASSWORD: String(process.env['SMTP_PASSWORD']),
  FRONTEND_URL: String(process.env['FRONTEND_URL']),
};

export default Environment;