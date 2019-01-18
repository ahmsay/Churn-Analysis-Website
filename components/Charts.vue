<template>
	<div>
    <br>
    <v-layout row wrap>
      <v-flex class="px-2" xs12 sm12 md6 :key="chart.name" v-for="(chart, idx) in chartInfos">
        <canvas :id="chart.name+'Chart'"></canvas>
        <v-flex class="py-2">
          <v-layout justify-center>
            <v-btn-toggle mandatory>
              <v-btn @click="createChart(idx, 'bar')" flat>Bar</v-btn>
              <v-btn @click="createChart(idx, 'pie')" flat>Pie</v-btn>
              <v-btn @click="createChart(idx, 'polarArea')" flat>Polar Area</v-btn>
            </v-btn-toggle>
          </v-layout>
        </v-flex>
      </v-flex>
    </v-layout>
	</div>
</template>

<script>
  import Chart from 'chart.js'

  export default {
    mounted() {
      for (let i=0; i<this.chartInfos.length; i++) {
        this.createdCharts.push({});
        this.createChart(i, 'bar');
      }
    },
    data:() => ({
      backgroundColors: ['rgba(244, 83, 66, 1.0)', 'rgba(66, 158, 244, 1.0)', 'rgba(66, 244, 75, 1.0)', 'rgba(235, 244, 66, 1.0)', 'rgba(173, 66, 244, 1.0)', 'rgba(244, 137, 66, 1.0)', 'rgba(65, 244, 196, 1.0)', 'rgba(244, 65, 208, 1.0)'],
      borderColors: ['rgba(244, 83, 66, 1.0)', 'rgba(66, 158, 244, 1.0)', 'rgba(66, 244, 75, 1.0)', 'rgba(235, 244, 66, 1.0)', 'rgba(173, 66, 244, 1.0)', 'rgba(244, 137, 66, 1.0)', 'rgba(65, 244, 196, 1.0)', 'rgba(244, 65, 208, 1.0)'],
      createdCharts: []
    }),
    props: {
      chartInfos: Array
    },
    computed: {

    },
    methods: {
      createChart(idx, type) {
        if(this.createdCharts[idx].ctx != undefined)
          this.createdCharts[idx].destroy();
        let ctx = document.getElementById(this.chartInfos[idx].name+'Chart');
        let chart = new Chart(ctx, {
          type: type,
          data: {
            labels: this.chartInfos[idx].labels,
            datasets: [{
              label: this.chartInfos[idx].name,
              data: this.chartInfos[idx].data,
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
            }
          }
        });
        this.createdCharts[idx] = chart;
      }
    }
  }
</script>