import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  node_env : process.env.node_env,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expire_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expire_in: process.env.REFRESH_TOKEN_EXPIRE_IN,
    reset_password_secret: process.env.RESET_PASSPWRD_SECRET,
    reset_password_expired_in: process.env.RESET_PASSPWRD_TOKEN_EXPRED_IN,
  },
  reset_pass_link: process.env.RESET_PASSPWRD_LINK,
  smtpEmail: {
    smtp_email: process.env.EMAIL,
    smtp_password: process.env.APP_PASSWORD,
  },
  ssl: {
    stored_id: process.env.STORE_ID,
    stored_passwd: process.env.STORE_PASSWD,
    success_url: process.env.SUCCESS_URL,
    failed_url: process.env.FAILED_URL,
    cancel_url: process.env.CANCEL_URL,
    ssl_payment_api: process.env.SSL_PAYMENT_API,
    ssl_validation_api: process.env.SSL_VALIDATION_API,
  },
};
