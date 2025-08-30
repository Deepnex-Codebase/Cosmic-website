const express = require('express');
const { productUploadFields } = require('../config/multerConfig');
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getFeaturedProducts,
  getRelatedProducts,
  getProductStats
} = require('../controllers/productcontroller');

const router = express.Router();

// Product routes
router.route('/')
  .get(getAllProducts)
  .post(productUploadFields, createProduct);

router.route('/stats')
  .get(getProductStats);

router.route('/featured')
  .get(getFeaturedProducts);

router.route('/category/:category')
  .get(getProductsByCategory);

router.route('/:id')
  .get(getProduct)
  .put(productUploadFields, updateProduct)
  .delete(deleteProduct);

router.route('/:id/related')
  .get(getRelatedProducts);

module.exports = router;