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
import { SelectFieldWOFormik } from "./helpers/SelectFieldWOFormik";
import {
  isSameDay,
  isWithinInterval,
  addDays,
  startOfWeek,
  isSameMonth,
} from "date-fns";
import { useFilteredExpenses } from "../hooks/useFilteredExpenses";
import { useChartData } from "../hooks/useChartData";
import ExpenseSummary from "./ExpenseSummary";
type Props = {
  chartName: string;
};

enum ChartType {
  line = "line",
  bar = "bar",
}

type TDataset<T = { [k: string]: any }> = {
  datasetKey: keyof T;
  displayName: string;
  bXAxis: boolean;
  bVisible: boolean;
  total?: number;
};
type ChartData<T = { [k: string]: any }> = {
  data: T[];
  //   categoryDatasets: TDataset<T>[];
  //   totalDatasets: TDataset<T>[];
  datasets: {
    categoryDatasets: TDataset<T>[];
    totalDatasets: TDataset<T>[];
  };
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
  const { startDate, endDate, expenses, categoryFilter } = state;

  const [timeFrame, setTimeFrame] = useState<"day" | "week" | "month">("day"); // Time frame filter
  const [chartType, setChartType] = useState<ChartType>(ChartType.line);

  const filteredExpenses = useFilteredExpenses(
    expenses,
    startDate,
    endDate,
    categoryFilter
  );

  const derivedChartData = useChartData(filteredExpenses, timeFrame);
  const { data, datasets, groupedExpenses } = derivedChartData;

  useMemo(() => {
    setChartData({ data, datasets });
    console.log("darived date", derivedChartData);
  }, [derivedChartData]);

  const toggleHideDataset = useCallback((dataKey: string | number) => {
    setChartData((curr) => {
      if (!curr) return null;
      return {
        ...curr,
        datasets: {
          ...curr.datasets,
          categoryDatasets: curr.datasets?.categoryDatasets?.map((dataset) =>
            dataset.datasetKey === dataKey
              ? { ...dataset, bVisible: !dataset.bVisible }
              : dataset
          ),
          totalDatasets: curr.datasets?.totalDatasets?.map((dataset) =>
            dataset.datasetKey === dataKey
              ? { ...dataset, bVisible: !dataset.bVisible }
              : dataset
          ),
        },
      };
    });
  }, []);

  const mobile = useMedia({ maxWidth: 768 });

  const xAxisKey_total = chartData?.datasets?.["totalDatasets"]?.find(
    (set) => set.bXAxis
  )?.datasetKey;

  const xAxisKey_cat = chartData?.datasets?.["categoryDatasets"]?.find(
    (set) => set.bXAxis
  )?.datasetKey;

  return (
    <>
      <div className="DashboardCharts">
        <div className="DashboardHeader">
          <h3>{chartName}</h3>
          {chartData && (
            <div className="ChartSelections">
              <SelectFieldWOFormik
                options={timeFrameOptions}
                value={
                  timeFrameOptions.find((option) => option.value === timeFrame)
                    ?.value
                }
                onChange={(e: any) => {
                  // e && setTimeFrame(e.value);
                  e && setTimeFrame(e.target?.value);
                }}
                id={"timeFrame"} //selectProps={{ isSearchable: false }}
                label="Time frame"
              />
              <SelectFieldWOFormik
                options={chartTypeOptions}
                value={
                  chartTypeOptions.find((option) => option.value === chartType)
                    ?.value
                }
                onChange={(e: any) => {
                  console.log("chart type", e.value, e.target.value);
                  // e && setChartType(e.value);
                  e && setChartType(e.target?.value);
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
            classname="SpendingBreakdown"
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
      <ExpenseSummary
        groupedExpenses={groupedExpenses}
        filteredExpenses={filteredExpenses}
        timeFrame={timeFrame}
      />
    </>
  );
};

const formatXAxis = (value: string, timeFrame: string) => {
  if (!value) return ""; // handle missing or invalid values
  const date = new Date(value);
  console.log("value", value);
  if (timeFrame === "day") return format(date, "MMM d, yyyy");
  if (timeFrame === "week") return `${format(date, "MMM d, yyyy")}`;
  if (timeFrame === "month") return format(date, "MMM yyyy");

  return format(date, "yyyy-MM-dd"); // default
};

const mediaProps = (mobile: boolean) => {
  if (mobile) {
    return {
      tick: { fontSize: mobile ? "0.6em" : "0.9em" },
      dx: -15,
      dy: 15,
      height: 40,
    };
  }
  return {
    tick: { fontSize: mobile ? "0.6em" : "0.9em" },
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
  while (adjustedIndex >= colorArray.length) adjustedIndex -= colorArray.length;
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
  classname,
}: {
  chartData?: ChartData | null;
  chartType: ChartType;
  xAxisKey?: string | number | undefined;
  timeFrame: "day" | "week" | "month";
  mobile: boolean;
  toggleHideDataset: (dataKey: string | number) => void;
  datasetsType: "categoryDatasets" | "totalDatasets";
  classname?: string;
}) => {
  return (
    <>
      <div className={`ChartContainer ${classname}`}>
        <div className="Container">
          {!chartData ? (
            // <Spinner positionAbsolute />
            <>Loading...</>
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
                      angle={-27}
                      padding={{ left: 40, right: 40 }}
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
                  value: "GBP",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: "1.2em",
                  fontWeight: 800,
                }} */
                      width={60} //{50} //{70}
                      tick={{ fontSize: "0.9em" }}
                      tickFormatter={(value: any) =>
                        `£${parseFloat(value).toLocaleString("en-UK")}`
                      }
                    />
                    {chartData?.datasets?.[datasetsType]
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
                      angle={-27}
                      padding={{ left: 40, right: 40 }}
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
                  value: "GBP",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: "1.2em",
                  fontWeight: 800,
                }} */
                      width={60} //{55}
                      // height={800}
                      tick={{ fontSize: "0.9em" }}
                      tickFormatter={(value: any) =>
                        `£${parseFloat(value).toLocaleString("en-UK")}`
                      }
                    />
                    {chartData?.datasets?.[datasetsType]
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
              {chartData.datasets[datasetsType]
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
                    size="small"
                    variant="outlined"
                  >
                    {dataset.displayName}
                  </ButtonWOFormik>
                ))}
            </div>
            <p style={{ fontSize: "9px", float: "inline-end" }}>
              Toggle the tab(s) to hide or view the trend
            </p>
          </React.Fragment>
        )}
      </div>
    </>
  );
};
