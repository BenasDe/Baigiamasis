import jwt from "jsonwebtoken";// for creating tokens
// next allows function to continue
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
//token not find 
    if (!token) {
      return res.status(403).send("Access Denied");
    }
//token starts with Bearer set in front end
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
// using env secret to verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
