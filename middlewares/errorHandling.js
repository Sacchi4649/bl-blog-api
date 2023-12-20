module.exports = (error, _, response, next) => {
  console.log(error);
  switch (error.name) {
    case "MongoServerError": {
      response.status(400).json({ message: error.message, error });
    }
    case "NotFoundError": {
      response.status(404).json({ message: error.message });
      break;
    }
    case "ConflictError": {
      response.status(409).json({ message: error.message });
      break;
    }
    case "BadRequestError": {
      response.status(400).json({ message: error.message });
    }
    case "JsonWebTokenError": {
      response.status(406).json({ message: error.message });
      break;
    }
    case "ForbiddenError": {
      response.status(403).json({ message: error.message });
      break;
    }
    case "UnauthorizedError": {
      response.status(401).json({ message: error.message });
      break;
    }
    case "ValidationError": {
      response.status(400).json({ message: error.message });
      break;
    }
    default: {
      response.status(500).json({ message: "Internal server error" });
    }
  }
};
