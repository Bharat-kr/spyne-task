const express = require('express');
const middlewares = require('../../middlewares');
const { userController } = require('../../controllers/v1/user');

const router = express.Router();

// READ
router.get('/', middlewares.authToken, userController.getUser);
router.get('/all', middlewares.authToken, userController.getAllUsers);
router.get('/search', middlewares.authToken, userController.searchUser);

// UPDATE
router.patch('/update', middlewares.authToken, userController.updateUser);
router.delete('/delete', middlewares.authToken, userController.deleteUser);
router.post('/follow', middlewares.authToken, userController.followUser);

module.exports = router;
