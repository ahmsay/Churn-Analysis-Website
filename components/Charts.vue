<template>
  <v-card>
    <v-card-title class="title font-weight-light charts white--text">
      <v-icon color="white" class="mr-3">insert_chart</v-icon>
      <span>Charts</span>
      <v-spacer></v-spacer>
      <v-icon color="white" @click="close">close</v-icon>
    </v-card-title>
    <v-layout row wrap>
      <v-flex xs12 sm6 md6 :key="chart.name" v-for="(chart, idx) in availableCharts">
        <v-card flat>
          <v-card-title class="title font-weight-light justify-center">{{ chart.name }}</v-card-title>
          <v-card-text>
            <canvas :id="chart.name+'Chart'"></canvas>
            <v-flex>
              <v-layout justify-center>
                <v-btn icon @click="iterate(-1, idx)"><v-icon color="charts" large>chevron_left</v-icon></v-btn>
                <v-btn icon @click="iterate(1, idx)"><v-icon color="charts" large>chevron_right</v-icon></v-btn>
              </v-layout>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
  import Chart from 'chart.js';
  import { EventBus } from '../plugins/event-bus.js';

  export default {
    mounted() {
      for (let i=0; i<this.availableCharts.length; i++) {
        this.createdCharts.push({ canvas: {}, displayer: 0 });
        this.createChart(i, 'bar');
      }
    },
    data:() => ({
      backgroundColors: ['rgba(244, 83, 66, 0.8)', 'rgba(66, 158, 244, 0.8)', 'rgba(66, 244, 75, 0.8)', 'rgba(235, 244, 66, 0.8)', 'rgba(173, 66, 244, 0.8)', 'rgba(244, 137, 66, 0.8)', 'rgba(65, 244, 196, 0.8)', 'rgba(244, 65, 208, 0.8)'],
      borderColors: ['rgba(244, 83, 66, 1.0)', 'rgba(66, 158, 244, 1.0)', 'rgba(66, 244, 75, 1.0)', 'rgba(235, 244, 66, 1.0)', 'rgba(173, 66, 244, 1.0)', 'rgba(244, 137, 66, 1.0)', 'rgba(65, 244, 196, 1.0)', 'rgba(244, 65, 208, 1.0)'],
      createdCharts: [],
      chartTypes: ['bar', 'pie', 'polarArea']
    }),
    props: {
      colInfos: Array,
      color: String
    },
    computed: {
      availableCharts() {
        return this.colInfos.filter(c => {return c.values.length <= 8})
      }
    },
    methods: {
      createChart(idx, type) {
        if(this.createdCharts[idx].canvas.ctx != undefined)
          this.createdCharts[idx].canvas.destroy();
        let ctx = document.getElementById(this.availableCharts[idx].name+'Chart');
        let chart = new Chart(ctx, {
          type: type,
          data: {
            labels: this.availableCharts[idx].values,
            datasets: [{
              label: this.availableCharts[idx].name,
              data: this.availableCharts[idx].counts,
              backgroundColor: this.backgroundColors,
              borderColor: this.borderColors,
              borderWidth: 0
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
            legend: {
              display: type == 'bar' ? false : true
            }
          }
        });
        this.createdCharts[idx].canvas = chart;
      },
      iterate(num, idx) {
        this.createdCharts[idx].displayer += num;
        if (this.createdCharts[idx].displayer == this.chartTypes.length)
          this.createdCharts[idx].displayer = 0;
        else if (this.createdCharts[idx].displayer == -1)
          this.createdCharts[idx].displayer = this.chartTypes.length -1;
        this.createChart(idx, this.chartTypes[this.createdCharts[idx].displayer]);
      },
      close() {
        EventBus.$emit('close', 1);
      }
    }
  }
</script>