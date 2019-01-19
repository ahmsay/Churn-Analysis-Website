<template>
  <div>
    <training v-if="bottomNav == 0"></training>
    <prediction :models="models" :passedModel="passedModel" v-if="bottomNav == 1"></prediction>
    <models :models="models" v-if="bottomNav == 2"></models>
    <v-bottom-nav fixed :active.sync="bottomNav" :value="true">
      <v-btn>
        <span>Training</span>
        <v-icon>ondemand_video</v-icon>
      </v-btn>
      <v-btn>
        <span>Prediction</span>
        <v-icon>music_note</v-icon>
      </v-btn>
      <v-btn>
        <span>My Models</span>
        <v-icon>book</v-icon>
      </v-btn>
    </v-bottom-nav>
  </div>
</template>

<script>
  import Training from '../components/Training'
  import Prediction from '../components/Prediction'
  import Models from '../components/Models'
  import {EventBus} from "../plugins/event-bus.js";

  export default {
    created() {
      if (this.$session.has("user")) {
        EventBus.$on('train', num => { this.bottomNav = num; });
        EventBus.$on('reset', val => { this.passedModel = val; });
        EventBus.$on('predict', model => {
          this.bottomNav = 1;
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
      'training': Training,
      'prediction': Prediction,
      'models': Models
    }
  }
</script>