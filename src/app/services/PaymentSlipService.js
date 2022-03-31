const getPaymentSlip = (line) => {
  if (line.length === 47) {
    const barcode = getBarcode(line);

    validateDigit(line, barcode);
    return {
      barcode,
      amount: getAmount(line),
      expirationDate: getExpirationDate(line),
    };
  } else {
    const barcode = getBarcode(line);
    validateDigit(line, barcode);

    return {
      barcode,
      amount: getAmount(line),
    };
  }
};

function getBarcode(line) {
  if (line.length === 47)
    return line.substr(0, 4) + line.substr(32, 15) + line.substr(4, 5) + line.substr(10, 10) + line.substr(21, 10);
  else return line.substr(0, 11) + line.substr(12, 11) + line.substr(24, 11) + line.substr(36, 11);
}

function getAmount(line) {
  let slicedValue;

  if (line.length === 47) {
    slicedValue = line.slice(38, 47);
  } else {
    slicedValue = line.slice(4, 15);
  }

  const parsedValue = parseInt(slicedValue, 10);
  return (parsedValue / 100).toFixed(2);
}

function getExpirationDate(line) {
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

function validateDigit(line, barcode) {
  let field1, field1Digit;
  let field2, field2Digit;
  let field3, field3Digit;
  let field4, field4Digit;

  if (line.length === 47) {
    field1 = module10(line.substr(0, 9));
    field1Digit = line.substr(9, 1);
    field2 = module10(line.substr(10, 10));
    field2Digit = line.substr(20, 1);
    field3 = module10(line.substr(21, 10));
    field3Digit = line.substr(31, 1);

    field4 = module11(barcode.substr(0, 4) + barcode.substr(5, 39));
    field4Digit = line.substr(32, 1);

    if (field1 != field1Digit) throw Error(`Digito verificador ${field1Digit} está incorreto. O correto é ${field1}`);
    if (field2 != field2Digit) throw Error(`Digito verificador ${field2Digit} está incorreto. O correto é ${field2}`);
    if (field3 != field3Digit) throw Error(`Digito verificador ${field3Digit} está incorreto. O correto é ${field3}`);
    if (field4 != field4Digit) throw Error(`Digito verificador ${field4Digit} está incorreto. O correto é ${field4}`);
  } else {
    console.log('22222222222222', line, barcode);
    field1 = module10(line.substr(0, 11));
    field1Digit = line.substr(11, 1);
    field2 = module10(line.substr(12, 11));
    field2Digit = line.substr(23, 1);
    field3 = module10(line.substr(24, 11));
    field3Digit = line.substr(35, 1);

    field4 = module10(barcode.substr(0, 3) + barcode.substr(4, 40));
    field4Digit = line.substr(3, 1);

    if (field1 != field1Digit) throw Error(`Digito verificador ${field1Digit} está incorreto. O correto é ${field1}`);
    if (field2 != field2Digit) throw Error(`Digito verificador ${field2Digit} está incorreto. O correto é ${field2}`);
    if (field3 != field3Digit) throw Error(`Digito verificador ${field3Digit} está incorreto. O correto é ${field3}`);
    if (field4 != field4Digit) throw Error(`Digito verificador ${field4Digit} está incorreto. O correto é ${field4}`);
  }
}

function module10(number) {
  let soma = 0;
  let peso = 2;
  let contador = number.length - 1;
  let multiplicacao;

  if (number.length === 43) {
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
  } else {
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
