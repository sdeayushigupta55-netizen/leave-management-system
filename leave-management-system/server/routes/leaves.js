const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

router.get('/', leaveController.getAllLeaves);
router.post('/', leaveController.createLeave);
router.put('/:id', leaveController.updateLeave);
router.delete('/:id', leaveController.deleteLeave);

module.exports = router;