import Joi from "joi";
import eventService from "../services/eventService";
import Util from "../util";

const schema = Joi.object({
  title: Joi.string().alphanum().max(30).required(),
  location: Joi.string().alphanum().max(30).required(),
  date: Joi.date().required(),
  hour: Joi.string().pattern(new RegExp("^[0-9][0-9]:[0-9][0-9]$")).required(),
  userId: Joi.number().required(),
  participantsIds: Joi.array().items(Joi.number()).required(),
});

const util = new Util();

class eventController {
  static async getEvents(req, res) {
    try {
      const allEvents = await eventService.getEvents();
      console.log("all events = ", allEvents);
      if (allEvents.length > 0) {
        util.setSuccess(200, "events retrieved", allEvents);
      } else {
        util.setSuccess(200, "No event found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addEvent(req, res) {
    const { error } = schema.validate(req.body);
    if (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
    const newEvent = req.body;
    try {
      const createdEvent = await eventService.addEvent(newEvent);
      util.setSuccess(201, "event added", createdEvent);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateEvent(req, res) {
    const alteredEvent = req.body;
    const { error } = schema.validate(alteredEvent);
    if (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
    const { id } = req.params;
    if (!Number(id)) {
      util.setError(400, "Please input a valid numeric value");
      return util.send(res);
    }
    try {
      const updatedEvent = await eventService.updateEvent(id, alteredEvent);
      if (!updatedEvent) {
        util.setError(404, `Cannot find event with the id: ${id}`);
      } else {
        util.setSuccess(200, "event updated", updatedEvent);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getEvent(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, "Please input a valid numeric value");
      return util.send(res);
    }

    try {
      const event = await eventService.getEvent(id);

      if (!event) {
        util.setError(404, `Cannot find event with the id ${id}`);
      } else {
        util.setSuccess(200, "Found event", event);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async deleteEvent(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, "Please provide a numeric value");
      return util.send(res);
    }

    try {
      const deletedEvent = await eventService.deleteEvent(id);

      if (deletedEvent) {
        util.setSuccess(200, "event deleted");
      } else {
        util.setError(404, `event with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default eventController;
