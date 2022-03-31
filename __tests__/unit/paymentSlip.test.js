const PaymentSlipService = require("../../src/app/services/PaymentSlipService");

describe("Payment Slip", () => {
  beforeEach(() => {});

  it("should return payment slip titulo data", () => {
    expect(
      PaymentSlipService("21290001192110001210904475617405975870000002000")
    ).toStrictEqual({
      barcode: "21299758700000020000001121100012100447561740",
      value: "20,00",
      expirationDate: "2018-07-16",
    });
  });

  it("should return payment slip titulo data", () => {
    expect(
      PaymentSlipService("846700000017435900240209024050002435842210108119")
    ).toStrictEqual({
      barcode: "84670000001435900240200240500024384221010811",
    });
  });

  it("should throw", () => {
    expect(() =>
      PaymentSlipService("84670000001435900240200240500024384221010811")
    ).toThrow("A linha está incorreta!");
  });

  it("should return barcode", () => {
    const getBarcode = PaymentSlipService.__get__("getBarcode");
    expect(getBarcode("21290001192110001210904475617405975870000002000")).toBe(
      "21299758700000020000001121100012100447561740"
    );
  });

  it("should return barcode convenio", () => {
    const getBarcode = PaymentSlipService.__get__("getBarcodeConvenio");
    expect(getBarcode("846700000017435900240209024050002435842210108119")).toBe(
      "84670000001435900240200240500024384221010811"
    );
  });

  it("should return expiration date", () => {
    const expirationDate = PaymentSlipService.__get__(
      "calculateExpirationDate"
    );

    expect(
      expirationDate("21290001192110001210904475617405975870000002000")
    ).toBe("2018-07-16");
    expect(
      expirationDate("21290001192110001210904475617405900000000002000")
    ).toBe(undefined);
  });

  it("should return value", () => {
    const value = PaymentSlipService.__get__("calculateValue");

    expect(value("21290001192110001210904475617405975870000002000")).toBe(
      "20,00"
    );
    expect(value("21290001192110001210904475617405975870000000020")).toBe(
      "0,20"
    );
    expect(value("21290001192110001210904475617405975870000000005")).toBe(
      "0,05"
    );
    expect(value("21290001192110001210904475617405975870000000000")).toBe(
      undefined
    );
  });

  it("should validate digit", () => {
    const value = PaymentSlipService.__get__("validateDigit");

    expect(() =>
      value(
        "21290001192110001210904475617405975870000002000",
        "21299758700000020000001121100012100447561740"
      )
    ).not.toThrow();
  });

  it("should validate digit convenio", () => {
    const value = PaymentSlipService.__get__("validateDigitConvenio");

    expect(() =>
      value(
        "846700000017435900240209024050002435842210108119",
        "84670000001435900240200240500024384221010811"
      )
    ).not.toThrow();
  });

  it("should throw when validate digit", () => {
    const value = PaymentSlipService.__get__("validateDigit");

    expect(() =>
      value(
        "21290001192110001210904475617405975870000000200",
        "21299758700000002000001121100012100447561740"
      )
    ).toThrow("Digito verificador 9 está incorreto. O correto é 1");
    expect(() =>
      value(
        "21290001122110001210904475617405975870000002000",
        "21299758700000002000001121100012100447561740"
      )
    ).toThrow("Digito verificador 2 está incorreto. O correto é 9");
    expect(() =>
      value(
        "21290001192110001210204475617405975870000002000",
        "21299758700000002000001121100012100447561740"
      )
    ).toThrow("Digito verificador 2 está incorreto. O correto é 9");
    expect(() =>
      value(
        "21290001192110001210904475617402975870000002000",
        "21299758700000002000001121100012100447561740"
      )
    ).toThrow("Digito verificador 2 está incorreto. O correto é 5");
  });

  it("should throw when validate digit convenio", () => {
    const value = PaymentSlipService.__get__("validateDigitConvenio");

    expect(() =>
      value(
        "846700000012435900240209024050002435842210108119",
        "84670000001435900240200240500024384221010811"
      )
    ).toThrow("Digito verificador 2 está incorreto. O correto é 7");
    expect(() =>
      value(
        "846700000017435900240202024050002435842210108119",
        "84670000001435900240200240500024384221010811"
      )
    ).toThrow("Digito verificador 2 está incorreto. O correto é 9");
    expect(() =>
      value(
        "846700000017435900240209024050002432842210108119",
        "84670000001435900240200240500024384221010811"
      )
    ).toThrow("Digito verificador 2 está incorreto. O correto é 5");
  });

  it("Should return digit mod10", () => {
    const mod10 = PaymentSlipService.__get__("module10");

    expect(mod10("212900011")).toStrictEqual(9);
  });

  it("Should return digit mod11", () => {
    const mod11 = PaymentSlipService.__get__("module11");

    expect(mod11("2129758700000020000001121100012100447561740")).toStrictEqual(
      9
    );
  });
});
