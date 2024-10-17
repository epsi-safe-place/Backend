const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports_associations.controllers');

// CRUD routes for Report associations
router.get('/', reportsController.getAllReportsAssociations);
router.get('/:id_user/:id_report', reportsController.getReportAssociationById);
router.post('/', reportsController.createReportAssociation);
router.put('/:id_user/:id_report', reportsController.updateReportAssociation);
router.delete('/:id_user/:id_report', reportsController.deleteReportAssociation);

module.exports = router;
