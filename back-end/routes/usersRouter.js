const express = require("express");
const router = express.Router();
const users = require('../controllers/usersController');
const auth = require('../middleware/authentication');

router.post('/', users.createUser);
router.get('/', users.selectAllUsers);
router.post('/login', users.login);
router.get('/:id', users.selectOneUser);
router.delete('/:id', auth, users.deleteOneUser);
router.put('/:id/updateProfil', users.updateAccount);

module.exports = router;