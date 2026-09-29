const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all fields: name, email, and password' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }
  next();
};

const validatePost = (req, res, next) => {
  const { content, platforms } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Post content cannot be empty' });
  }
  if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
    return res.status(400).json({ message: 'Post must target at least one platform' });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validatePost,
};
