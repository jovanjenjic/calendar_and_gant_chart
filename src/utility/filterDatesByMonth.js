const filterDatesByMonth = (array, month = 2) => {
  return array.filter((value) => {
    // Kreiramo novi objekat Date za trenutni datum
    const d = new Date(value?.startTime);
    // Proveravamo da li se mesec u objektu poklapa sa ciljanim mesecom
    return d.getMonth() === month - 1; // month - 1 jer getMonth() vraća indeks meseca (0-11)
  });
};

export default filterDatesByMonth;
