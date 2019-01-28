<template>
  <div>
    <dashboard :models="models" v-if="bottomNav == 0"></dashboard>
    <training v-if="bottomNav == 1"></training>
    <prediction :models="models" :passedModel="passedModel" v-if="bottomNav == 2"></prediction>
    <v-btn @click="test">test</v-btn>
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
  import db from '../plugins/fb';

  export default {
    created() {
      if (this.$session.has("uname")) {
        EventBus.$on('train', num => { this.bottomNav = num; });
        EventBus.$on('reset', val => { this.passedModel = val; });
        EventBus.$on('predict', model => {
          this.bottomNav = 2;
          this.passedModel = model;
        });
        this.$post('/modelList', { username: this.$session.get('uname'), password: this.$session.get('passw') }).then(data => {
          this.models = data;
        })
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
      test() {
        const user = {
          username: 'uname',
          password: 'passw',
          email: 'email'
        }
        db.collection('userList').add(user).then(() => {
          console.log('added');
        });
      }
  	},
    components: {
      'dashboard': Dashboard,
      'training': Training,
      'prediction': Prediction
    }
  }
</script>