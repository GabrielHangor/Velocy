import { Router, Velocy } from "./velocy/index.ts";

const PORT = 3000;

const router = new Router();

const server = new Velocy(router, PORT);
server.run();
