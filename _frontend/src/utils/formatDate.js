

const formatDate = date => {
  

  const dateObj = new Date(date);
  const dateStringParsed = dateObj.toLocaleDateString().split("/");
  const distDate = `${dateStringParsed[1]} /
     ${dateStringParsed[0]} /
     ${dateStringParsed[2]}`;
  return distDate;
};


export default formatDate;
