export default (twoDArray, callBack) => {
  return twoDArray.map((row, rowIndex) =>
    row.map((value, columnIndex) => {
      return callBack({
        array: twoDArray,
        row,
        rowIndex,
        value,
        columnIndex
      });
    })
  );
};
