<template>
  <v-container>
    <v-card class="secondary">
      <v-card-title class="title font-weight-medium primary white--text">Your Models</v-card-title>
      <v-card-text>
        <v-list three-line class="secondary pt-0">
          <v-list-tile @click="predict(model)" :key="model.modelname" v-for="model in models">
            <v-list-tile-content>
              <v-list-tile-title><b>Name:</b> {{ model.modelname }}</v-list-tile-title>
              <v-list-tile-sub-title><b>Algorithm:</b> {{ model.algorithm }}</v-list-tile-sub-title>
              <v-list-tile-sub-title><b>Accuracy:</b> {{ model.accuracy }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-btn class="primary ml-0 mb-0" @click="train">Train a new model</v-btn>
        <v-btn class="primary mb-0" @click="refresh">Refresh</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import { EventBus } from "../plugins/event-bus.js";

  export default {
    data:() => ({

    }),
    props: ['models'],
    methods: {
      refresh() {
        this.$post('/modelList', { username: this.$session.get('uname'), password: this.$session.get('passw') }).then(data => {
          console.log(data);
        });
      },
      train() {
        EventBus.$emit('train', 1);
      },
      predict(model) {
        EventBus.$emit('predict', model);
      }
    }
  }
</script>