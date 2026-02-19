const express = require('express');
const router = express.Router();
const beatBookController = require('../controllers/beatBookController');

router.get('/', beatBookController.getAllBeatBooks);
router.get('/:id', beatBookController.getBeatBookById);
router.post('/', beatBookController.createBeatBook);
router.put('/:id', beatBookController.updateBeatBook);
// router.delete('/:id', beatBookController.deleteBeatBook);

module.exports = router;