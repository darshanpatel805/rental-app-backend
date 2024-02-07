let express = require("express");
let routes = express.Router();
const auth = require('../middleware')
// let db = require("../db-connection");
// const jwt = require('jsonwebtoken');
// const secretKey = 'your-secret-key';
const userController = require('../controller/userController')
const productController = require('../controller/productController')
const customerController = require('../controller/customerController')
const employeeController = require('../controller/employeeController')
const quatationController = require('../controller/quatationController')
const expenseController = require('../controller/expenseController')
const vendorController = require('../controller/vendorController')
const purchaseController = require('../controller/purchaseController')
const posController = require('../controller/posController')


routes.post("/adduser", userController.addUser);

routes.get('/user', auth, userController.getUser)

routes.post('/addproduct', productController.addProduct)

routes.get('/product-list', productController.getProduct)

routes.post('/updateproduct', productController.updateProduct)

routes.delete('/deleteproduct/:product_id', productController.deleteProduct)

routes.get('/product-detail/:product_id', productController.getProductDetail)

routes.get('/get-accessory', productController.getAccessory)

routes.post('/add-customer', customerController.addCustomer)

routes.get('/get-customerdata', customerController.getCustomerData)

routes.post('/updatecustomer', customerController.updateCustomerData)

routes.delete('/delete-customer/:customer_id', customerController.deleteCustomer)

routes.post('/varify-customer', customerController.varifyCustomer)

routes.post('/add-employee', employeeController.addEmployee)

routes.get('/get-empolyeelist', employeeController.getEmployee)

routes.post('/update-employee', employeeController.updateEmployee)

routes.delete('/delete-employee/:employee_id', employeeController.deleteEmployee)

routes.get('/get-employeedetail/:employee_id', employeeController.getEmployeeDetail)

routes.post('/varify-customer', customerController.varifyCustomer)

routes.get('/product/:searchParams', productController.getSearchProduct)

routes.post('/login-user', employeeController.loginUser)

routes.get('/user-detail', auth, employeeController.getUserDetail)

routes.get('/get-quatationlist', auth, quatationController.getQuatationList)

routes.get('/get-quatationlistbystatus/:status', auth, quatationController.getQuatationByStatus)

routes.post('/add-quatation', auth, quatationController.addQuatation)

routes.post('/update-quatation', auth, quatationController.updateQuatation)

routes.put('/confirm-quatation/:quatation_id', auth, quatationController.confirmQuatation)

routes.put('/cancel-quatation/:quatation_id', auth, quatationController.cancelQuatation)

routes.delete('/delete-quatation/:quatation_id', auth, quatationController.deleteQuatation)

routes.post('/add-expense', auth, expenseController.addExpense)

routes.post('/add-vendor', auth, vendorController.addVendor)

routes.get('/get-vendor', auth, vendorController.getVendor)

routes.post('/update-vendore', auth, vendorController.updateVendor)

routes.delete('/remove-vendore/:vendor_id', auth, vendorController.deleteVendor)

routes.post('/varify-vendor', auth, vendorController.vendorVerify)

routes.get('/get-purchaselist', auth, purchaseController.getPurchaseList)

routes.post('/add-purchase', auth, purchaseController.addPurchase)

routes.post('/get-include-purchase', auth, purchaseController.getIncludeProduct)

routes.post('/update-purchase', auth, purchaseController.updatePurchase)

routes.put('/confirm-purchase/:purchase_id', auth, purchaseController.confirmPurchase)

routes.delete('/delete-purchase/:purchase_id', auth, purchaseController.deletePurchase)

routes.post('/create-session', auth, posController.createSession)

routes.get('/get-active-session', auth, posController.getCurrentSession)

routes.put('/end-session', auth, posController.endSession)

routes.get('/get-session-data', auth, posController.getSessionList)

module.exports = routes;
