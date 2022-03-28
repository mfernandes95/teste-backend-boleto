const routes = require("express").Router();

const PaymentSlipController = require("./app/controllers/PaymentSlipController");

const requestTime = function (req, res, next) {
  if (!(/^\d+$/.test(req.params.line)))
    return res
      .status(400)
      .json({ error: "São permitidos apenas números na linha!" });
  next();
};

routes.get("/boleto/:line", requestTime, PaymentSlipController.getPaymentSlip);

module.exports = routes;
