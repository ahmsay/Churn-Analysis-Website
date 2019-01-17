<template>
	<div>
    <v-btn @click="dewit">create</v-btn>
    <canvas id="myChart"></canvas>
	</div>
</template>

<script>
  import Chart from 'chart.js'

  export default {
    mounted() {
      this.dewit();
    },
    data:() => ({

    }),
    props: {

    },
    computed: {

    },
    methods: {
      dewit() {
        var ctx = document.getElementById("myChart");
        // eslint-disable-next-line
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.9)',
                        'rgba(54, 162, 235, 0.9)',
                        'rgba(255, 206, 86, 0.9)',
                        'rgba(75, 192, 192, 0.9)',
                        'rgba(153, 102, 255, 0.9)',
                        'rgba(255, 159, 64, 0.9)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
      }
    }
  }
</script>