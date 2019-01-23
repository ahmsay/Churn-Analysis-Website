<template>
  <div>
    <dashboard :models="models" v-if="bottomNav == 0"></dashboard>
    <training v-if="bottomNav == 1"></training>
    <prediction :models="models" :passedModel="passedModel" v-if="bottomNav == 2"></prediction>
    <v-bottom-nav class="primary" app fixed :active.sync="bottomNav" :value="true">
      <v-btn dark>
        <span>Dashboard</span>
        <v-icon>dashboard</v-icon>
      </v-btn>
      <v-btn dark>
        <span>Training</span>
        <v-icon>school</v-icon>
      </v-btn>
      <v-btn dark>
        <span>Prediction</span>
        <v-icon>not_listed_location</v-icon>
      </v-btn>
    </v-bottom-nav>
  </div>
</template>

<script>
  import Dashboard from '../components/Dashboard';
  import Training from '../components/Training';
  import Prediction from '../components/Prediction';
  import {EventBus} from "../plugins/event-bus.js";

  export default {
    created() {
      if (this.$session.has("uname")) {
        EventBus.$on('train', num => { this.bottomNav = num; });
        EventBus.$on('reset', val => { this.passedModel = val; });
        EventBus.$on('predict', model => {
          this.bottomNav = 2;
          this.passedModel = model;
        });
        this.models = [
          {
            name: 'bankmodel',
            catCols: [
              { name: 'Geography', values: ['France', 'Germany', 'Spain'] },
              { name: 'Gender', values: ['Female', 'Male']}
            ],
            numCols: ['CreditScore', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'HasCrCard', 'IsActiveMember', 'EstimatedSalary'],
            targetCol: 'Exited',
            algorithm: 'Neural Networks',
            accuracy: '84.38'
          },
          {
            name: 'telcoModel',
            catCols: [

            ],
            numCols: ['CreditScore', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'HasCrCard', 'IsActiveMember', 'EstimatedSalary'],
            targetCol: 'Churn',
            algorithm: 'KNN',
            accuracy: '81.53'
          }
        ]
      } else {
        this.$router.push('/');
      }
    },
  	data:() => ({
      bottomNav: 0,
      models: [],
      passedModel: {}
  	}),
  	methods: {

  	},
    components: {
      'dashboard': Dashboard,
      'training': Training,
      'prediction': Prediction
    }
  }
</script>