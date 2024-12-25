require("dotenv").config();
const { checkApiKey, verifyJwt } = require("../services/authService")
const Admins = require("../models/adminsModel")

// async function authenticateJwt(req, res, next) {
//     const token = req.cookies.jwt;
//     console.log(token);
//     if (token) {
//         const decoded = verifyJwt(token);
//         if (decoded.id) {
//             const admin = await Admins.findById(decoded.id.data.id);
//             if (admin) {
//                 req.admin = admin;
//                 return next();
//             }
//         }
//     }
//     return res.status(403).json({ error: 'Invalid jwt' });
// }

async function authenticateJwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: 'Authorization header missing or malformed' });
    }
    
    const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"
    try {
        const decoded = verifyJwt(token);
        if (decoded && decoded.id) {
            const admin = await Admins.findById(decoded.id.data.id);
            if (admin) {
                req.admin = admin;
                return next();
            }
        }
        return res.status(403).json({ error: 'Invalid JWT' });
    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(403).json({ error: 'Invalid JWT' });
    }
}

module.exports = {
    authenticateJwt,
}