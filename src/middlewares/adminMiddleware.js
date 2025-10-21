export const adminOnly = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};
