import Joi from "joi";
import eventService from "../services/eventService";
import HTTPUtil from "../httpUtil";

const schema = Joi.object({
  title: Joi.string().alphanum().max(30).required(),
  location: Joi.string().alphanum().max(30).required(),
  date: Joi.date().required(),
  hour: Joi.string().pattern(new RegExp("^[0-9][0-9]:[0-9][0-9]$")).required(),
  userId: Joi.number().required(),
  participantsIds: Joi.array().items(Joi.number()).required(),
});

const httpUtil = new HTTPUtil();

class eventController {
  static async getEvents(req, res) {
    try {
      const allEvents = await eventService.getEvents(req.query.location);
      if (allEvents.length > 0) {
        httpUtil.setSuccess(200, "events retrieved", allEvents);
      } else {
        httpUtil.setSuccess(200, "No event found");
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error);
      return httpUtil.send(res);
    }
  }

  static async addEvent(req, res) {
    const { error } = schema.validate(req.body);
    if (error) {
      httpUtil.setError(400, error.message);
      return httpUtil.send(res);
    }
    const newEvent = req.body;
    try {
      const createdEvent = await eventService.addEvent(newEvent);
      httpUtil.setSuccess(201, "event added", createdEvent);
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error.message);
      return httpUtil.send(res);
    }
  }

  static async updateEvent(req, res) {
    const alteredEvent = req.body;
    const { error } = schema.validate(alteredEvent);
    if (error) {
      httpUtil.setError(400, error.message);
      return httpUtil.send(res);
    }
    const { id } = req.params;
    if (!Number(id)) {
      httpUtil.setError(400, "Please input a valid numeric value");
      return httpUtil.send(res);
    }
    try {
      const updatedEvent = await eventService.updateEvent(id, alteredEvent);
      if (!updatedEvent) {
        httpUtil.setError(404, `Cannot find event with the id: ${id}`);
      } else {
        httpUtil.setSuccess(200, "event updated", updatedEvent);
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(404, error);
      return httpUtil.send(res);
    }
  }

  static async getEvent(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      httpUtil.setError(400, "Please input a valid numeric value");
      return httpUtil.send(res);
    }

    try {
      const event = await eventService.getEvent(id);

      if (!event) {
        httpUtil.setError(404, `Cannot find event with the id ${id}`);
      } else {
        httpUtil.setSuccess(200, "Found event", event);
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(404, error);
      return httpUtil.send(res);
    }
  }

  static async deleteEvent(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      httpUtil.setError(400, "Please provide a numeric value");
      return httpUtil.send(res);
    }

    try {
      const deletedEvent = await eventService.deleteEvent(id);

      if (deletedEvent) {
        httpUtil.setSuccess(200, "event deleted");
      } else {
        httpUtil.setError(404, `event with the id ${id} cannot be found`);
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error);
      return httpUtil.send(res);
    }
  }
}

export default eventController;
