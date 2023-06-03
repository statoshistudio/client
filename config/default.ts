import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 7000;
module.exports = {
	app: {
		appName: process.env.APP_NAME || 'SS-GATEWAY',
        prefix: `ss-gateway-${process.env.NODE_ENV}`,
		environment: process.env.NODE_ENV || 'dev',
		superSecret: process.env.SERVER_SECRET || 'ipa-BUhBOJAm',
		baseUrl: `http://localhost:${PORT}`,
		port: PORT,
		workerPort: process.env.WORKER_PORT ?? 8000,
		email_encryption: process.env.EMAIL_ENCRYPTION || false,
		verify_redirect_url: `${process.env.BASE_URL}/verify`,
		authKey: `${process.env.AUTH_KEY}`,
       
	},
	api: {
		url: process.env.SERVICE_URL || 'http://127.0.0.1:3000/api/v1',
		lang: 'en',
		prefix: '^/api/v[1-9]',
		resource: '^/resources/[a-zA-Z-]+',
		versions: [1],
		patch_version: '1.0.0',
		pagination: {
			itemsPerPage: 10,
		},
		email_encryption: false,
		expiresIn: 3600 * 124 * 100,
	},
	
	redis: {
		url: process.env.REDIS_SERVER_HOST_URL,
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT || 6379,
		password: process.env.REDIS_PASSWORD,
    },
	databases: {
		db: process.env.db || 'sql',
		mongodb: {
			url: process.env.DB_URL,
			test: process.env.DB_TEST_URL,
		},
		sql: {
			SQLUsername: process.env.SQL_USERNAME || 'XXX',
			SQLPassword: process.env.SQL_PASSWORD || 'XXX',
			SQLDatabase: process.env.SQL_DATABASE || 'XXX',
			SQLHost: process.env.SQL_HOST || 'XXX',
			SQLPort: process.env.SQL_PORT || 3306,
			SQLDriver: process.env.SQL_DRIVER || 'mysql', // 'mysql'|'sqlite'|'postgres'|'mssql'
			SQLTimezone: process.env.SQL_TIMEZONE || '+01:00',
		},
	},
};
