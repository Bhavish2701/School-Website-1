/**
 * Parent Module Request Validators
 */
const validate = require('../middleware/validate.middleware');

const validateUpdateProfile = validate({
  phone: { minLength: 10, label: 'Contact Phone' },
  address: { minLength: 5, label: 'Residential Address' },
});

const validateChildLeave = validate({
  startDate: { required: true, label: 'Leave Start Date' },
  endDate: { required: true, label: 'Leave End Date' },
  reason: { required: true, minLength: 5, label: 'Reason for Child Leave' },
});

const validateParentMessage = validate({
  recipient: { required: true, label: 'Recipient Teacher ID' },
  subject: { required: true, minLength: 3, label: 'Subject' },
  body: { required: true, minLength: 5, label: 'Message Body' },
});

module.exports = {
  validateUpdateProfile,
  validateChildLeave,
  validateParentMessage,
};
