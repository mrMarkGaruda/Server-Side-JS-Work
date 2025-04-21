const Invoice = require("../models/invoiceModel");
const Order = require("../models/orderModel");

// Generate invoice number
const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  return `INV-${Date.now()}-${count + 1}`;
};

// Create invoice from order
exports.createInvoice = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Check if invoice for this order already exists
    const existingInvoice = await Invoice.findOne({ order: orderId });
    if (existingInvoice) {
      return res.status(400).json({ 
        error: "Invoice already exists for this order" 
      });
    }
    
    // Get order details
    const order = await Order.findById(orderId)
      .populate("orderItems.variant")
      .populate("user");
      
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Calculate totals
    let subtotal = 0;
    const items = order.orderItems.map(item => {
      const itemTotal = item.quantity * item.variant.price;
      subtotal += itemTotal;
      
      return {
        description: item.variant.artPrint ? item.variant.artPrint.title : "Product",
        quantity: item.quantity,
        unitPrice: item.variant.price,
        total: itemTotal
      };
    });
    
    // Apply discount if applicable
    let discount = 0;
    if (order.discount) {
      discount = subtotal * (order.discount.percentage / 100);
    }
    
    // Calculate tax (example: 10%)
    const tax = (subtotal - discount) * 0.1;
    
    // Calculate total
    const total = subtotal - discount + tax;
    
    // Create invoice
    const invoiceNumber = await generateInvoiceNumber();
    const newInvoice = new Invoice({
      order: orderId,
      invoiceNumber,
      customer: order.user,
      items,
      subtotal,
      tax,
      discount,
      total,
      status: "Unpaid"
    });
    
    const savedInvoice = await newInvoice.save();
    
    res.status(201).json(savedInvoice);
  } catch (err) {
    console.error("Error creating invoice:", err);
    res.status(500).json({ error: "Failed to create invoice" });
  }
};

// Get all invoices (admin only)
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("customer", "firstName lastName email")
      .populate("order");
      
    res.json(invoices);
  } catch (err) {
    console.error("Error getting invoices:", err);
    res.status(500).json({ error: "Failed to get invoices" });
  }
};

// Get customer invoices
exports.getCustomerInvoices = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    
    const invoices = await Invoice.find({ customer: userId })
      .populate("order");
      
    res.json(invoices);
  } catch (err) {
    console.error("Error getting customer invoices:", err);
    res.status(500).json({ error: "Failed to get invoices" });
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    
    const invoice = await Invoice.findById(invoiceId)
      .populate("customer", "firstName lastName email")
      .populate("order");
      
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    
    // Check if user is authorized (admin or customer)
    if (invoice.customer._id.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ error: "Not authorized to view this invoice" });
    }
    
    res.json(invoice);
  } catch (err) {
    console.error("Error getting invoice:", err);
    res.status(500).json({ error: "Failed to get invoice" });
  }
};

// Update invoice status (mark as paid)
exports.markInvoiceAsPaid = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    
    invoice.status = "Paid";
    invoice.paidAt = new Date();
    
    const updatedInvoice = await invoice.save();
    
    res.json(updatedInvoice);
  } catch (err) {
    console.error("Error updating invoice:", err);
    res.status(500).json({ error: "Failed to update invoice" });
  }
};

// Cancel invoice
exports.cancelInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    
    invoice.status = "Cancelled";
    
    const updatedInvoice = await invoice.save();
    
    res.json(updatedInvoice);
  } catch (err) {
    console.error("Error cancelling invoice:", err);
    res.status(500).json({ error: "Failed to cancel invoice" });
  }
};