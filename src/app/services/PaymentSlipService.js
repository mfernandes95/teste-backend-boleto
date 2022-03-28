const getPaymentSlip = (line) => {
  return {
    barcode: getBarcode(line),
    value: calculateValue(line),
    expirationDate: calculateExpirationDate(line),
  };
};

function getBarcode(line) {
  if (line.length < 47 || line.length > 48)
    throw Error("A linha digitável não confere!");

  return (
    line.substr(0, 4) +
    line.substr(32, 15) +
    line.substr(4, 5) +
    line.substr(10, 10) +
    line.substr(21, 10)
  );
}

function calculateValue(line) {
  const value = line.substr(line.length - 10, line.length).replace(/^0+/, "");

  if (!value) return;

  let finalValue;

  if (value.length == 2) {
    finalValue = "0," + value;
  } else if (value.length == 1) {
    finalValue = "0,0" + value;
  } else {
    finalValue =
      value.substring(0, value.length - 2) +
      "," +
      value.substring(value.length - 2, value.length);
  }
  return finalValue;
}

function calculateExpirationDate(line) {
  const vencimento = line.slice(line.length - 14, line.length - 10);
  let date = new Date("10/07/1997");

  date.setTime(date.getTime() + vencimento * 24 * 60 * 60 * 1000);
  return (
    date.getFullYear() +
    "/" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + (date.getDate() + 1)).slice(-2)
  );
}

function validateDigitVerifierModule10(number) {
  number = number.replace(/[^0-9]/g, "");
  console.log("number", number);
  let soma = 0;
  let peso = 2;
  let contador = number.length - 1;

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

function validateDigitVerifierModule11(number) {
  let soma = 0;
  let peso = 2;
  let base = 9;
  let contador = number.length - 1;

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
