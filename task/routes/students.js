const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { isAuthenticated } = require('../middleware/auth');


router.use(isAuthenticated);


router.get('/', studentController.getAllStudents);

router.get('/create', studentController.showCreateForm);

router.post('/', studentController.createStudent);

router.get('/:id', studentController.getStudent);

router.get('/:id/edit', studentController.showEditForm);

router.put('/:id', studentController.updateStudent);
router.post('/:id/update', studentController.updateStudent);

router.delete('/:id', studentController.deleteStudent);
router.post('/:id/delete', studentController.deleteStudent);

module.exports = router;