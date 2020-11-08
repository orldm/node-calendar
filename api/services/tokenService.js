import { Op } from "sequelize";
import database from "../../db/models";

class tokenService {
  static async addToken(newToken) {
    return await database.token.create(newToken);
  }

  static async updateToken(oldAccessTokenId, newAccessTokenId) {
    await database.token.update(
      { accessTokenId: newAccessTokenId },
      { where: { accessTokenId: String(oldAccessTokenId) } }
    );
  }

  static async getRefreshToken(accessTokenId) {
    const token = await database.token.findOne({
      where: { accessTokenId: String(accessTokenId) },
    });
    return token ? token.dataValues.refreshToken : null;
  }

  static async refreshTokens(
    oldAccessTokenId,
    newAccessTokenId,
    newRefreshToken
  ) {
    await database.token.update(
      {
        accessTokenId: newAccessTokenId,
        refreshToken: newRefreshToken,
      },
      { where: { accessTokenId: String(oldAccessTokenId) } }
    );
  }

  static async deleteExpired() {
    await database.token.destroy({
      where: {
        updatedAt: {
          [Op.lt]: new Date(new Date() - process.env.ACCESS_TOKEN_LIFE),
        },
      },
    });
  }
}

export default tokenService;
