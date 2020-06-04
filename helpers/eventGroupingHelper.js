function eventGroupingHelper(data) {
  let groupedData = [];

  let form = { date: null, children: [] };

  for (let i = 0; i < data.length; i++) {
    if (form.date === null) {
      form.date = data[i].date;
    }

    if (data.length === 1) {
      form.children.push(data[i]);
      groupedData.push(form);
    } else if (form.date === data[i].date) {
      form.children.push(data[i]);
    } else {
      groupedData.push(form);

      form = { date: null, children: [] };
      form.date = data[i].date;
      form.children.push(data[i]);
    }
  }
  return groupedData;
}

module.exports = eventGroupingHelper;
