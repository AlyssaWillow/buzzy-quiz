import { Component, Input, OnInit } from '@angular/core';
import * as d3 from "d3";
import { PlayDb } from 'src/app/models/play';
import { Players } from 'src/app/models/player-selection';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-ps-wins-by-week',
  templateUrl: './ps-wins-by-week.component.html',
  styleUrls: ['./ps-wins-by-week.component.scss']
})
export class PsWinsByWeekComponent implements OnInit {
  
  plays: PlayDb[] =[];
  players: Players[] =[];

  
  margin = {top: 10, right: 30, bottom: 20, left: 50};
  width = 1500 - this.margin.left - this.margin.right;
  height = 400 - this.margin.top - this.margin.bottom;

// // append the svg object to the body of the page
// svg = d3.select("#my_dataviz")
//   .append("svg")
//     .attr("width", this.width + this.margin.left + this.margin.right)
//     .attr("height", this.height + this.margin.top + this.margin.bottom)
//   .append("g")
//     .attr("transform",`translate(${this.margin.left},${this.margin.top})`);
          
  constructor(private firebaseDataService: FirebaseDataService,
              private utils: UtilsService) { }
  
  ngOnInit(): void {
    this.firebaseDataService.plays$.subscribe(plays => {
      this.plays = plays;
    });
    this.firebaseDataService.players$.subscribe(players => {
      this.players = players;
    });
  }

// Parse the Data
data2 = d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv").then((data: any) => {

const svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", this.width + this.margin.left + this.margin.right)
  .attr("height", this.height + this.margin.top + this.margin.bottom)
.append("g")
  .attr("transform",`translate(${this.margin.left},${this.margin.top})`);
// List of subgroups = header of the csv files = soil condition here
const subgroups = data.columns.slice(1)

// List of groups = species here = value of the first column called group -> I show them on the X axis
const groups = data.map((d: any) => d.group)

console.log(groups)

// Add X axis
const x = d3.scaleBand()
    .domain(groups)
    .range([0, this.width])
    .padding(0.2);

svg.append("g")
  .attr("transform", `translate(0, ${this.height})`)
  .call(d3.axisBottom(x).tickSize(0));

// Add Y axis
const y = d3.scaleLinear()
  .domain([0, 40])
  .range([ this.height, 0 ]);

svg.append("g")
  .call(d3.axisLeft(y));

// Another scale for subgroup position?
const xSubgroup = d3.scaleBand()
  .domain(subgroups)
  .range([0, x.bandwidth()])
  .padding(0.05)

// color palette = one color per subgroup
const color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(['#e41a1c','#377eb8','#4daf4a'])

// Show the bars
svg.append("g")
  .selectAll("g")
  // Enter in data = loop group per group
  .data(data)
  .join("g")
    .attr("transform", (d: any) => `translate(${x(d.group)}, 0)`)
  .selectAll("rect")
  .data((d: any) => { return subgroups.map((key: any) => { return {key: key, value: d[key]}; }); })
  .join("rect")
  // .attr("x", d => xSubgroup(d.key))
  .attr("x", 50)
    .attr("y", (d: any) => y(d.value))
    .attr("width", xSubgroup.bandwidth())
    .attr("height", (d: any) => this.height - y(d.value))
    // .attr("fill", d => color(d.key))
  .attr("fill", '#377eb8')

});


}
