import { Server } from "http";
import app from "./app";
const port = 5000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log("Server is running on port", port);
  });
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed");
      });
    }
    process.exit(1);
  };
  process.on("uncaughtExpectstion", (error) => {
    console.log(error);
    exitHandler();
  });
  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
}
main();
