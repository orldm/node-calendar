import database from "../../db/models";

class eventService {
  static async getEvents() {
    try {
      return await database.event.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async addEvent(newEvent) {
    try {
      return await database.event.create(newEvent);
    } catch (error) {
      throw error;
    }
  }

  static async updateEvent(id, updatedEvent) {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  static async getEvent(id) {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  static async deleteEvent(id) {
    try {
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
    } catch (error) {
      throw error;
    }
  }
}

export default eventService;
