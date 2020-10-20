const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const csv = require("csv-parser");
const fs = require("fs");
const stream = require("stream");
const Joi = require("joi");
const { AsyncLocalStorage } = require("async_hooks");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

const HEADERS = "id,title,location,date,hour";
const FILENAME = "events.csv";

const generateId = () => Math.random().toString().split(".")[1];

const asyncLocalStorage = new AsyncLocalStorage();

const schema = Joi.object({
  title: Joi.string().alphanum().max(30).required(),
  location: Joi.string().alphanum().max(30).required(),
  date: Joi.date().required(),
  hour: Joi.string().pattern(new RegExp("^[0-9][0-9]:[0-9][0-9]$")),
});

async function writeEventsToCsv(events) {
  const lineSeparator = "\n";
  const data = events.map(
    (item) =>
      `${item.id},${item.title},${item.location},${item.date},${item.hour}`
  );
  await fs.promises.writeFile(
    FILENAME,
    `${HEADERS}${lineSeparator}${data.join(lineSeparator)}`
  );
}

async function readEventsFromCSV() {
  const data = [];
  return new Promise(function (resolve, reject) {
    fs.createReadStream(FILENAME)
      .pipe(csv())
      .on("error", (error) => reject(error))
      .on("data", (row) => data.push(row))
      .on("end", () => {
        resolve(data);
      });
  });
}

app.use(bodyParser.json());

app.get("/events", async (req, res, next) => {
  asyncLocalStorage.run(req, async () => {
    const location = req.query.location;
    logger.info("incoming request for events", {
      timestamp: new Date(),
      location,
    });
    // error
    const error = new Error("fatal error");
    error.statusCode = 301;
    next(error);
    ///
    const events = await readEventsFromCSV();
    if (location) {
      return res.json(events.filter((event) => event.location === location));
    }
    res.json(events);
  });
});

app.get("/events/:eventId", async (req, res, next) => {
  asyncLocalStorage.run(req, async () => {
    try {
      const eventId = req.params.eventId;
      logger.info("incoming request for event", {
        timestamp: new Date(),
        eventId,
      });
      const events = await readEventsFromCSV();
      const event = events.filter(
        (event) => event.id.toString() === eventId
      )[0];

      if (!event) {
        return res.sendStatus(404);
      }

      res.json(event);
    } catch (e) {
      next(e);
    }
  });
});

app.post("/events", async (req, res, next) => {
  asyncLocalStorage.run(req, async () => {
    try {
      const { title, location, date, hour } = req.body;
      const events = await readEventsFromCSV();
      const event = events.filter(
        (event) => event.date === date && event.hour === hour
      )[0];
      if (event) {
        logger.error("conflicting entity when adding event", {
          timestamp: new Date(),
          event,
        });
        return res.status(400).send("conflicting entity");
      }

      const newEvent = { title, location, date, hour };
      const { error } = schema.validate(newEvent);
      if (error) {
        logger.error(error.message, {
          timestamp: new Date(),
          newEvent,
        });
        return res.status(400).send(error.message);
      }

      newEvent.id = generateId();
      events.push(newEvent);
      await writeEventsToCsv(events);
      logger.info("new event added", {
        timestamp: new Date(),
        eventId,
      });
      res.json(newEvent);
    } catch (e) {
      next(e);
    }
  });
});

app.put("/events/:eventId", async (req, res, next) => {
  asyncLocalStorage.run(req, async () => {
    try {
      const eventId = req.params.eventId;
      logger.info("updating event", {
        timestamp: new Date(),
        eventId,
      });
      const events = await readEventsFromCSV();
      const eventIndex = events.findIndex(
        (event) => event.id.toString() === eventId
      );
      if (eventIndex === -1) {
        logger.error("event not found", {
          timestamp: new Date(),
          eventId,
        });
        return res.sendStatus(404);
      }

      const { title, location, date, hour } = req.body;
      const newEvent = { title, location, date, hour };
      const { error } = schema.validate(newEvent);
      if (error) {
        logger.error(error.message, {
          timestamp: new Date(),
          newEvent,
        });
        return res.status(400).send(error.message);
      }

      newEvent.id = eventId;

      const newEvents = [
        ...events.slice(0, eventIndex),
        newEvent,
        ...events.slice(eventIndex + 1, events.length),
      ];

      await writeEventsToCsv(newEvents);
      res.json(newEvent);
    } catch (e) {
      next(e);
    }
  });
});

app.get("/events-batch", async (req, res, next) => {
  asyncLocalStorage.run(req, async () => {
    try {
      logger.info("batch streaming events", {
        timestamp: new Date(),
      });
      const events = await readEventsFromCSV();
      const streamEvents = stream.Readable.from(JSON.stringify(events));
      streamEvents.pipe(res);
    } catch (e) {
      next(e);
    }
  });
});

app.listen(3000, () => {
  console.log("server start at port 3000"); //the server object listens on port 3000
});

app.use((error, req, res, next) => {
  // get local storage
  const context = asyncLocalStorage.getStore();
  logger.error(error.toString(), { context, timestamp: new Date() });
  return res.status(500).json({ error: error.toString() });
});

process.on("unhandledRejection", () => {
  logger.error("unhandled rejection warning", { timestamp: new Date() });
});

process.on("uncaughtException", () => {
  logger.error("exception", { timestamp: new Date() });
});

// curl --request GET 'http://localhost:3000/events'

// curl --request GET 'http://localhost:3000/events?location=Lviv'

// curl --request POST 'http://localhost:3000/events' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//    "title": "teambuilding",
//    "location": "Lviv",
//    "date": "12.10.2020",
//    "hour": "15:00"
// }'

//  curl --location --request PUT 'http://localhost:3000/events/3' \
//  --header 'Content-Type: application/json' \
//  --data-raw '{
//  "title": "presentation",
//  "location": "London",
//  "date": "15.10.2020",
//  "hour": "10:00"
//  }'

// curl --request GET 'http://localhost:3000/events-batch'
