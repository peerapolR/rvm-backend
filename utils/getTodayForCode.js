module.exports = (e) => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const formattedYear = year.toString().substring(2);

  return `${formattedYear}${month}${day}`;
};
