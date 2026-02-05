import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const secret = process.env.JWT_SECRET || "default_secret_key";
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log(`[Auth] Token expired for a request to ${req.url}`);
            return res.status(401).json({ 
                error: "Token expired", 
                code: "TOKEN_EXPIRED",
                expiredAt: error.expiredAt 
            });
        }
        console.error("Auth middleware error:", error);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};
