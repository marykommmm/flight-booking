const jwt = require("jsonwebtoken");

/**
 * Middleware для авторизації користувача.
 * Якщо передано `role`, перевіряє також роль користувача.
 *
 * @param {string} [role] - Опціонально. Якщо задано, перевіряє, чи має користувач відповідну роль.
 */
const authMiddleware = (role) => {
  return (req, res, next) => {
    console.log("Middleware invoked");
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("Authorization header missing");
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("Token missing");
      return res.status(401).json({ message: "Token missing" });
    }

    try {
      console.log("Verifying token...");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded:", decoded);
      if (role && decoded.role !== role) {
        console.log("Access denied due to role mismatch");
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.log("Token verification failed");
      return res.status(403).json({ message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
