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
const imagesUploadDir = path.join(__dirname, '../uploads/images');
const serviceUploadDir = path.join(__dirname, '../uploads/service');
const directorDeskHeroUploadDir = path.join(__dirname, '../uploads/director-desk-hero');

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

// Create service upload directory if it doesn't exist
if (!fs.existsSync(serviceUploadDir)) {
  fs.mkdirSync(serviceUploadDir, { recursive: true });
}

// Create director desk hero upload directory if it doesn't exist
if (!fs.existsSync(directorDeskHeroUploadDir)) {
  fs.mkdirSync(directorDeskHeroUploadDir, { recursive: true });
}

// Create images upload directory if it doesn't exist
if (!fs.existsSync(imagesUploadDir)) {
  fs.mkdirSync(imagesUploadDir, { recursive: true });
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

// Configure storage for director desk hero
const directorDeskHeroStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directorDeskHeroUploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'director-desk-hero-' + uniqueSuffix + ext);
  }
});

// Create multer upload instances
const directorUpload = multer({
  storage: directorStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: fileFilter
});

// File filter to accept images and videos
const mediaFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

// Create director desk hero upload instance
const directorDeskHeroUpload = multer({
  storage: directorDeskHeroStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: mediaFileFilter
});

const teamUpload = multer({
  storage: teamStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
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
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  }
});

// Configure storage for videos
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('video/')) {
      cb(null, videosUploadDir);
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, imagesUploadDir);
    } else {
      cb(new Error('Invalid file type'), null);
    }
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

// File filter to accept both videos and images
const mixedFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video or image files are allowed!'), false);
  }
};

// Create multer upload instance for videos
const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 300 * 1024 * 1024, // 300MB max file size
  },
  fileFilter: videoFileFilter
});

// Create multer upload instance for mixed content (videos and images)
const mixedUpload = multer({
  storage: videoStorage, // Using the same storage as videos
  limits: {
    fileSize: 300 * 1024 * 1024, // 300MB max file size
  },
  fileFilter: mixedFileFilter
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
    fileSize: 100 * 1024 * 1024, // 100MB max file size
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
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: fileFilter
});

// Configure storage for services
const serviceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, serviceUploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Service upload configuration
const serviceUpload = multer({
  storage: serviceStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: fileFilter
});

module.exports = {
  directorUpload,
  teamUpload,
  aboutUpload,
  serviceUpload,
  productUpload,
  productUploadFields,
  footerUpload,
  videoUpload,
  mixedUpload,
  directorDeskHeroUpload
};