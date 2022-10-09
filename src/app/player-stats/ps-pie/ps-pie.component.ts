import { Component, Input, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-ps-pie',
  templateUrl: './ps-pie.component.html',
  styleUrls: ['./ps-pie.component.scss']
})
export class PsPieComponent implements OnInit {

  @Input('playerDat') data: any;

  // chart = PieChart(this.data, {
  //   name: d => d.name,
  //   value: d => d.value,
  //   width,
  //   height: 500
  // })

  //width = 450;
  // height = 450;
  // margin = 40;
  // radius = Math.min(this.width, this.height) / 2 - this.margin
  // svg = d3.select("#my_dataviz").append("svg")
  // .attr("width", this.width).attr("height", this.height)
  // .append("g").attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

  // data = {a: 9, b: 20, c:30, d:8}
  // color = d3.scaleOrdinal().domain(this.data).range(d3.schemeSet2);

  // pie = d3.pie().value(function(d) {return d.value; })
  // data_ready = this.pie(d3.entries(this.data))

  // arcGenerator = d3.arc().innerRadius(0).outerRadius(this.radius)


  constructor() { }

  ngOnInit(): void {}

//   this.svg
// .selectAll('mySlices')
// .data(this.data_ready)
// .enter()
// .append('path')
// .attr('d', this.arcGenerator)
// .attr('fill', function(d){ return(this.color(d.data.key)) })
// .attr("stroke", "black")
// .style("stroke-width", "2px")
// .style("opacity", 0.7)

// // Now add the annotation. Use the centroid method to get the best coordinates
// this.svg
// .selectAll('mySlices')
// .data(this.data_ready)
// .enter()
// .append('text')
// .text(function(d){ return "grp " + d.data.key})
// .attr("transform", function(d) { return "translate(" + this.arcGenerator.centroid(d) + ")";  })
// .style("text-anchor", "middle")
// .style("font-size", 17)
//   }


// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.


// append the svg object to the div called 'my_dataviz'

// Create dummy data

// Compute the position of each group on the pie:

// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.



}
function PieChart(population: any, arg1: { name: (d: any) => any; value: (d: any) => any; width: any; height: number; }) {
  throw new Error('Function not implemented.');
}

