import { SelectOption } from "./helpers/SelectFieldWFormik";
import { format, isAfter, isBefore } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import useMedia from "use-media";
import { useExpenseContext } from "../state/expenseContext";
import { ButtonWOFormik } from "./helpers/ButtonWOFormik";
import { SelectFieldWOFormik } from "./helpers/SelectFieldWOFormik0";
import {
  isSameDay,
  isWithinInterval,
  addDays,
  startOfWeek,
  isSameMonth,
} from "date-fns";
type Props = {
  chartName: string;
};

enum ChartType {
  line = "line",
  bar = "bar",
}

type TDatasets<T = { [k: string]: any }> = {
  datasetKey: keyof T;
  displayName: string;
  bXAxis: boolean;
  bVisible: boolean;
  total?: number;
}[];
type ChartData<T = { [k: string]: any }> = {
  // metadata: {
  //   timeOptions: SelectOption[];
  //   selectedTime: string;
  //   yAxisLabel: string;
  //   chartType: ChartType;
  //   siteOptions: SelectOption[];
  //   selectedSite: string;
  //   templateOptions: SelectOption[];
  //   selectedTemplate: string;
  // };
  data: T[];
  // datasets: {
  //   datasetKey: keyof T;
  //   displayName: string;
  //   bXAxis: boolean;
  //   bVisible: boolean;
  //   total?: number;
  // }[];
  categoryDatasets: TDatasets<T>;
  totalDatasets: TDatasets<T>;
};

const timeFrameOptions = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];
const chartTypeOptions = [
  { value: "line", label: "Line Chart" },
  { value: "bar", label: "Bar Chart" },
];

type GroupedExpenseData = { [key: string]: { [category: string]: number } };

export const ExpenseCharts = ({ chartName }: Props) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  const { state } = useExpenseContext();
  //   const [timeRange, setTimeRange] = useState<string>("");

  //   const derivedChartData = useMemo(() => {
  //     const filteredExpenses = state.expenses.filter((expense) =>
  //       timeRange ? expense.date.startsWith(timeRange) : true
  //     );

  //     return {
  //       data: filteredExpenses.map((expense) => ({
  //         category: expense.category,
  //         amount: expense.amount,
  //         date: expense.date,
  //       })),
  //       datasets: [
  //         {
  //           datasetKey: "amount",
  //           displayName: "Expense Amount",
  //           bXAxis: false,
  //           bVisible: true,
  //           total: filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
  //         },
  //         {
  //           datasetKey: "category",
  //           displayName: "Categories",
  //           bXAxis: true,
  //           bVisible: true,
  //         },
  //       ],
  //     };
  //   }, [state.expenses, timeRange]);

  // const [startDate, setStartDate] = useState<Date | null>(null); // Start date filter
  // const [endDate, setEndDate] = useState<Date | null>(null); // End date filter
  const [timeFrame, setTimeFrame] = useState<"day" | "week" | "month">("month"); // Time frame filter
  const [chartType, setChartType] = useState<ChartType>(ChartType.line);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // // Helper function to filter expenses based on date range and time frame
  // const filterExpenses = useCallback(() => {
  //   if (!startDate || !endDate) return state.expenses;

  //   return state.expenses.filter((expense) => {
  //     const expenseDate = new Date(expense.date);

  //     // Check if expenseDate is within the range
  //     if (expenseDate < startDate || expenseDate > endDate) {
  //       return false;
  //     }

  //     // Adjust filtering based on time frame
  //     if (timeFrame === "day") {
  //       return expenseDate.toDateString() === startDate.toDateString();
  //     }
  //     if (timeFrame === "week") {
  //       const weekEnd = new Date(startDate);
  //       weekEnd.setDate(startDate.getDate() + 6); // Add 6 days to get the end of the week
  //       return expenseDate >= startDate && expenseDate <= weekEnd;
  //     }
  //     if (timeFrame === "month") {
  //       return (
  //         expenseDate.getFullYear() === startDate.getFullYear() &&
  //         expenseDate.getMonth() === startDate.getMonth()
  //       );
  //     }
  //     return false;
  //   });
  // }, [state.expenses, startDate, endDate, timeFrame]);

  //   import { isSameDay, isWithinInterval, addDays, startOfWeek, startOfMonth, isSameMonth, isSameWeek } from "date-fns";

  // const filterExpenses = useCallback(() => {
  //   if (!startDate || !endDate) return state.expenses;

  //   return state.expenses.filter((expense) => {
  //     const expenseDate = new Date(expense.date);

  //     // Check if expenseDate is within the range
  //     const inRange = isWithinInterval(expenseDate, { start: startDate, end: endDate });
  //     if (!inRange) return false;

  //     // Adjust filtering based on time frame
  //     if (timeFrame === "day") {
  //       return isSameDay(expenseDate, startDate);
  //     }

  //     if (timeFrame === "week") {
  //       const weekStart = startOfWeek(startDate); // Start of the week
  //       const weekEnd = addDays(weekStart, 6);   // End of the week
  //       return isWithinInterval(expenseDate, { start: weekStart, end: weekEnd });
  //     }

  //     if (timeFrame === "month") {
  //       return isSameMonth(expenseDate, startDate);
  //     }

  //     return false;
  //   });
  // }, [state.expenses, startDate, endDate, timeFrame]);

  const filterExpenses = useCallback(() => {
    const { startDate, endDate, expenses } = state;
    if (!startDate || !endDate) return state.expenses;

    return state.expenses.filter((expense) => {
      // Ensure the expense date is within the range
      const inRange = isWithinInterval(expense.date, {
        start: startDate,
        end: endDate,
      });
      if (!inRange) return false;

      // Adjust filtering based on time frame
      if (timeFrame === "day") {
        return isSameDay(expense.date, startDate);
      }

      if (timeFrame === "week") {
        const weekStart = startOfWeek(startDate, { weekStartsOn: 0 }); // Start of the week (Sunday)
        const weekEnd = addDays(weekStart, 6); // End of the week (Saturday)
        return isWithinInterval(expense.date, {
          start: weekStart,
          end: weekEnd,
        });
      }

      if (timeFrame === "month") {
        return isSameMonth(expense.date, startDate);
      }

      // // Filter by date range
      // if (
      //   !(startDate && isBefore(expense.date, startDate)) &&
      //   !(endDate && isAfter(expense.date, endDate))
      // ) {
      //   return true;
      // }

      // // Filter by category
      // if (categoryFilter === "All" || expense.category === categoryFilter) {
      //   return true;
      // }

      return false;
    });
  }, [state.expenses, state.startDate, state.endDate, timeFrame]);

  // Derive chartData based on filtered expenses
  // const derivedChartData = useMemo(() => {
  //   const filteredExpenses = filterExpenses();

  //   return {
  //     data: filteredExpenses.map((expense) => ({
  //       category: expense.category,
  //       amount: expense.amount,
  //       date: expense.date,
  //     })),
  //     datasets: [
  //       {
  //         datasetKey: "amount",
  //         displayName: "Expense Amount",
  //         bXAxis: false,
  //         bVisible: true,
  //         total: filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
  //       },
  //       {
  //         datasetKey: "category",
  //         displayName: "Categories",
  //         bXAxis: false,
  //         bVisible: true,
  //       },
  //     ],
  //   };
  // }, [filterExpenses]);

  // const derivedChartData = useMemo(() => {
  //   const filteredExpenses = filterExpenses();

  //   // Helper function to group expenses by the selected timeframe
  //   const groupByTimeFrame = (expenses: typeof filteredExpenses) => {
  //     const grouped: { [key: string]: { [category: string]: number } } = {};

  //     expenses.forEach((expense) => {
  //       const expenseDate = new Date(expense.date);
  //       let key: string;

  //       if (timeFrame === "day") {
  //         key = expenseDate.toISOString().split("T")[0]; // Group by day (e.g., "2024-11-17")
  //       } else if (timeFrame === "week") {
  //         const weekStart = new Date(expenseDate);
  //         weekStart.setDate(expenseDate.getDate() - expenseDate.getDay()); // Start of the week
  //         key = weekStart.toISOString().split("T")[0]; // Use the week start date as the key
  //       } else if (timeFrame === "month") {
  //         key = `${expenseDate.getFullYear()}-${expenseDate.getMonth() + 1}`; // Group by year-month
  //       } else {
  //         key = expense.date; // Fallback: use the raw date
  //       }

  //       if (!grouped[key]) grouped[key] = {};
  //       if (!grouped[key][expense.category]) grouped[key][expense.category] = 0;

  //       grouped[key][expense.category] += expense.amount;
  //       if (!grouped[key].total) grouped[key].total = 0;
  //       grouped[key].total += expense.amount;
  //     });

  //     return grouped;
  //   };

  //   const groupedExpenses = groupByTimeFrame(filteredExpenses);

  //   // Transform grouped data into chart-friendly format
  //   const chartData = Object.keys(groupedExpenses).map((key) => ({
  //     date: key,
  //     ...groupedExpenses[key], // Include spending per category and total spending
  //   }));

  //   return {
  //     data: chartData,
  //     datasets: [
  //       ...Object.keys(
  //         filteredExpenses.reduce(
  //           (acc, cur) => ({ ...acc, [cur.category]: true }),
  //           {}
  //         )
  //       ).map((category, index) => ({
  //         datasetKey: category,
  //         displayName: `Spending on ${category}`,
  //         bXAxis: false,
  //         bVisible: true,
  //       })),
  //       {
  //         datasetKey: "total",
  //         displayName: "Total Spending",
  //         bXAxis: false,
  //         bVisible: true,
  //       },
  //     ],
  //   };
  // }, [filterExpenses, timeFrame]);

  // const derivedChartData = useMemo(() => {
  //   const filteredExpenses = filterExpenses();

  //   // Helper function to group expenses by the selected timeframe
  //   const groupByTimeFrame = (expenses: typeof filteredExpenses) => {
  //     const grouped: {
  //       [key: string]: { [category: string]: number; total: number };
  //     } = {};

  //     expenses.forEach((expense) => {
  //       const expenseDate = expense.date;
  //       let key: string;

  //       if (timeFrame === "day") {
  //         key = format(expenseDate, "yyyy-MM-dd"); // Group by day (e.g., "2024-11-17")
  //       } else if (timeFrame === "week") {
  //         const weekStart = startOfWeek(expenseDate, { weekStartsOn: 0 }); // Start of the week (Sunday)
  //         key = format(weekStart, "yyyy-MM-dd");
  //       } else if (timeFrame === "month") {
  //         key = format(expenseDate, "yyyy-MM"); // Group by year-month (e.g., "2024-11")
  //       } else {
  //         key = expenseDate.toISOString(); // Fallback: use raw date
  //       }

  //       // Initialize the key if not already present
  //       if (!grouped[key]) grouped[key] = { total: 0 };

  //       // Add expense amount to the respective category
  //       grouped[key][expense.category] =
  //         (grouped[key][expense.category] || 0) + expense.amount;

  //       // Update total spending
  //       grouped[key].total += expense.amount;
  //     });

  //     return grouped;
  //   };

  //   const groupedExpenses = groupByTimeFrame(filteredExpenses);

  //   // Transform grouped data into chart-friendly format
  //   const chartData = Object.entries(groupedExpenses).map(([key, values]) => ({
  //     date: key,
  //     ...values, // Spread the categories and total spending
  //   }));

  //   // Extract unique categories for dataset generation
  //   const uniqueCategories = Array.from(
  //     new Set(filteredExpenses.map((expense) => expense.category))
  //   );

  //   return {
  //     data: chartData,
  //     datasets: [
  //       ...uniqueCategories.map((category, index) => ({
  //         datasetKey: category,
  //         displayName: `Spending on ${category}`,
  //         bXAxis: false,
  //         bVisible: true,
  //       })),
  //       {
  //         datasetKey: "total",
  //         displayName: "Total Spending",
  //         bXAxis: false,
  //         bVisible: true,
  //       },
  //     ],
  //   };
  // }, [filterExpenses, timeFrame]);

  const derivedChartData = useMemo(() => {
    const filteredExpenses = filterExpenses();

    const groupByTimeFrame = (expenses: typeof filteredExpenses) => {
      const grouped: GroupedExpenseData = {};
      console.log("expense ", expenses);
      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        let key: string;

        if (timeFrame === "day") {
          key = format(expenseDate, "yyyy-MM-dd");
        } else if (timeFrame === "week") {
          const weekStart = startOfWeek(expenseDate); // Use date-fns startOfWeek
          key = format(weekStart, "yyyy-MM-dd");
        } else if (timeFrame === "month") {
          key = format(expenseDate, "yyyy-MM");
        } else {
          key = format(expenseDate, "yyyy-MM-dd");
        }

        if (!grouped[key])
          grouped[key] = {} as {
            [category: string]: number;
          };
        if (!grouped[key][expense.category])
          grouped[key][expense.category] = 0 as number;

        grouped[key][expense.category] += expense.amount;
        if (!grouped[key].total) grouped[key].total = 0;
        grouped[key].total += expense.amount;
      });

      return grouped;
    };

    const groupedExpenses = groupByTimeFrame(filteredExpenses);

    // Transform grouped data into chart-friendly format
    const chartData = Object.keys(groupedExpenses).map((key) => ({
      date: key,
      ...groupedExpenses[key], // Include spending per category and total spending
    }));

    // Add the `date` dataset for the X-axis
    const categoryDatasets = [
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
      ).map((category, index) => ({
        datasetKey: category,
        displayName: `Spending on ${category}`,
        bXAxis: false,
        bVisible: true,
      })),
      // {
      //   datasetKey: "total",
      //   displayName: "Total Spending",
      //   bXAxis: false,
      //   bVisible: true,
      // },
    ];

    // const categoryDatasets = Object.keys(
    //   filteredExpenses.reduce(
    //     (acc, cur) => ({ ...acc, [cur.category]: true }),
    //     {}
    //   )
    // ).map((category, index) => ({
    //   datasetKey: category,
    //   displayName: `Spending on ${category}`,
    //   bXAxis: false,
    //   bVisible: true,
    // }));

    const totalDatasets = [
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
    ];

    // return { data: chartData, datasets };
    return {
      data: chartData,
      categoryDatasets,
      totalDatasets,
    };
  }, [filterExpenses, timeFrame]);

  useMemo(() => {
    setChartData(derivedChartData);
    console.log("darived date", derivedChartData);
  }, [derivedChartData]);

  const toggleHideDataset = useCallback((dataKey: string | number) => {
    setChartData((curr) => {
      if (!curr) return null;
      return {
        ...curr,
        // datasets: curr.datasets.map((dataset) =>
        //   dataset.datasetKey === dataKey
        //     ? { ...dataset, bVisible: !dataset.bVisible }
        //     : dataset
        // ),
        categoryDatasets: curr.categoryDatasets.map((dataset) =>
          dataset.datasetKey === dataKey
            ? { ...dataset, bVisible: !dataset.bVisible }
            : dataset
        ),
        totalDatasets: curr.totalDatasets.map((dataset) =>
          dataset.datasetKey === dataKey
            ? { ...dataset, bVisible: !dataset.bVisible }
            : dataset
        ),
      };
    });
  }, []);

  const mobile = useMedia({ maxWidth: 768 });

  const xAxisKey_total = chartData?.totalDatasets.find(
    (set) => set.bXAxis
  )?.datasetKey;
  // console.log("££££££", xAxisKey);
  const xAxisKey_cat = chartData?.categoryDatasets.find(
    (set) => set.bXAxis
  )?.datasetKey;

  return (
    <div className="DashboardCharts">
      <div className="DashboardHeader">
        <h3>{chartName}</h3>
        {chartData && (
          <div className="ChartSelections">
            <SelectFieldWOFormik
              options={timeFrameOptions}
              value={timeFrameOptions.find(
                (option) => option.value === timeFrame
              )}
              onChange={(e) => {
                // e && setTimeRange(e.value);
                e && setTimeFrame(e.value);
              }}
              id={"timeFrame"} //selectProps={{ isSearchable: false }}
              label="Time frame"
            />
            <SelectFieldWOFormik
              options={chartTypeOptions}
              value={chartTypeOptions.find(
                (option) => option.value === chartType
              )}
              onChange={(e) => {
                e && setChartType(e.value);
              }}
              id={"chartType"} //selectProps={{ isSearchable: false }}
              label="Chart type"
            />
          </div>
        )}
      </div>
      <div className="ChartsContainer">
        <ExpenseChart
          chartData={chartData}
          chartType={chartType}
          timeFrame={timeFrame}
          mobile={mobile}
          toggleHideDataset={toggleHideDataset}
          xAxisKey={xAxisKey_cat}
          datasetsType="categoryDatasets"
        />
        <ExpenseChart
          chartData={chartData}
          chartType={chartType}
          timeFrame={timeFrame}
          mobile={mobile}
          toggleHideDataset={toggleHideDataset}
          xAxisKey={xAxisKey_total}
          datasetsType="totalDatasets"
        />
      </div>
    </div>
  );
};

// const formatXAxis = (value: string, timeframe: string) => {
//   const valueAsDate = new Date(value);
//   console.log(value, valueAsDate);
//   if (timeframe.endsWith("week")) {
//     return `Week ${format(valueAsDate, "I")}`;
//   }
//   if (timeframe.endsWith("month")) {
//     return format(valueAsDate, "MMM yy");
//   }

//   return format(valueAsDate, "dd/MM/yyyy");
// };

const formatXAxis = (value: string, timeFrame: string) => {
  if (!value) return ""; // Handle missing or invalid values
  const date = new Date(value);
  console.log("value", value);
  if (timeFrame === "day") return format(date, "MMM d, yyyy");
  if (timeFrame === "week") return `Week of ${format(date, "MMM d, yyyy")}`;
  if (timeFrame === "month") return format(date, "MMM yyyy");

  return format(date, "yyyy-MM-dd"); // Default
};

const mediaProps = (mobile: boolean) => {
  if (mobile) {
    return {
      tick: { fontSize: mobile ? "0.8em" : "1.2em" },
      dx: -15,
      dy: 15,
      height: 40,
    };
  }
  return {
    tick: { fontSize: mobile ? "0.8em" : "1.2em" },
    dx: -20,
    dy: 20,
    height: 50,
  };
};

const getColor = (i: number): string => {
  const colorArray = [
    "#388dcf",
    "#3c38cf",
    "#9838cf",
    "#cf387f",
    "#cf5138",
    "#cfa338",
    "#a3cf38",
  ];
  let adjustedIndex = i;
  while (adjustedIndex >= colorArray.length) adjustedIndex -= colorArray.length; //smart way is to divide
  return colorArray[adjustedIndex];
};

const ExpenseChart = ({
  chartData,
  chartType,
  xAxisKey,
  timeFrame,
  mobile,
  toggleHideDataset,
  datasetsType,
}: {
  chartData?: ChartData | null;
  chartType: ChartType;
  xAxisKey?: string | number | undefined;
  timeFrame: "day" | "week" | "month";
  mobile: boolean;
  toggleHideDataset: (dataKey: string | number) => void;
  datasetsType: "categoryDatasets" | "totalDatasets";
}) => {
  return (
    <div className="ChartContainer">
      <div className="Container">
        {!chartData ? (
          // <Spinner positionAbsolute />
          <>loading...</>
        ) : (
          <React.Fragment>
            <ResponsiveContainer minHeight={200} height="100%" width="100%">
              {chartType === ChartType.bar ? (
                <BarChart data={chartData.data}>
                  <CartesianGrid strokeDasharray="12 3" vertical={false} />
                  <XAxis
                    dataKey={xAxisKey}
                    // dataKey={"date"}
                    stroke="#333"
                    tickLine={false}
                    axisLine={{ stroke: "#d5d5d5", strokeWidth: 2 }}
                    angle={-45}
                    padding={{ left: 10, right: 25 }}
                    tickFormatter={(value: any) =>
                      formatXAxis(value, timeFrame)
                    }
                    {...mediaProps(mobile)}
                    /* label={{
                  value: "Date",
                  position: "insideBottom",
                  fontSize: "1.2em",
                  fontWeight: 800,
                }} */
                  />
                  <YAxis
                    stroke="#333"
                    axisLine={false}
                    tickLine={false}
                    /* label={{
                  value: "USD",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: "1.2em",
                  fontWeight: 800,
                }} */
                    width={70}
                    tick={{ fontSize: "1.2em" }}
                    tickFormatter={(value: any) =>
                      `${parseFloat(value).toLocaleString("en-US")}${" USD"}`
                    }
                  />
                  {chartData?.[datasetsType]
                    .filter((dataset) => !dataset.bXAxis)
                    .map((dataset, i) => (
                      <Bar
                        key={i}
                        dataKey={dataset.datasetKey}
                        type="monotone"
                        fill={getColor(i)}
                        hide={!dataset.bVisible}
                      />
                    ))}
                </BarChart>
              ) : (
                <LineChart data={chartData.data}>
                  <CartesianGrid strokeDasharray="12 3" vertical={false} />
                  <XAxis
                    dataKey={xAxisKey}
                    // dataKey={"date"}
                    stroke="#333"
                    tickLine={false}
                    axisLine={{ stroke: "#d5d5d5", strokeWidth: 2 }}
                    angle={-45}
                    padding={{ left: 10, right: 25 }}
                    tickFormatter={(value: any) =>
                      formatXAxis(value, timeFrame)
                    }
                    {...mediaProps(mobile)}
                    /* label={{
                  value: "Date",
                  position: "insideBottom",
                  fontSize: "1.2em",
                  fontWeight: 800,
                }} */
                  />
                  <YAxis
                    stroke="#333"
                    axisLine={false}
                    tickLine={false}
                    /* label={{
                  value: "USD",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: "1.2em",
                  fontWeight: 800,
                }} */
                    width={70}
                    tick={{ fontSize: "1.2em" }}
                    tickFormatter={(value: any) =>
                      `${parseFloat(value).toLocaleString("en-US")}${" USD"}`
                    }
                  />
                  {chartData?.[datasetsType]
                    .filter((dataset) => !dataset.bXAxis)
                    .map((dataset, i) => (
                      <Line
                        key={i}
                        type="monotone"
                        dataKey={dataset.datasetKey}
                        stroke={getColor(i)}
                        hide={!dataset.bVisible}
                        dot={{ fill: getColor(i) }}
                      />
                    ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          </React.Fragment>
        )}
      </div>
      {chartData && (
        <React.Fragment>
          <div className="LineToggles">
            {chartData[datasetsType]
              .filter((dataset) => !dataset.bXAxis)
              .map((dataset, i) => (
                <ButtonWOFormik
                  key={i}
                  onClick={() => toggleHideDataset(dataset.datasetKey)}
                  className={!dataset.bVisible ? "Active" : ""}
                  //   css={css`
                  //     background-color: ${lighten(0.2, getColor(i)) + "40"};
                  //     border-color: ${getColor(i)};
                  //     &:before {
                  //       background-color: ${getColor(i)};
                  //     }
                  //   `}
                >
                  {dataset.displayName}
                </ButtonWOFormik>
              ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
