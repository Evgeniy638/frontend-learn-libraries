import React, { FC, useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { TLineProps } from "./types";
import { dataFrequencyOfLettersFromFile } from "../../data/frequency-of-letters";

interface DataPoint {
  letter: string;
  frequency: number;
}

const data = dataFrequencyOfLettersFromFile.sort((a, b) => b.frequency - a.frequency)

export const Line: FC<TLineProps> = ({
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20
}) => {
  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);

  console.log('groupSort', d3.groupSort(data, ([d]) => -d.frequency, (d) => d.letter))
  console.log('group', d3.group(data, (d) => d.letter))

  const xScale = d3.scaleBand()
    .domain(data.map(({ letter }) => letter))
    .range([marginLeft, width - marginRight]) ;
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.frequency) || 0])
    .range([height - marginBottom, marginTop]);
  const line = d3.line<DataPoint>()
    .x((d, i) => xScale(d.letter)!)
    .y((d) => yScale(d.frequency));

  useEffect(() => {
    // @ts-ignore
    d3.select(gx.current).call(d3.axisBottom(xScale))
  }, [gx, xScale]);
  useEffect(() => {
    // @ts-ignore
    d3.select(gy.current).call(d3.axisLeft(yScale))
  }, [gy, yScale]);

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path fill="none" stroke="currentColor" stroke-width="1.5" d={line(data) || undefined} />
      <g fill="white" stroke="currentColor" stroke-width="1.5">
        {dataFrequencyOfLettersFromFile.map((d, i) => (<circle key={d.letter} cx={xScale(d.letter)} cy={yScale(d.frequency)} r="2.5" />))}
      </g>
    </svg>
  );
}
