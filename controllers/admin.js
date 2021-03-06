const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // Product
  //   .create({
  //     title: title,
  //     price: price,
  //     imageUrl: imageUrl,
  //     description: description,
  //     userId: req.user.id
  //   })
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; // edit é a propriedade esperada da url

  if (!editMode) {
    return res.redirect('/');
  }

  // fetch o product para enviar para o edit-product.ejs
  const prodId = req.params.productId;
  // Product.findByPk(prodId)
  req.user.getProducts({ where: { id: prodId } })
    .then(products => {
      const product = products[0];
      if (!product) {
        res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        product: product,
        editing: editMode,
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const updatedId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  // Product.findByPk(updatedId)
  req.res.getProducts()
    .then(product => {
      product.title = updatedTitle,
        product.imageUrl = updatedImageUrl,
        product.price = updatedPrice,
        product.description = updatedDescription

      return product.save()
    })
    .then(() => { })
    .catch(err => console.log(err));

  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => product.destroy())
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));

};
