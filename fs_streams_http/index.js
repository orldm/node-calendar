const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const csv = require("csv-parser");
const fs = require("fs");
const stream = require("stream");
const Joi = require("joi");

const HEADERS = "id,title,location,date,hour";
const FILENAME = "events.csv";

const generateId = () => Math.random().toString().split(".")[1];

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

app.get("/events", async (req, res) => {
  const location = req.query.location;
  const events = await readEventsFromCSV();

  if (location) {
    return res.json(events.filter((event) => event.location === location));
  }

  res.json(events);
});

app.get("/events/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  const events = await readEventsFromCSV();
  const event = events.filter((event) => event.id.toString() === eventId)[0];

  if (!event) {
    return res.sendStatus(404);
  }

  res.json(event);
});

app.post("/events", async (req, res) => {
  const { title, location, date, hour } = req.body;
  const events = await readEventsFromCSV();
  const event = events.filter(
    (event) => event.date === date && event.hour === hour
  )[0];
  if (event) {
    return res.status(400).send("conflicting entity");
  }

  const { error } = schema.validate({ title, location, date, hour });
  if (error) {
    return res.status(400).send(error.message);
  }

  const id = generateId();
  const newEvent = { id, title, location, date, hour };
  events.push(newEvent);
  await writeEventsToCsv(events);
  res.json(newEvent);
});

app.put("/events/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  const events = await readEventsFromCSV();
  const eventIndex = events.findIndex(
    (event) => event.id.toString() === eventId
  );
  if (eventIndex === -1) {
    return res.sendStatus(404);
  }

  const { title, location, date, hour } = req.body;
  const { error } = schema.validate({ title, location, date, hour });
  if (error) {
    return res.status(400).send(error.message);
  }

  const newEvent = { id: eventIndex + 1, title, location, date, hour };

  const newEvents = [
    ...events.slice(0, eventIndex),
    newEvent,
    ...events.slice(eventIndex + 1, events.length),
  ];

  await writeEventsToCsv(newEvents);
  res.json(newEvent);
});

app.get("/events-batch", async (req, res) => {
  const events = await readEventsFromCSV();
  const streamEvents = stream.Readable.from(JSON.stringify(events));
  streamEvents.pipe(res);
});

app.listen(3000, () => {
  console.log("server start at port 3000"); //the server object listens on port 3000
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
