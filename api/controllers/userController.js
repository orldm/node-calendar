import Joi from "joi";
import userService from "../services/userService";
import HTTPUtil from "../httpUtil";

const schema = Joi.object({
  firstName: Joi.string().alphanum().max(30).required(),
  lastName: Joi.string().alphanum().max(30).required(),
  email: Joi.string().email().required(),
});

const httpUtil = new HTTPUtil();

class userController {
  static async getUsers(req, res) {
    try {
      const allUsers = await userService.getAllUsers();
      if (allUsers.length > 0) {
        httpUtil.setSuccess(200, "users retrieved", allUsers);
      } else {
        httpUtil.setSuccess(200, "No user found");
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error);
      return httpUtil.send(res);
    }
  }

  static async addUser(req, res) {
    const { error } = schema.validate(req.body);
    if (error) {
      httpUtil.setError(400, error.message);
      return httpUtil.send(res);
    }
    const newUser = req.body;
    try {
      const createdUser = await userService.addUser(newUser);
      httpUtil.setSuccess(201, "user added", createdUser);
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error.message);
      return httpUtil.send(res);
    }
  }

  static async updateUser(req, res) {
    const alteredUser = req.body;
    const { error } = schema.validate(alteredUser);
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
      const updatedUser = await userService.updateUser(id, alteredUser);
      if (!updatedUser) {
        httpUtil.setError(404, `Cannot find user with the id: ${id}`);
      } else {
        httpUtil.setSuccess(200, "user updated", updatedUser);
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(404, error);
      return httpUtil.send(res);
    }
  }

  static async getUser(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      httpUtil.setError(400, "Please input a valid numeric value");
      return httpUtil.send(res);
    }

    try {
      const user = await userService.getUser(id);

      if (!user) {
        httpUtil.setError(404, `Cannot find user with the id ${id}`);
      } else {
        httpUtil.setSuccess(200, "found user", user);
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(404, error);
      return httpUtil.send(res);
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      httpUtil.setError(400, "Please provide a numeric value");
      return httpUtil.send(res);
    }

    try {
      const deletedUser = await userService.deleteUser(id);

      if (deletedUser) {
        httpUtil.setSuccess(200, "user deleted");
      } else {
        httpUtil.setError(404, `user with the id ${id} cannot be found`);
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error);
      return httpUtil.send(res);
    }
  }
}

export default userController;
