const PaymentSlipService = require('../services/PaymentSlipService');


class PaymentSlipController {
  async getPaymentSlip(req, res) {
    try {
      res.status(200).send(PaymentSlipService(req.params.line));
    } catch (error) {
        res.status(400).send(error.message);
    }
  }
}

module.exports = new PaymentSlipController();
