const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;

        if(req.body.userId && req.body.userId !== userId) throw "L'id de l'utilisateur n'est pas reconnu";
        else next();
    }  catch {
        res.status(401).json({error: new Error('Requête invalide')});
    }
}