import jwt from "jsonwebtoken";

const domain =
  process.env.NODE_ENV === "production"
    ? `.tmv-movies-server.onrender.com`
    : "localhost";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    domain,
    signed: true,
    path: "/",
    secure: true,
    sameSite: "None",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
