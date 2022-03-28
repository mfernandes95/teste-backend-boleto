const PaymentSlipService = require("../../src/app/services/PaymentSlipService");

describe("Payment Slip", () => {
  beforeEach(async () => {});

  it("should return payment slip data", async () => {
    expect(
      PaymentSlipService("21290001192110001210904475617405975870000002000")
    ).toStrictEqual({
      barcode: "21299758700000020000001121100012100447561740",
      value: "20,00",
      expirationDate: "2018/07/16",
    });
  });
});
