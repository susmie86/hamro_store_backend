const categoryModel = require("../models/Categories");
const { validateMongooseId } = require("../services/validate_mogoose_id");

const addCategory = async (req, res) => {
  const { name } = req.body;
  const icon = `http://localhost:5000/${req.file?.path}`;

  if (!name) throw "Category name is required";
  if (!icon) throw "Category icon is required";

  const existingCategory = await categoryModel.findOne({ name });
  if (existingCategory) throw "Category already exists";

  const newCategory = await categoryModel.create({ name: name, icon: icon });
  if (!newCategory) throw "Failed to create category";

  res.json({
    status: "Success",
    message: "Category created successfully",
    data: newCategory,
  });
};

const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  validateMongooseId(categoryId);

  if (!categoryId) throw "Category id is required";

  const updatedCategory = await categoryModel.findByIdAndUpdate(
    categoryId,
    {
      name: req.body?.name,
      icon: `http://localhost:5000/${req.file?.path}`,
    },
    { new: true }
  );
  if (!updatedCategory) throw "Failed to update category";

  res.json({
    status: "Success",
    message: "Category updated successfully",
    data: updateCategory,
  });
};

const getCategories = async (req, res) => {};
const deleteCategory = async (req, res) => {};

module.exports = {
  addCategory,
  updateCategory,
  getCategories,
  deleteCategory,
};
