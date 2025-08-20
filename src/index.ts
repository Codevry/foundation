import Router from "@/src/routes/router.ts";

const router = new Router();

export default {
    port: 3131,
    fetch: (await router.connect()).fetch,
};
