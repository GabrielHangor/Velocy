import { IncomingMessage, ServerResponse } from "node:http";

export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
  CONNECT: "CONNECT",
  TRACE: "TRACE",
} as const;

export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

export interface VelocyRequest extends IncomingMessage {
  params: Record<string, string | undefined>;
  query: URLSearchParams;
}

export type RequestHandler = (request: VelocyRequest, response: ServerResponse) => void;
