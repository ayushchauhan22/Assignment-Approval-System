const jwt = require('jsonwebtoken');

function protect(req, res, next) {
    const token = req.cookies?.jwt;

    if (!token) {
        res.redirect('/');
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) return res.status(403).send("Invalid token");

        if (decoded.role !== "admin")
            return res.status(403).send("Access denied");

        next();
    });
}

module.exports = protect;
