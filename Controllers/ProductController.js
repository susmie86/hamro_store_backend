const { Product } = require("../models/Products")

exports.createProduct = async (req, res) => {
    const product = new Product(req.body);
    try{
        const result = await product.save();
        res.status(201).json(result)
    } catch(err) {
        res.status(400).json(err)
    }
}

