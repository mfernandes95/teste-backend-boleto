const routes = require('express').Router();

const PaymentSlipController = require('./app/controllers/PaymentSlipController');

const validateParam = function (req, res, next) {
  if (!/^\d+$/.test(req.params.line)) return res.status(400).json({ error: 'São permitidos apenas números na linha!' });

  const lineLength = req.params.line.length;
  if (lineLength < 47 || lineLength > 48)
    return res.status(400).json({ error: 'A linha digitada deve conter 47 ou 48 caracteres' });
  next();
};

routes.get('/boleto/:line', validateParam, PaymentSlipController.getPaymentSlip);

module.exports = routes;
