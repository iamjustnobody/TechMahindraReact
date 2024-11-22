import { useMemo } from "react";
import { format, startOfWeek, isSameDay, isSameMonth, addDays } from "date-fns";
import { Expense } from "../state/expenseReducer";

enum DatasetCat {
  category = "category",
  total = "total",
  all = "all",
}
export const useChartData = (
  filteredExpenses: Expense[],
  timeFrame: "day" | "week" | "month"
  //   datasetCat: DatasetCat
) => {
  return useMemo(() => {
    const groupByTimeFrame = (expenses: Expense[]) => {
      const grouped: Record<string, Record<string, number>> = {};

      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        let key: string;

        if (timeFrame === "day") {
          key = format(expenseDate, "yyyy-MM-dd");
        } else if (timeFrame === "week") {
          const weekStart = startOfWeek(expenseDate);
          key = format(weekStart, "yyyy-MM-dd");
        } else if (timeFrame === "month") {
          key = format(expenseDate, "yyyy-MM");
        } else {
          key = format(expenseDate, "yyyy-MM-dd");
        }

        if (!grouped[key]) grouped[key] = {};
        if (!grouped[key][expense.category]) grouped[key][expense.category] = 0;

        grouped[key][expense.category] += expense.amount;
        if (!grouped[key].total) grouped[key].total = 0;
        grouped[key].total += expense.amount;
      });

      return grouped;
    };

    const groupedExpenses = groupByTimeFrame(filteredExpenses);

    const chartData = Object.keys(groupedExpenses).map((key) => ({
      date: key,
      ...groupedExpenses[key], // include spending per category and total spending
    }));

    // const datasets =
    //   datasetCat === DatasetCat.category
    //     ? [
    //         {
    //           datasetKey: "date",
    //           displayName: "Time",
    //           bXAxis: true,
    //           bVisible: false,
    //         },
    //         ...Object.keys(
    //           filteredExpenses.reduce(
    //             (acc, cur) => ({ ...acc, [cur.category]: true }),
    //             {}
    //           )
    //         ).map((category) => ({
    //           datasetKey: category,
    //           displayName: `Spending on ${category}`,
    //           bXAxis: false,
    //           bVisible: true,
    //         })),
    //       ]
    //     : datasetCat === DatasetCat.total
    //     ? [
    //         {
    //           datasetKey: "date",
    //           displayName: "Time",
    //           bXAxis: true,
    //           bVisible: false,
    //         },
    //         {
    //           datasetKey: "total",
    //           displayName: "Total Spending",
    //           bXAxis: false,
    //           bVisible: true,
    //         },
    //       ]
    //     : [
    //         {
    //           datasetKey: "date",
    //           displayName: "Time",
    //           bXAxis: true,
    //           bVisible: false,
    //         },
    //         ...Object.keys(
    //           filteredExpenses.reduce(
    //             (acc, cur) => ({ ...acc, [cur.category]: true }),
    //             {}
    //           )
    //         ).map((category) => ({
    //           datasetKey: category,
    //           displayName: `Spending on ${category}`,
    //           bXAxis: false,
    //           bVisible: true,
    //         })),
    //         {
    //           datasetKey: "total",
    //           displayName: "Total Spending",
    //           bXAxis: false,
    //           bVisible: true,
    //         },
    //       ];

    const datasets = {
      categoryDatasets: [
        {
          datasetKey: "date",
          displayName: "Time",
          bXAxis: true,
          bVisible: false,
        },
        ...Object.keys(
          filteredExpenses.reduce(
            (acc, cur) => ({ ...acc, [cur.category]: true }),
            {}
          )
        ).map((category) => ({
          datasetKey: category,
          displayName: `Spending on ${category}`,
          bXAxis: false,
          bVisible: true,
        })),
      ],
      totalDatasets: [
        {
          datasetKey: "date",
          displayName: "Time",
          bXAxis: true,
          bVisible: false,
        },
        {
          datasetKey: "total",
          displayName: "Total Spending",
          bXAxis: false,
          bVisible: true,
        },
      ],
    };
    return { data: chartData, datasets, groupedExpenses };
  }, [filteredExpenses, timeFrame]); //[filteredExpenses, timeFrame, datasetCat]
};
