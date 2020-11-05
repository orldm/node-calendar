import database from "../../db/models";

class eventService {
  static async getEvents(location) {
    const clause = location ? { where: { location } } : {};
    return await database.event.findAll(clause);
  }

  static async addEvent(newEvent) {
    return await database.event.create(newEvent);
  }

  static async updateEvent(id, updatedEvent) {
    const eventToUpdate = await database.event.findOne({
      where: { id: Number(id) },
    });

    if (eventToUpdate) {
      await database.event.update(updatedEvent, {
        where: { id: Number(id) },
      });

      return updatedEvent;
    }
    return null;
  }

  static async getEvent(id) {
    const event = await database.event.findOne({
      where: { id: Number(id) },
    });

    const users = await database.user.findAll({
      where: {
        id: event.participantsIds,
      },
    });

    const participants = users.map(({ firstName, lastName, email }) => ({
      firstName,
      lastName,
      email,
    }));

    const { participantsIds, ...newEvent } = event.dataValues;

    return { ...newEvent, participants };
  }

  static async deleteEvent(id) {
    const eventToDelete = await database.event.findOne({
      where: { id: Number(id) },
    });

    if (eventToDelete) {
      const deletedEvent = await database.event.destroy({
        where: { id: Number(id) },
      });
      return deletedEvent;
    }
    return null;
  }
}

export default eventService;
