module.exports = async (request, _, next) => {
  const { verifyToken } = require("../utils/jwtHandler");
  const userModel = require("../models/userSchema");
  try {
    if (!request.headers.authorization) {
      throw { name: "UnauthorizedError", message: "Please login first!" };
    }

    const token = request.headers.authorization.replace("Bearer ", "");
    const userToken = verifyToken(token);
    const findUser = await userModel.findOne({ _id: userToken.id });
    const { _id, username } = findUser;
    if (userToken.id == _id) {
      request.userId = _id; //request creates new object named userId which contains _id
      request.username = username;
      next();
    } else {
      next({ name: "UnauthorizedError", message: "Please login first!" });
    }
  } catch (error) {
    next(error);
  }
};
