<template>
	<div>
    <br>
    <v-layout row wrap>
      <v-flex class="px-2" xs12 sm12 md6 :key="chart.name" v-for="chart in chartInfos">
        <canvas :id="chart.name"></canvas>
      </v-flex>
    </v-layout>
	</div>
</template>

<script>
  import Chart from 'chart.js'

  export default {
    mounted() {
      this.dewit();
    },
    data:() => ({
      chartInfos: [
        { name: 'Geography', type: 'pie', labels: ['France', 'Germany', 'Spain'], data: [5014, 2509, 2477], backgroundColor: ['rgba(255, 99, 132, 0.9)', 'rgba(54, 162, 235, 0.9)', 'rgba(255, 206, 86, 0.9)'], borderColor: ['rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'] },
        { name: 'Gender', type: 'bar', labels: ['Female', 'Male'], data: [4543, 5457], backgroundColor: ['rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.9)'], borderColor: ['rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)'] }
      ]
    }),
    props: {

    },
    computed: {

    },
    methods: {
      dewit() {
        for (let i=0; i<this.chartInfos.length; i++) {
          let ctx = document.getElementById(this.chartInfos[i].name);
          // eslint-disable-next-line
          let chart = new Chart(ctx, {
              type: this.chartInfos[i].type,
              data: {
                  labels: this.chartInfos[i].labels,
                  datasets: [{
                      label: this.chartInfos[i].name,
                      data: this.chartInfos[i].data,
                      backgroundColor: this.chartInfos[i].backgroundColor,
                      borderColor: this.chartInfos[i].borderColor,
                      borderWidth: 1
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
        }
      }
    }
  }
</script>