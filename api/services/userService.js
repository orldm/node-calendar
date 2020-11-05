import database from "../../db/models";

class userService {
  static async getAllUsers() {
    return await database.user.findAll();
  }

  static async addUser(newUser) {
    return await database.user.create(newUser);
  }

  static async updateUser(id, updatedUser) {
    const userToUpdate = await database.user.findOne({
      where: { id: Number(id) },
    });

    if (userToUpdate) {
      await database.user.update(updatedUser, { where: { id: Number(id) } });
      return updatedUser;
    }
    return null;
  }

  static async getUser(id) {
    const user = await database.user.findOne({
      where: { id: Number(id) },
    });
    return user;
  }

  static async deleteUser(id) {
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
  }
}

export default userService;
