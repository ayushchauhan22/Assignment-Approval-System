const jwt = require('jsonwebtoken');

function protect(req, res, next) {
    const token = req.cookies?.jwt;

    if (!token) {
        res.redirect('/auth/login');
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) return res.status(403).send("Invalid token");

        if (decoded.role !== "admin")
            return res.status(403).send("You are not allowed to acces this route");

        next();
    });
}

module.exports = protect;
