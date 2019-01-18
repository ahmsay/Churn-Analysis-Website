<template>
	<div>
    <br>
    <v-layout row wrap>
      <v-flex class="px-2" xs12 sm12 md6 :key="chart.name" v-for="(chart, idx) in chartInfos">
        <canvas :id="chart.name+'Chart'"></canvas>
        <v-btn @click="createChart(idx, 'pie')">test</v-btn>
      </v-flex>
    </v-layout>
	</div>
</template>

<script>
  import Chart from 'chart.js'

  export default {
    mounted() {
      for (let i=0; i<this.chartInfos.length; i++) {
        this.createChart(i, 'bar');
      }
    },
    data:() => ({
      backgroundColors: ['rgba(244, 83, 66, 1.0)', 'rgba(66, 158, 244, 1.0)', 'rgba(66, 244, 75, 1.0)', 'rgba(235, 244, 66, 1.0)', 'rgba(173, 66, 244, 1.0)', 'rgba(244, 137, 66, 1.0)', 'rgba(65, 244, 196, 1.0)', 'rgba(244, 65, 208, 1.0)'],
      borderColors: ['rgba(244, 83, 66, 1.0)', 'rgba(66, 158, 244, 1.0)', 'rgba(66, 244, 75, 1.0)', 'rgba(235, 244, 66, 1.0)', 'rgba(173, 66, 244, 1.0)', 'rgba(244, 137, 66, 1.0)', 'rgba(65, 244, 196, 1.0)', 'rgba(244, 65, 208, 1.0)'],
      chartInfos: [
        { name: 'Geography', labels: ['France', 'Germany', 'Spain'], data: [5014, 2509, 2477] },
        { name: 'Gender', labels: ['Female', 'Male'], data: [4543, 5457] }
      ],
      createdCharts: []
    }),
    props: {

    },
    computed: {

    },
    methods: {
      createChart(idx, type) {
        let ctx = document.getElementById(this.chartInfos[idx].name+'Chart');
        // eslint-disable-next-line
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
              legend: {

              },
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              }
            }
        });
        this.createdCharts.push(chart);
        console.log(this.createdCharts);
      }
    }
  }
</script>