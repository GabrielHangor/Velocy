import { createServer } from "node:http";
import type { Router } from "./router/Router.ts";
import type { HttpMethod, VelocyRequest } from "./router/types.ts";

export class Velocy {
  private readonly router: Router;
  private readonly port: number;

  constructor(router: Router, port: number) {
    this.router = router;
    this.port = port;
  }

  public run() {
    createServer((req, res) => {
      const method = req.method as HttpMethod;
      const path = req.url as string;

      const route = this.router.findRoute(path, method);

      const handler = route?.handler;

      if (handler) {
        const velocyRequest = req as VelocyRequest;
        velocyRequest.params = route.params;
        velocyRequest.query = route.query;

        handler(velocyRequest, res);
      } else {
        res.writeHead(404, { "content-length": 9 });
        res.end("Not Found");
      }
    }).listen(this.port);
  }
}
