const jwt = require('jsonwebtoken');

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.teccomerceCookieToken;

    if (token) {
        jwt.verify(token, 'teccomerce', (error, decoded) => {
            if (error) {
                res.status(403).send('Token incorrecto. No puedes acceder.');
            } else {
                const userRole = decoded.user.role;
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    res.status(403).send('No tenes permiso para acceder a esta sección');
                }
            }
        });
    } else {
        res.status(403).send('Sin Token para validar permisos.');
    }
};

module.exports = checkUserRole;