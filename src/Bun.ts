declare module "bun" {
    interface Env {
        REDIS_URL: string;
        REDIRECT_URL_OPEN: string;
        REDIRECT_URL_SECURE: string;
    }
}
