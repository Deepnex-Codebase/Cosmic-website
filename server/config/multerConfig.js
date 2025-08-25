const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directories if they don't exist
const directorUploadDir = path.join(__dirname, '../uploads/directors');
const teamUploadDir = path.join(__dirname, '../uploads/team');
const aboutUploadDir = path.join(__dirname, '../uploads/about');
const productUploadDir = path.join(__dirname, '../uploads/products');
const footerUploadDir = path.join(__dirname, '../uploads/footer');
const videosUploadDir = path.join(__dirname, '../uploads/videos');

if (!fs.existsSync(directorUploadDir)) {
  fs.mkdirSync(directorUploadDir, { recursive: true });
}

if (!fs.existsSync(teamUploadDir)) {
  fs.mkdirSync(teamUploadDir, { recursive: true });
}

if (!fs.existsSync(aboutUploadDir)) {
  fs.mkdirSync(aboutUploadDir, { recursive: true });
}

if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

if (!fs.existsSync(footerUploadDir)) {
  fs.mkdirSync(footerUploadDir, { recursive: true });
}

if (!fs.existsSync(videosUploadDir)) {
  fs.mkdirSync(videosUploadDir, { recursive: true });
}

// Configure storage for directors
const directorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directorUploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'director-' + uniqueSuffix + ext);
  }
});

// Configure storage for team members
const teamStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, teamUploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'team-' + uniqueSuffix + ext);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instances
const directorUpload = multer({
  storage: directorStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter
});

const teamUpload = multer({
  storage: teamStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter
});

// Configure storage for about page
const aboutStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, aboutUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Create multer upload instance for about page
const aboutUpload = multer({
  storage: aboutStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

// Configure storage for videos
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, videosUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to accept only videos
const videoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

// Create multer upload instance for videos
const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: videoFileFilter
});

// Configure storage for products
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

// Create multer upload instance for products
const productUpload = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter
});

// Configure product upload with multiple fields
const productUploadFields = productUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'hoverImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

// Configure storage for footer
const footerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, footerUploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'footer-logo-' + uniqueSuffix + ext);
  }
});

// Footer upload configuration
const footerUpload = multer({
  storage: footerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter
});

module.exports = {
  directorUpload,
  teamUpload,
  aboutUpload,
  productUpload,
  productUploadFields,
  footerUpload,
  videoUpload
};