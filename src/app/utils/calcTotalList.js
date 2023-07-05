function calcTotalList(subtotal, total, valueEdit) {

  if(valueEdit) {
    total = total - valueEdit;
  }
  return total + subtotal;
}

module.exports = calcTotalList;
