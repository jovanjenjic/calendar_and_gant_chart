/* eslint-disable no-plusplus */
const findFirstFreeNumber = (arr) => {
  if (!arr) return 1;
  const maxValue = arr.reduce((max, current) => {
    if (current.depth > max) {
      return current.depth;
    }
    return max;
  }, arr[0].depth);

  // Kreiraj Set koji će sadržati brojeve iz niza objekata
  const nums = new Set(arr.map((obj) => obj.depth));

  // Inicijalizuj prvi slobodan broj na 0
  let firstFree = 1;

  // Prolazi kroz sve brojeve od 0 do prosleđenog broja
  for (let i = 1; i <= maxValue + 1; i++) {
    // Ako se broj ne nalazi u Set-u, postavljamo ga kao prvi slobodan i izlazimo iz petlje
    if (!nums.has(i)) {
      firstFree = i;
      break;
    }
  }

  // Vrati prvi slobodan broj
  return firstFree;
};

export default findFirstFreeNumber;
