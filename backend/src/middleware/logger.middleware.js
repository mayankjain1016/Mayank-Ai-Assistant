import morgan from "morgan";
import logger from "../config/logger.js";
import { ENV } from "../config/env.js";

const stream = {
  write: (message) => logger.info(message.trim()),
};

const skip = () => {
  const env = ENV.NODE_ENV || "development";
  return env !== "development";
};

const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);

export { morganMiddleware };
