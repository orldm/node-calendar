import Joi from "joi";
import userService from "../services/userService";
import Util from "../util";

const schema = Joi.object({
  firstName: Joi.string().alphanum().max(30).required(),
  lastName: Joi.string().alphanum().max(30).required(),
  email: Joi.string().email().required(),
});

const util = new Util();

class userController {
  static async getUsers(req, res) {
    try {
      const allUsers = await userService.getAllUsers();
      if (allUsers.length > 0) {
        util.setSuccess(200, "users retrieved", allUsers);
      } else {
        util.setSuccess(200, "No user found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addUser(req, res) {
    const { error } = schema.validate(req.body);
    if (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
    const newUser = req.body;
    try {
      const createdUser = await userService.addUser(newUser);
      util.setSuccess(201, "user added", createdUser);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateUser(req, res) {
    const alteredUser = req.body;
    const { error } = schema.validate(alteredUser);
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
      const updatedUser = await userService.updateUser(id, alteredUser);
      if (!updatedUser) {
        util.setError(404, `Cannot find user with the id: ${id}`);
      } else {
        util.setSuccess(200, "user updated", updatedUser);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getUser(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, "Please input a valid numeric value");
      return util.send(res);
    }

    try {
      const user = await userService.getUser(id);

      if (!user) {
        util.setError(404, `Cannot find user with the id ${id}`);
      } else {
        util.setSuccess(200, "found user", user);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, "Please provide a numeric value");
      return util.send(res);
    }

    try {
      const deletedUser = await userService.deleteUser(id);

      if (deletedUser) {
        util.setSuccess(200, "user deleted");
      } else {
        util.setError(404, `user with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default userController;
