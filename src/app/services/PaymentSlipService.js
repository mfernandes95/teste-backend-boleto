const getPaymentSlip = (line) => {
  if (line.length == 47) return titulo(line);
  if (line.length == 48) return convenio(line);

  throw new Error('A linha está incorreta!');
};

function titulo(line) {
  const barcode = getBarcode(line);

  validateDigit(line, barcode);
  return {
    barcode,
    value: calculateValue(line),
    expirationDate: calculateExpirationDate(line),
  };
}

function convenio(line) {
  const barcode = getBarcodeConvenio(line);
  validateDigitConvenio(line, barcode);

  return {
    barcode,
  };
}

function getBarcode(line) {
  return line.substr(0, 4) + line.substr(32, 15) + line.substr(4, 5) + line.substr(10, 10) + line.substr(21, 10);
}

function getBarcodeConvenio(line) {
  return line.substr(0, 11) + line.substr(12, 11) + line.substr(24, 11) + line.substr(36, 11);
}

function calculateValue(line) {
  const value = line.substr(line.length - 10, line.length).replace(/^0+/, '');

  if (!value) return;

  let finalValue;

  if (value.length == 2) {
    finalValue = '0,' + value;
  } else if (value.length == 1) {
    finalValue = '0,0' + value;
  } else {
    finalValue = value.substring(0, value.length - 2) + ',' + value.substring(value.length - 2, value.length);
  }
  return finalValue;
}

function calculateExpirationDate(line) {
  const days = line.slice(line.length - 14, line.length - 10);

  if (days == '0000') return;

  let month, day;
  const t = new Date();
  const currentDate = new Date();
  currentDate.setFullYear(1997, 9, 7);
  t.setTime(currentDate.getTime() + 1000 * 60 * 60 * 24 * days);
  month = currentDate.getMonth() + 1;
  if (month < 10) month = '0' + month;
  day = currentDate.getDate() + 1;
  if (day < 10) day = '0' + day;

  return t.toLocaleDateString('fr-CA');
}

function validateDigitConvenio(line, barcode) {
  const field1 = module10(line.substr(0, 11));
  const field1Digit = line.substr(11, 1);
  const field2 = module10(line.substr(12, 11));
  const field2Digit = line.substr(23, 1);
  const field3 = module10(line.substr(24, 11));
  const field3Digit = line.substr(35, 1);

  const field4 = module10Convenio(barcode.substr(0, 3) + barcode.substr(4, 40));
  const field4Digit = line.substr(3, 1);

  if (field1 != field1Digit) throw Error(`Digito verificador ${field1Digit} está incorreto. O correto é ${field1}`);
  if (field2 != field2Digit) throw Error(`Digito verificador ${field2Digit} está incorreto. O correto é ${field2}`);
  if (field3 != field3Digit) throw Error(`Digito verificador ${field3Digit} está incorreto. O correto é ${field3}`);
  if (field4 != field4Digit) throw Error(`Digito verificador ${field4Digit} está incorreto. O correto é ${field4}`);
}

function validateDigit(line, barcode) {
  const field1 = module10(line.substr(0, 9));
  const field1Digit = line.substr(9, 1);
  const field2 = module10(line.substr(10, 10));
  const field2Digit = line.substr(20, 1);
  const field3 = module10(line.substr(21, 10));
  const field3Digit = line.substr(31, 1);

  const field4 = module11(barcode.substr(0, 4) + barcode.substr(5, 39));
  const field4Digit = line.substr(32, 1);

  if (field1 != field1Digit) throw Error(`Digito verificador ${field1Digit} está incorreto. O correto é ${field1}`);
  if (field2 != field2Digit) throw Error(`Digito verificador ${field2Digit} está incorreto. O correto é ${field2}`);
  if (field3 != field3Digit) throw Error(`Digito verificador ${field3Digit} está incorreto. O correto é ${field3}`);
  if (field4 != field4Digit) throw Error(`Digito verificador ${field4Digit} está incorreto. O correto é ${field4}`);
}

function module10(number) {
  let soma = 0;
  let peso = 2;
  let contador = number.length - 1;
  let multiplicacao;

  while (contador >= 0) {
    multiplicacao = number.substr(contador, 1) * peso;
    if (multiplicacao >= 10) {
      multiplicacao = 1 + (multiplicacao - 10);
    }
    soma = soma + multiplicacao;
    if (peso == 2) {
      peso = 1;
    } else {
      peso = 2;
    }
    contador = contador - 1;
  }

  let digito = 10 - (soma % 10);
  if (digito == 10) digito = 0;
  return digito;
}

function module10Convenio(number) {
  let soma = 0;
  let peso = 2;
  let contador = number.length - 1;
  let multiplicacao;

  while (contador >= 0) {
    multiplicacao = number.substr(contador, 1) * peso;
    if (multiplicacao >= 10) {
      multiplicacao = 1 + (multiplicacao - 10);
    }
    soma = soma + multiplicacao;
    if (peso == 2) {
      peso = 1;
    } else {
      peso = 2;
    }
    contador = contador - 1;
  }
  let digito = 10 - (soma % 10);
  if (digito == 1) digito = 0;
  return digito;
}

function module11(number) {
  let soma = 0;
  let peso = 2;
  const base = 9;
  const contador = number.length - 1;

  for (let i = contador; i >= 0; i--) {
    soma = soma + number.substring(i, i + 1) * peso;

    if (peso < base) {
      peso++;
    } else {
      peso = 2;
    }
  }
  let digito = 11 - (soma % 11);

  if (digito > 9) digito = 0;

  if (digito == 0) digito = 1;

  return digito;
}

module.exports = getPaymentSlip;
