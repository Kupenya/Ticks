import express, { Application } from "express";
import config from "./config";
import db from "./db";
import http from "http";
import routes from "./routes";

class Server {
  public app: Application;
  public port: number;
  private server: http.Server;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = config.PORT;
    this.initializeDB();
    this.initializeSystemMiddlewares();
    this.routes();
  }

  // Connect Database
  private async initializeDB(): Promise<void> {
    await db.connect().then(() => {
      console.log("Models initialized");
    });
  }

  private initializeSystemMiddlewares(): void {
    // Parse JSON Request Body
    this.app.use(express.json({ limit: "5mb" }));
    // parse urlencoded request body
    this.app.use(express.urlencoded({ limit: "5mb", extended: true }));
  }

  // Route Handling
  private routes(): void {
    this.app.use(routes);
  }

  // Start Express Application Server
  public start(): void {
    this.app
      .listen(this.port, () => {
        console.log(`Server running on http://localhost:${this.port}`);
      })
      .on("error", (error: Error) => {
        if (error.name === "EADDRINUSE") {
          console.log(
            `Error: Port ${this.port} is already in use. Trying next port...`
          );
          this.port++;
          this.start();
        }
      });
  }

  public getApp(): Application {
    return this.app;
  }
}

const server = new Server();
server.start();

export default server;
export const app = server.getApp();
