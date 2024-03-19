// export const variables = {
//   // App Variables
//   app_name: process.env.APP_NAME,
//   api_prefix: process.env.API_PREFIX,
//   data_base_url: process.env.DATABASE_URL,
//   env_mysql_user: process.env.ENV_MYSQL_USER,
//   env_mysql_password:
//     process.env.ENV_MYSQL_PASSWORD,
//   env_mysql_root_pasword:
//     process.env.ENV_MYSQL_ROOT_PASSWORD,

//   // Tokens Secrets
//   jwt_access_token_secret:
//     process.env.JWT_ACCESS_TOKEN_SECRET,
//   jwt_refresh_token_secret:
//     process.env.JWT_REFRESH_TOKEN_SECRET,
//   jwt_access_token_long:
//     process.env.JWT_ACCESS_TOKEN_LONG,
//   jwt_refresh_token_long:
//     process.env.JWT_REFRESH_TOKEN_LONG,
//   jwt_access_token_time_calc:
//     process.env.JWT_ACCESS_TOKEN_TIME_CALC,
//   jwt_refresh_token_time_calc:
//     process.env.JWT_REFRESH_TOKEN_TIME_CALC,
//   env_salt: process.env.SALT,

//   // Redis Credentials
//   redis_host: process.env.REDIS_HOST,
//   redis_docker_host:
//     process.env.REDIS_DOCKER_HOST,
//   redis_port: process.env.REDIS_PORT,
//   redis_password: process.env.REDIS_PASSWORD,

//   // Smtp Credentials
//   email_address: process.env.EMAIL_ADDRESS,
//   email_user: process.env.EMAIL_USER,
//   email_token: process.env.EMAIL_TOKEN,
//   email_app_password:
//     process.env.EMAIL_APP_PASSWORD,
//   email_smtp: process.env.EMAIL_SMTP_HOST,
//   email_port: process.env.EMAIL_PORT,
//   email_default: process.env.EMAIL_DEFAULT,

//   // Production Variables
//   nest_env: process.env.NEST_ENV,
//   dev_domaine: process.env.DEV_DOMAINE,
//   prod_domaine: process.env.PROD_DOMAINE,
//   port_domaine: process.env.PORT_DOMAIN,

//   // Docker Services Exposing Ports
//   nginx_exposing_port:
//     process.env.NGINX_EXPOSING_PORT,
//   redis_exposing_port:
//     process.env.REDIS_EXPOSING_PORT,
//   mysql_db_exposing_port:
//     process.env.MYSQL_DB_EXPOSING_PORT,
//   mysql_service_name:
//     process.env.MYSQL_SERVICE_NAME,

//   // App Variables
//   server_mode: process.env.SERVER_MODE,
//   app_exposing_port:
//     process.env.APP_EXPOSING_PORT,
//   db_name: process.env.DB_NAME,
// };

export class VariablesModule {
  static variables = {
    // App Variables
    app_name: process.env.APP_NAME,
    api_prefix: process.env.API_PREFIX,
    data_base_url: process.env.DATABASE_URL,
    env_mysql_user: process.env.ENV_MYSQL_USER,
    env_mysql_password:
      process.env.ENV_MYSQL_PASSWORD,
    env_mysql_root_pasword:
      process.env.ENV_MYSQL_ROOT_PASSWORD,

    // Tokens Secrets
    jwt_access_token_secret:
      process.env.JWT_ACCESS_TOKEN_SECRET,
    jwt_refresh_token_secret:
      process.env.JWT_REFRESH_TOKEN_SECRET,
    jwt_access_token_long:
      process.env.JWT_ACCESS_TOKEN_LONG,
    jwt_refresh_token_long:
      process.env.JWT_REFRESH_TOKEN_LONG,
    jwt_access_token_time_calc:
      process.env.JWT_ACCESS_TOKEN_TIME_CALC,
    jwt_refresh_token_time_calc:
      process.env.JWT_REFRESH_TOKEN_TIME_CALC,
    env_salt: process.env.SALT,

    // Redis Credentials
    redis_host: process.env.REDIS_HOST,
    redis_docker_host:
      process.env.REDIS_DOCKER_HOST,
    redis_port: process.env.REDIS_PORT,
    redis_password: process.env.REDIS_PASSWORD,

    // Smtp Credentials
    email_address: process.env.EMAIL_ADDRESS,
    email_user: process.env.EMAIL_USER,
    email_token: process.env.EMAIL_TOKEN,
    email_app_password:
      process.env.EMAIL_APP_PASSWORD,
    email_smtp: process.env.EMAIL_SMTP_HOST,
    email_port: process.env.EMAIL_PORT,
    email_default: process.env.EMAIL_DEFAULT,

    // Production Variables
    nest_env: process.env.NEST_ENV,
    dev_domaine: process.env.DEV_DOMAINE,
    prod_domaine: process.env.PROD_DOMAINE,
    port_domaine: process.env.PORT_DOMAIN,

    // Docker Services Exposing Ports
    nginx_exposing_port:
      process.env.NGINX_EXPOSING_PORT,
    redis_exposing_port:
      process.env.REDIS_EXPOSING_PORT,
    mysql_db_exposing_port:
      process.env.MYSQL_DB_EXPOSING_PORT,
    mysql_service_name:
      process.env.MYSQL_SERVICE_NAME,

    // App Variables
    server_mode: process.env.SERVER_MODE,
    app_exposing_port:
      process.env.APP_EXPOSING_PORT,
    db_name: process.env.DB_NAME,
  };
}
