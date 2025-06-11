const jwt = require("jsonwebtoken");

async function authToken(req, res, next) {
  try {
    const token = req.cookies?.token;
    console.log("Token received:", token); 

    if (!token) {
      return res.status(401).json({ message: "Please Login", error: true });
    }

    
    const [header, payload, signature] = token.split('.');

    
    const decodedHeader = Buffer.from(header, 'base64').toString('utf-8');
    const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');

    console.log("Decoded Header:", decodedHeader);  
    console.log("Decoded Payload:", decodedPayload); 

    
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or Expired Token!", error: true });
      }

      console.log("Decoded token after verification:", decoded);
      req.userId = decoded?._id;
      next();
    });

  } catch (err) {
    res.status(400).json({ message: err.message || "Token validation failed", error: true });
  }
}

module.exports = authToken;
