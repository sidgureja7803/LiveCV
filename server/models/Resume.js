const mongoose = require('mongoose');

// Define the schema for resume files
const resumeFileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  fileId: { type: String, required: true },  // Appwrite file ID
  fileName: { type: String, required: true },
  fileSize: { type: Number },
  fileType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  // Legacy field for backward compatibility
  publicId: { type: String }
});

// Define the schema for education items
const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  location: { type: String },
  description: { type: String },
  gpa: { type: String }
});

// Define the schema for work experience items
const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  location: { type: String },
  description: { type: String },
  highlights: [{ type: String }]
});

// Define the schema for skills
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
  category: { type: String }
});

// Define the schema for projects
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String },
  github: { type: String },
  technologies: [{ type: String }],
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  highlights: [{ type: String }]
});

// Define the schema for certifications
const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: Date },
  url: { type: String },
  validUntil: { type: Date }
});

// Define the schema for languages
const languageSchema = new mongoose.Schema({
  language: { type: String, required: true },
  proficiency: { type: String, enum: ['elementary', 'limited', 'professional', 'full', 'native'] }
});

// Define the schema for awards
const awardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String },
  date: { type: Date },
  description: { type: String }
});

// Define the schema for interests/hobbies
const interestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  keywords: [{ type: String }]
});

// Define the schema for the main resume document
const resumeSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  templateId: { type: String, required: true, default: 'modern' },
  isPublic: { type: Boolean, default: false },
  basics: {
    name: { type: String, required: true },
    label: { type: String },
    email: { type: String },
    phone: { type: String },
    website: { type: String },
    location: {
      address: { type: String },
      postalCode: { type: String },
      city: { type: String },
      region: { type: String },
      country: { type: String }
    },
    profiles: [{
      network: { type: String },
      username: { type: String },
      url: { type: String }
    }],
    summary: { type: String }
  },
  work: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  projects: [projectSchema],
  certifications: [certificationSchema],
  languages: [languageSchema],
  awards: [awardSchema],
  interests: [interestSchema],
  customSections: [{
    title: { type: String, required: true },
    items: [{
      name: { type: String },
      description: { type: String },
      date: { type: Date },
      details: [{ type: String }]
    }]
  }],
  resumeFile: resumeFileSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create and export the Resume model
const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
