import { PRODUCT_CATALOG, getProductMeta } from '../services/recommendationEngine.js';
import { Product } from '../models/Product.js';
import { isDbConnected } from '../config/db.js';

export async function getAllProducts(req, res) {
  try {
    if (isDbConnected()) {
      const dbProducts = await Product.find().lean();
      if (dbProducts && dbProducts.length > 0) {
        return res.json({ products: dbProducts, total: dbProducts.length });
      }
    }

    const list = Object.values(PRODUCT_CATALOG);
    return res.json({ products: list, total: list.length });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const dbProduct = await Product.findOne({ item_id: id }).lean();
      if (dbProduct) {
        return res.json(dbProduct);
      }
    }

    const product = getProductMeta(id);
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
}

