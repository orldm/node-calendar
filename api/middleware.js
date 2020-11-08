import jwt from "jsonwebtoken";
import tokenService from "./services/tokenService";
import HTTPUtil from "./httpUtil";
import { hash } from "./util";

const httpUtil = new HTTPUtil();
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFE,
  REFRESH_TOKEN_SECRET,
} = process.env;

const verify = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      httpUtil.setError(403, "not authorized");
      return httpUtil.send(res);
    }
    const token = authorization.split(" ")[1];
    const oldAccessTokenId = hash(token);
    jwt.verify(token, ACCESS_TOKEN_SECRET);
    const refreshToken = await tokenService.getRefreshToken(oldAccessTokenId);
    if (!refreshToken) {
      httpUtil.setError(403, "not authorized");
      return httpUtil.send(res);
    }
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_LIFE,
    });
    const newAccessTokenId = hash(newAccessToken);
    await tokenService.updateToken(oldAccessTokenId, newAccessTokenId);
    res.setHeader("authorization", newAccessToken);
    return next();
  } catch (err) {
    await tokenService.deleteExpired();
    httpUtil.setError(401, err.message);
    return httpUtil.send(res);
  }
};

export default verify;
