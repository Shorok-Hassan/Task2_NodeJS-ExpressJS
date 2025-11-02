const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 16,
    max: 100
  },
  major: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4,
    default: 0
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


studentSchema.index({ firstName: 'text', lastName: 'text', major: 'text' });
studentSchema.index({ studentId: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ major: 1 });


studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});


studentSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Student', studentSchema);