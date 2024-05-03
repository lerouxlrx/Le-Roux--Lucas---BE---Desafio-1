const passport = require('passport');

function authMiddleware(req, res, next) {
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
        if (error) {
            return next(error);
        }
        if (!user) {
            req.user = null;
        } else {
            req.user = user;
        }
        next();
    })(req, res, next);
}


module.exports = authMiddleware;