/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    // CF Account API Email
    // readonly CF_API_EMAIL: string;
    // CF Account ID
    // readonly CF_ACCOUNT_ID: string;
    // CF API Key
    // readonly CF_API_KEY: string;
    // CF D1 Database id
    // readonly CF_D1_ID: string;

    // Blog Manager User
    readonly ADMIN_USER?: string;
    // Blog Manager Password
    readonly ADMIN_PWD?: string;
    // Blog Manager JET Secret
    readonly ADMIN_JWT_SECRET: string;

    // Directus
    readonly DIRECUS_URL: string;
    readonly DIRECTUS_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
