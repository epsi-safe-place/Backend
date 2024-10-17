const prisma = require('../models');
const { Prisma } = require('@prisma/client');

// Get all user-report associations (Reports)
exports.getAllReportsAssociations = async (req, res) => {
  try {
    const reports = await prisma.reports.findMany({
      include: {
        user: true,
        report: true
      }
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report associations' });
  }
};

// Get a specific user-report association by User and Report IDs
exports.getReportAssociationById = async (req, res) => {
  try {
    const reportAssociation = await prisma.reports.findUnique({
      where: { Id_User_Id_Report: { Id_User: req.params.id_user, Id_Report: req.params.id_report } },
      include: {
        user: true,
        report: true
      }
    });
    if (!reportAssociation) return res.status(404).json({ message: 'Report association not found' });
    res.status(200).json(reportAssociation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report association' });
  }
};

// Create a new user-report association
exports.createReportAssociation = async (req, res) => {
  try {
    const { Id_User, Id_Report } = req.body;

    const newReportAssociation = await prisma.reports.create({
      data: {
        Id_User,
        Id_Report
      },
    });

    res.status(201).json(newReportAssociation); // Created
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' }); // Bad Request
    } else {
      res.status(500).json({ error: 'Failed to create report association' });
    }
  }
};

// Update a user-report association by User and Report IDs
exports.updateReportAssociation = async (req, res) => {
  try {
    const { Id_User, Id_Report } = req.body;

    // Check if the association exists
    const reportAssociation = await prisma.reports.findUnique({
      where: { Id_User_Id_Report: { Id_User: req.params.id_user, Id_Report: req.params.id_report } },
    });
    if (!reportAssociation) return res.status(404).json({ message: 'Report association not found' });

    const updatedReportAssociation = await prisma.reports.update({
      where: { Id_User_Id_Report: { Id_User: req.params.id_user, Id_Report: req.params.id_report } },
      data: {
        Id_User,
        Id_Report
      },
    });

    res.status(200).json(updatedReportAssociation); // OK
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update report association' });
    }
  }
};

// Delete a user-report association by User and Report IDs
exports.deleteReportAssociation = async (req, res) => {
  try {
    // Check if the association exists before attempting to delete
    const reportAssociation = await prisma.reports.findUnique({
      where: { Id_User_Id_Report: { Id_User: req.params.id_user, Id_Report: req.params.id_report } },
    });
    if (!reportAssociation) return res.status(404).json({ message: 'Report association not found' });

    await prisma.reports.delete({
      where: { Id_User_Id_Report: { Id_User: req.params.id_user, Id_Report: req.params.id_report } },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete report association' });
  }
};
