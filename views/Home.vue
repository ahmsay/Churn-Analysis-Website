<template>
  <div>
    <dashboard :models.sync="models" v-if="bottomNav == 0"></dashboard>
    <training v-if="bottomNav == 1"></training>
    <prediction :models="models" :passedModel="passedModel" v-if="bottomNav == 2"></prediction>
    <v-bottom-nav color="darky" app fixed :active.sync="bottomNav" :value="true">
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
        <v-icon>contact_support</v-icon>
      </v-btn>
    </v-bottom-nav>
  </div>
</template>

<script>
  import Dashboard from '../components/Dashboard';
  import Training from '../components/Training';
  import Prediction from '../components/Prediction';
  import { EventBus } from "../plugins/event-bus.js";
  import db from '../plugins/fb';

  export default {
    components: {
      'dashboard': Dashboard,
      'training': Training,
      'prediction': Prediction
    },
    created() {
      if (this.$session.has("uid")) {
        EventBus.$on('train', num => { this.bottomNav = num; });
        EventBus.$on('reset', model => { this.passedModel = model; });
        EventBus.$on('predict', (model, num) => {
          this.bottomNav = num;
          this.passedModel = model;
        });
        db.collection('models').onSnapshot(snapshot => {
          let changes = snapshot.docChanges();
          changes.forEach(change => {
            if (change.doc.id == this.$session.get('uid')) {
              if (change.type == 'added') {
                this.models = change.doc.data().models;
              } else if (change.type == 'removed') {
                console.log(change.doc.data());
              }
            }
          });
        }, error => {
          console.log(error);
        });
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

  	}
  }
</script>