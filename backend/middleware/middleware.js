// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "Access Token required" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(403).json({ message: "Invalid or expired Access Token" });
//   }
// };


// New version to check token from cookies instead of headers
// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   // Try to get token from Authorization header first
//   let token = null;
//   const authHeader = req.headers["authorization"];
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     token = authHeader.split(" ")[1];
//   }

//   // Fallback to cookie
//   if (!token && req.cookies?.accessToken) {
//     token = req.cookies.accessToken;
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Access Token required" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired Access Token" });
//   }
// };

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("🔐 Authorization:", authHeader);
  console.log("🍪 Cookies:", req.cookies);

  let token = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ message: "Access Token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired Access Token" });
  }
};

