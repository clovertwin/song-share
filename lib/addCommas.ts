export default function addCommas(n: Number) {
  const stringNum = n.toString();
  let counter = 0;
  let output = "";
  for (let i = stringNum.length - 1; i >= 0; i--) {
    if (counter === 3) {
      output = `${stringNum[i]},` + output;
      counter = 1;
    } else {
      output = stringNum[i] + output;
      counter++;
    }
  }
  return output;
}
