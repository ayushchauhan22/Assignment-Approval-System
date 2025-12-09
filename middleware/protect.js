const jwt = require('jsonwebtoken');

function protect(req, res, next) {
    const token = req.cookies?.jwt;

    if (!token) {
        res.redirect('/auth/login');
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) return res.send("Invalid token");

        if (decoded.role !== "admin")
            return res.status(403).send("You are not allowed to acces this route");

        req.user = decoded;
        next();
    });
}

function authProtect(allowedRoles = []) {
    return (req, res, next) => {
        const token = req.cookies?.jwt;

        if (!token) {
            return res.redirect("/auth/login");
        }

        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) return res.send("Invalid token");

            if (allowedRoles.length === 0) {
                req.user = decoded;
                return next();
            }

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).send("You are not allowed to access this route");
            }

            req.user = decoded;
            // console.log(req.user);
            
            next();
        });
    };
}

module.exports = {
    protect,
    authProtect
};
