const prisma = require('../models');
const { Prisma } = require('@prisma/client');

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        Reports: true
      }
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

// Get a report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await prisma.report.findUnique({
      where: { Id_Report: req.params.id },
      include: {
        Reports: true
      }
    });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { Id_Reporter, Id_Reported, type, reason } = req.body;

    const newReport = await prisma.report.create({
      data: {
        Id_Reporter,
        Id_Reported,
        type,
        reason
      },
    });

    res.status(201).json(newReport); // Created
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' }); // Bad Request
    } else {
      res.status(500).json({ error: 'Failed to create report' });
    }
  }
};

// Update a report by ID
exports.updateReport = async (req, res) => {
  try {
    const { Id_Reporter, Id_Reported, type, reason } = req.body;

    // Check if the report exists
    const report = await prisma.report.findUnique({
      where: { Id_Report: req.params.id },
    });
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const updatedReport = await prisma.report.update({
      where: { Id_Report: req.params.id },
      data: {
        Id_Reporter,
        Id_Reported,
        type,
        reason
      },
    });

    res.status(200).json(updatedReport); // OK
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update report' });
    }
  }
};

// Delete a report by ID
exports.deleteReport = async (req, res) => {
  try {
    // Check if the report exists before attempting to delete
    const report = await prisma.report.findUnique({
      where: { Id_Report: req.params.id },
    });
    if (!report) return res.status(404).json({ message: 'Report not found' });

    await prisma.report.delete({
      where: { Id_Report: req.params.id },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete report' });
  }
};
