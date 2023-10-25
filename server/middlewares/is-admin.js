exports.isAdmin = (req, res, next) => {
  const admin = req.headers.authorization;
  req.store.get(admin, (error, session) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = session.user;
    next();
  });
};
