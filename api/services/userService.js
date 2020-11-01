import database from "../../db/models";

class userService {
  static async getAllUsers() {
    try {
      return await database.user.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async addUser(newUser) {
    try {
      return await database.user.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id, updatedUser) {
    try {
      const userToUpdate = await database.user.findOne({
        where: { id: Number(id) },
      });

      if (userToUpdate) {
        await database.user.update(updatedUser, { where: { id: Number(id) } });

        return updatedUser;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getUser(id) {
    try {
      const user = await database.user.findOne({
        where: { id: Number(id) },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const userToDelete = await database.user.findOne({
        where: { id: Number(id) },
      });

      if (userToDelete) {
        const deletedUser = await database.user.destroy({
          where: { id: Number(id) },
        });
        return deletedUser;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default userService;
