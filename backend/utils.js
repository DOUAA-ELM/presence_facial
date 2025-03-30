import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  console.log('Authorization Header:', authorization); // Log the authorization header
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    console.log('Token:', token); // Log the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        console.error('Token Verification Error:', err); // Log any verification errors
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        console.log('Decoded User:', decode); // Log the decoded user
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

export const isAdmin = (req, res, next) => {
  console.log('User in isAdmin:', req.user); // Log the user object
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

// Check if JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined');
}
