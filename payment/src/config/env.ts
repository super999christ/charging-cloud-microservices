import * as dotenv from "dotenv";

dotenv.config();
if (process.env.CONSUMER_ENVIRONMENT === 'local')
  dotenv.config({ path: "../.env" });

const Environment = {
  SERVICE_API_AUTH_URL: String(process.env["SERVICE_API_AUTH_URL"]),
  STRIPE_API_KEY: String(process.env["STRIPE_API_KEY"]),
  SERVICE_USER_MANAGEMENT_URL: String(
    process.env["SERVICE_USER_MANAGEMENT_URL"]
  ),
};

export default Environment;
