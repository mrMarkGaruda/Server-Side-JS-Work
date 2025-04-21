const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const auth = require("../middleware/auth");

// Protected routes (require authentication)
router.post("/create", auth, invoiceController.createInvoice);
router.get("/customer", auth, invoiceController.getCustomerInvoices);
router.get("/:invoiceId", auth, invoiceController.getInvoiceById);
router.put("/:invoiceId/pay", auth, invoiceController.markInvoiceAsPaid);
router.put("/:invoiceId/cancel", auth, invoiceController.cancelInvoice);

// Admin routes could be protected by additional middleware
router.get("/", auth, invoiceController.getAllInvoices);

module.exports = router;