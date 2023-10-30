import * as process from 'process';
import { assertEquals } from 'typia';

export type EnvironmentConfiguration = {
    environment: 'development' | 'production' | 'test';
    host: string;
    port: number;
    cors: boolean;
    allowedOrigins: URL[];
};

function getEnvironmentMode(): 'development' | 'production' | 'test' {
    return ['development', 'production', 'test'].includes(String(process.env.NODE_ENV))
        ? (String(process.env.NODE_ENV) as 'development' | 'production' | 'test')
        : 'development';
}

const environment: EnvironmentConfiguration = {
    environment: getEnvironmentMode(),
    host: process.env.HOST || '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
    cors: process.env.CORS === 'true',
    allowedOrigins:
        (process.env.CORS === 'true' && process.env.ALLOWED_ORIGINS?.split(',').map((origin) => new URL(origin))) || [],
};

export function checkEnvironment() {
    assertEquals<EnvironmentConfiguration>(environment);
}
export function environmentConfiguration() {
    return environment;
}
