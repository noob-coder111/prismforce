const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });
choice = prompt(
  "Menu:\n1. 1-input.json\n2. 2-input.json\n\nEnter your choice : "
);
let filename = "";
switch (choice) {
  case "1":
    filename = "1-input.json";
    break;
  case "2":
    filename = "2-input.json";
    break;
}
const data = fs.readFile(filename, "utf8", (error, dataValue) => {
  if (error) console.log(error);
  else {
    const data = JSON.parse(dataValue);
    const balance = [];

    const minStartDate = new Date(
      Math.min(
        ...data.revenueData.map((item) => new Date(item.startDate)),
        ...data.expenseData.map((item) => new Date(item.startDate))
      )
    ).toISOString();

    const maxStartDate = new Date(
      Math.max(
        ...data.revenueData.map((item) => new Date(item.startDate)),
        ...data.expenseData.map((item) => new Date(item.startDate))
      )
    ).toISOString();

    const currentDate = new Date(minStartDate);
    while (currentDate.toISOString() <= maxStartDate) {
      const matchingRevenue = data.revenueData.filter(
        (item) => item.startDate === currentDate.toISOString()
      );
      const matchingExpense = data.expenseData.filter(
        (item) => item.startDate === currentDate.toISOString()
      );

      let revenueAmount = 0;
      for (let i = 0; i < matchingRevenue.length; i++) {
        revenueAmount += matchingRevenue[i].amount || 0;
      }

      let expenseAmount = 0;
      for (let i = 0; i < matchingExpense.length; i++) {
        expenseAmount += matchingExpense[i].amount || 0;
      }

      const amount = revenueAmount - expenseAmount;
      balance.push({
        amount,
        startDate: currentDate.toISOString(),
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const result = {
      balance,
    };

    console.log(JSON.stringify(result, null, 2));
  }
});
