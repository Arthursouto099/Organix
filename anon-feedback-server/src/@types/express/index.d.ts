// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      requestLogged?: {
        userId: string;
        email: string;
        organizationId: string;
        role: string;
        org?: string
      }
    }
  }
}