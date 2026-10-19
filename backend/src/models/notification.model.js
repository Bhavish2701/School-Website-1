/**
 * Notification Model (Announcements, Alerts, Parent Messages)
 */
const mongoose = require('mongoose');

const NOTIFICATION_TYPES = [
  'ANNOUNCEMENT',
  'ALERT',
  'LEAVE_STATUS',
  'CLASS_UPDATE',
  'PARENT_MESSAGE',
];

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      default: 'ANNOUNCEMENT',
    },
    // Null if sent to whole role (broadcast)
    recipientUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    recipientRole: {
      type: String,
      default: 'TEACHER',
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    senderUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = {
  Notification,
  NOTIFICATION_TYPES,
};
