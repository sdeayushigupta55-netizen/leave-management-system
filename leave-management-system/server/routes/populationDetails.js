const express = require('express');
const router = express.Router();
const populationDetailsController = require('../controllers/populationDetailsController');

router.get('/', populationDetailsController.getAllPopulationDetails);
router.post('/', populationDetailsController.createPopulationDetails);
router.put('/:id', populationDetailsController.updatePopulationDetails);
// router.delete('/:id', populationDetailsController.deletePopulationDetails);
router.get('/religions', populationDetailsController.getAllReligions);
router.get('/sub-castes', populationDetailsController.getAllSubCastes);

module.exports = router;