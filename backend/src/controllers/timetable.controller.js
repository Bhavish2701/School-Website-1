/**
 * Timetable Controller
 * REST handlers for timetable inspection, conflict validation, and assignments.
 */
const timetableService = require('../services/timetable.service');
const { formatSuccess, formatError } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getClassTimetable = asyncHandler(async (req, res) => {
  const { className } = req.params;
  const { academicYear } = req.query;

  const timetable = await timetableService.getClassTimetable(className, academicYear);

  return res.status(200).json(
    formatSuccess({
      className,
      totalPeriods: timetable.length,
      schedule: timetable,
    }, `Retrieved timetable for ${className}`)
  );
});

const validateConflict = asyncHandler(async (req, res) => {
  const result = await timetableService.checkConflict(req.body);

  if (result.hasConflict) {
    return res.status(409).json(
      formatError(result.message, 409, { conflict: result })
    );
  }

  return res.status(200).json(
    formatSuccess({ hasConflict: false }, 'No scheduling conflict detected. Allocation is valid.')
  );
});

const assignPeriod = asyncHandler(async (req, res) => {
  const assignment = await timetableService.assignPeriod(req.body);

  return res.status(201).json(
    formatSuccess(assignment, 'Timetable period successfully assigned.')
  );
});

module.exports = {
  getClassTimetable,
  validateConflict,
  assignPeriod,
};
