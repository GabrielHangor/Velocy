import { HTTP_METHOD, type HttpMethod, type RequestHandler } from "./types.ts";

class RouteNode {
  public readonly children = new Map<string, RouteNode>();
  public readonly handlersMap = new Map<HttpMethod, RequestHandler>();
  public params?: string[];
}

export class Router {
  private rootNode = new RouteNode();

  private addRoute(method: HttpMethod, path: string, handler: RequestHandler) {
    let currentNode = this.rootNode;

    const normalizedPath = this.normalizePath(path);
    const pathSegments = normalizedPath.split("/").filter(Boolean);
    const dynamicParamNames: string[] = [];

    for (const segment of pathSegments) {
      const isDynamicParamSegment = segment.startsWith(":");
      const segmentKey = isDynamicParamSegment ? ":" : segment;
      const hasNodeForCurrentSegment = currentNode.children.has(segmentKey);

      if (isDynamicParamSegment) {
        dynamicParamNames.push(segment.substring(1));
      }

      if (!hasNodeForCurrentSegment) {
        currentNode.children.set(segmentKey, new RouteNode());
      }

      currentNode = currentNode.children.get(segmentKey)!;
    }

    currentNode.handlersMap.set(method, handler);
    if (dynamicParamNames.length) currentNode.params = dynamicParamNames;
  }

  public findRoute(path: string, method: HttpMethod) {
    const [pathWithoutQuery, querySegment = ""] = path.split("?");
    const normalizedPath = this.normalizePath(pathWithoutQuery);
    const pathSegments = normalizedPath.split("/").filter(Boolean);

    let currentNode = this.rootNode;
    const paramValues: string[] = [];

    for (const segment of pathSegments) {
      const nextNode = currentNode.children.get(segment) ?? currentNode.children.get(":");

      if (!nextNode) return null;

      if (nextNode === currentNode.children.get(":")) {
        paramValues.push(segment);
      }

      currentNode = nextNode;
    }

    const handler = currentNode.handlersMap.get(method);

    if (!handler) return null;

    const params: Record<string, string> = {};

    if (currentNode.params) {
      for (let i = 0; i < paramValues.length; i++) {
        const key = currentNode.params[i];

        if (key) params[key] = paramValues[i];
      }
    }

    const query = this.createURLSearchParamsWithUniqueKeys(querySegment);

    return { params, handler, query };
  }

  private createURLSearchParamsWithUniqueKeys(queryString: string) {
    const uniqueKeysRecord: Record<string, string> = {};

    for (const [key, val] of new URLSearchParams(queryString).entries()) {
      uniqueKeysRecord[key] = val;
    }

    return new URLSearchParams(uniqueKeysRecord);
  }

  public get(path: string, handler: RequestHandler) {
    this.addRoute(HTTP_METHOD.GET, path, handler);
  }

  public post(path: string, handler: RequestHandler) {
    this.addRoute(HTTP_METHOD.POST, path, handler);
  }

  public put(path: string, handler: RequestHandler) {
    this.addRoute(HTTP_METHOD.PUT, path, handler);
  }

  public delete(path: string, handler: RequestHandler) {
    this.addRoute(HTTP_METHOD.DELETE, path, handler);
  }

  public patch(path: string, handler: RequestHandler) {
    this.addRoute(HTTP_METHOD.PATCH, path, handler);
  }

  public head(path: string, handler: RequestHandler) {
    this.addRoute(HTTP_METHOD.HEAD, path, handler);
  }

  public options(path: string, handler: RequestHandler) {
    this.addRoute(HTTP_METHOD.OPTIONS, path, handler);
  }

  public connect(path: string, handler: RequestHandler) {
    this.addRoute(HTTP_METHOD.CONNECT, path, handler);
  }

  public trace(path: string, handler: RequestHandler) {
    this.addRoute(HTTP_METHOD.TRACE, path, handler);
  }

  private normalizePath(path: string) {
    if (!path.length) throw new Error("Path is empty");
    if (path.includes(" ")) throw new Error("Path should not contain whitespaces");
    if (!path.startsWith("/")) throw new Error("Path should start with a forward slash /");

    const normalizedPath = path.replace(/\/\/+/g, "/").toLowerCase();

    return normalizedPath;
  }

  public print() {
    const printNode = (currentNode: RouteNode, segment: string, depth: number, isRoot: boolean = false) => {
      const indent = "  ".repeat(depth);
      const prefix = isRoot ? "" : `${indent}|-- `;
      const nodeName = segment === ":" ? ": (dynamic)" : segment;

      console.log(`${prefix}${nodeName}`);

      if (currentNode.handlersMap.size > 0) {
        const handlers = Array.from(currentNode.handlersMap.entries())
          .map(([method, handler]) => `${method}: ${handler.name || "anonymous"}`)
          .join(", ");
        console.log(`${indent}  Handlers: [${handlers}]`);
      }

      if (currentNode.params && currentNode.params.length > 0) {
        console.log(`${indent}  Params: [${currentNode.params.join(", ")}]`);
      }

      for (const [childSegment, childNode] of currentNode.children.entries()) {
        printNode(childNode, childSegment, depth + 1);
      }
    };

    console.log("Router Structure:");
    printNode(this.rootNode, "Root node", 0, true);
  }
}
