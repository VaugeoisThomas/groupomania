const Users = require('../models/users');
const bdd = require('../models/dbConnect');
const password_schema = require("../middleware/password-validator");
const errManagement = require("../middleware/error-management");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const MaskData = require('maskdata');

exports.createUser = (req, res) => {
    if (password_schema.validate(req.body.users_password)) {
        if (req.body.users_email) {
            const maskedEmail = MaskData.maskEmail2(req.body.users_email);
            bdd.query(Users.selectUsersByEmail(), req.body.users_email, (err, result) => {
                if (err) {
                    return res.status(400).json(errManagement.error(error.message))
                } else if (result[0] != undefined) {
                    return res.status(401).json(errManagement.error("Cet email est déjà utilisé par un autre membre !"));
                } else {
                    bcrypt.hash(req.body.users_password, 10)
                        .then(hash => {
                            let passwordHashed = hash;
                            bdd.query(Users.creationUser(),
                                [
                                    maskedEmail,
                                    passwordHashed,
                                    req.body.users_name,
                                ], (err) => {
                                    if (err) {
                                        return res.status(401).json(errManagement.error(err.message));
                                    } else {
                                        bdd.query(Users.selectUsersByEmail(), maskedEmail, (err, result) => {
                                            if (err) {
                                                return res.status(500).json(errManagement.error(err.message))
                                            } else {
                                                return res.status(201).json({
                                                    userId: result[0].users_id,
                                                    token: jwt.sign(
                                                        { userId: result[0].users_id },
                                                        process.env.TOKEN,
                                                        { expiresIn: process.env.TOKEN_EXPIRES_IN }
                                                    ),
                                                    isAdmin: result[0].isAdmin
                                                });
                                            }
                                        })

                                    }
                                });
                        })
                        .catch(error => res.status(500).json(errManagement.error(error)))
                }
            })
        } else {
            return res.status(422).json(errManagement.error("Veuillez saisir votre adresse Email !"));
        }
    } else {
        return res.status(404).json(errManagement.error("Votre mot de passe n'est pas valide !"))
    }
};

exports.login = (req, res) => {
    if (req.body.users_email) {
        const maskedEmail = MaskData.maskEmail2(req.body.users_email);
        bdd.query(Users.selectUsersByEmail(), maskedEmail, (err, result) => {
            if (err) {
                return res.status(401).json(errManagement.error(err.message));
            } else {
                if (maskedEmail === result[0].users_email) {
                    if (!req.body.users_password || !bcrypt.compareSync(req.body.users_password, result[0].users_password)) {
                        return res.status(401).json(errManagement.error("Mot de passe incorrect"));
                    } else {
                        return res.status(200).json({
                            isAdmin: result[0].isAdmin,
                            userId: result[0].users_id,
                            token: jwt.sign(
                                { userId: result[0].users_id },
                                process.env.TOKEN,
                                { expiresIn: process.env.TOKEN_EXPIRES_IN }
                            ),
                        });
                    }
                } else {
                    return res.status(401).json(errManagement.error("Votre email est incorrect"));
                }
            }
        });
    } else {
        return res.status(401).json(errManagement.error("Saississez votre adresse E-mail"));
    }
};

exports.selectAllUsers = (req, res) => {
    bdd.query(Users.selectAllUsers(), (error, result) => {
        if (error) {
            throw error;
        } else {
            return res.status(201).json(result)
        }
    });
};

exports.selectOneUser = (req, res) => {
    bdd.query(Users.selectUsersById(), [req.params.id], (err, result) => {
        if (err) {
            throw err;
        } else {
            if (result[0] != undefined) {
                return res.status(200).json(result[0]);
            } else {
                return res.status(404).json(errManagement.error("Utilisateur introuvable"));
            }
        }
    })
};

exports.deleteOneUser = (req, res) => {
    bdd.query(Users.selectUsersById(), req.params.id, (err, result) => {
        if (err) {
            throw err;
        } else {
            if (result[0] != undefined) {
                if (req.params.id == result[0].users_id) {
                    bdd.query(Users.deleteUsers(), req.params.id, (err, result) => {
                        if (err) {
                            throw err;
                        } else {
                            return res.status(200).json(errManagement.success(result));
                        }
                    });
                } else {
                    return res.status(403).json(errManagement.error("Vous ne pouvez pas supprimer cet utilisateur"));
                }
            } else {
                return res.status(404).json(errManagement.error("Utilisateur non reconnu"));
            }
        }
    })
};

exports.updateAccount = (req, res) => {
    if (password_schema.validate(req.body.users_password)) {
        bdd.query(Users.selectUsersById(), req.params.id, (err, result) => {
            if (err) {
                res.status(404).json(errManagement.error(err.message))
            } else {
                if (result[0] != undefined) {
                    if (req.body.users_email) {
                        const maskedEmail = MaskData.maskEmail2(req.body.users_email);
                        bdd.query(Users.selectUsersByEmail(), req.body.users_email, (err, result) => {
                            if (err) {
                                return res.status(400).json(errManagement.error(error.message))
                            } else if (result[0] != undefined) {
                                return res.status(401).json(errManagement.error("Cet email est déjà utilisé par un autre membre !"));
                            } else {
                                bcrypt.hash(req.body.users_password, 10)
                                    .then(hash => {
                                        let passwordHashed = hash;
                                        bdd.query(Users.updateData(),
                                            [
                                                req.body.users_name,
                                                passwordHashed,
                                                maskedEmail,
                                                req.params.id,
                                            ], (err) => {
                                                if (err) {
                                                    return res.status(401).json(errManagement.error(err.message));
                                                } else {
                                                    bdd.query(Users.selectUsersByEmail(), maskedEmail, (err, result) => {
                                                        if (err) {
                                                            return res.status(500).json(errManagement.error(err.message))
                                                        } else {
                                                            return res.status(201).json({
                                                                userId: result[0].users_id,
                                                                token: jwt.sign(
                                                                    { userId: result[0].users_id },
                                                                    process.env.TOKEN,
                                                                    { expiresIn: process.env.TOKEN_EXPIRES_IN }
                                                                ),
                                                                isAdmin: result[0].isAdmin
                                                            });
                                                        }
                                                    })

                                                }
                                            });
                                    })
                                    .catch(error => res.status(500).json(errManagement.error(error)))
                            }
                        })
                    } else {
                        return res.status(404).json(errManagement.error("Veuillez saisir votre adresse Email !"));
                    }
                }
            }
        })
    }
}