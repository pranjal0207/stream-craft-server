import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const decoded = jwt.decode(token);

    req.body.id = decoded.id;
    req.body.type = decoded.type;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyTokenWithContinue = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      throw new Error("No token passed");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const decoded = jwt.decode(token);
    req.body.id = decoded.id;
    req.body.type = decoded.type;
    next();
  } catch (err) {
    req.body.id = null;
    next();
  }
};
