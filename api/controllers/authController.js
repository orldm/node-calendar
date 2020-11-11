import jwt from "jsonwebtoken";
import tokenService from "../services/tokenService";
import HTTPUtil from "../httpUtil";
import { hash } from "../util";

const httpUtil = new HTTPUtil();
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFE,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_LIFE,
} = process.env;

class authController {
  static async login(req, res) {
    try {
      const accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_LIFE,
      });
      const refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_LIFE,
      });
      const accessTokenId = hash(accessToken);
      await tokenService.addToken({ refreshToken, accessTokenId });
      httpUtil.setSuccess(201, "tokens generated", {
        accessToken,
        refreshToken,
      });
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error.message);
      return httpUtil.send(res);
    }
  }

  static async refreshTokens(req, res) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        httpUtil.setError(403, "not authorized");
        return httpUtil.send(res);
      }
      const token = authorization.split(" ")[1];
      const oldAccessTokenId = hash(token);

      const accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_LIFE,
      });
      const refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_LIFE,
      });
      const newAccessTokenId = hash(accessToken);
      await tokenService.refreshTokens(
        oldAccessTokenId,
        newAccessTokenId,
        refreshToken
      );
      httpUtil.setSuccess(201, "tokens refreshed", {
        accessToken,
        refreshToken,
      });
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error.message);
      return httpUtil.send(res);
    }
  }

  static async checkAccess(req, res) {
    httpUtil.setSuccess(200, "access granted");
    return httpUtil.send(res);
  }
}

export default authController;
