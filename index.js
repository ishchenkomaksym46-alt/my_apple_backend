import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { registerController } from './controlers/registerController.js';
import { loginController } from './controlers/loginController.js';
import auth from './middlewares/authMiddleware.js';
import roleMiddleware from './middlewares/roleMiddleware.js';
import { productController } from './controlers/productController.js';
import { createProductController } from './controlers/createProductController.js'
import { deleteProductController } from './controlers/deleteProductController.js';
import { moreInfoController } from './controlers/moreInfoController.js';
import { getCartController } from './controlers/getCartController.js';
import { addToCartController } from './controlers/addToCartController.js';
import { removeFromCartController } from './controlers/removeFromCartController.js';
import { orderOneController } from './controlers/orderOneController.js';
import { orderCartController } from './controlers/orderCartController.js';
import { getOrderController } from './controlers/getOrdersController.js';
import { checkRoleController } from './controlers/checkRoleController.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/register', registerController);
app.post('/login', loginController);
app.get('/mainPageCheck', auth, (req, res) => {
    res.json({ message: 'Login succesfull!', user: req.user })
})
app.get('/getProducts', productController);
app.post('/createProduct', auth, roleMiddleware, createProductController);
app.post('/deleteProduct', auth, roleMiddleware, deleteProductController);
app.get('/moreInfo/:id', moreInfoController);
app.get('/cart', auth, getCartController);
app.post('/cart', auth, addToCartController);
app.delete('/cart/:id', auth, removeFromCartController);
app.post('/order/cart', auth, orderCartController);
app.get('/order/:id', auth, orderOneController);
app.get('/getOrders', auth, getOrderController);
app.get('/checkRole', auth, checkRoleController);

app.listen(process.env.PORT, () => console.log('Server started!'));
