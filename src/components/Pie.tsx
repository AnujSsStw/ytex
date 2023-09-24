import { useQuery } from "convex/react";
import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";

const randomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    // fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  let fill = randomColor();

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`PV ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function OverView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    // @ts-ignore
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );
  const { user } = useUser();

  const d = useQuery(
    api.yt.forChart,
    user?.id !== undefined ? { id: user.id } : "skip"
  );

  return (
    <div>
      <PieChart width={500} height={500}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={d!}
          cx={240}
          cy={200}
          innerRadius={90}
          outerRadius={150}
          fill="#8DDFCB"
          dataKey="value"
          onMouseEnter={onPieEnter}
        />
      </PieChart>
    </div>
  );
}
