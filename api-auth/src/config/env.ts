import * as dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '../../.env' });

const Environment = {
  TOKEN_SECRET_KEY: String(process.env['TOKEN_SECRET_KEY']),
};

export interface Application {
  appName: string;
  appCode: string;
};

export const AppDictionary: Array<Application> = [
  {
    appName: "charging",
    appCode: "3b6eb659-da6a-436d-a9c2-22d8fcbdfaae"
  }
];

export default Environment;