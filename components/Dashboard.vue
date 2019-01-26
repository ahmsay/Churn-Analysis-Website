<template>
  <v-container>
    <v-card class="secondary">
      <v-card-title class="title font-weight-medium primary white--text">Your Models</v-card-title>
      <v-card-text>
        <v-layout align-center row wrap :key="model.modelname" v-for="model in models">
          <v-flex xs12 sm4 md3><b>Name:</b> {{ model.modelname }}</v-flex>
          <v-flex xs12 sm4 md3><b>Algorithm:</b> {{ model.algorithm }}</v-flex>
          <v-flex xs12 sm4 md3><b>Accuracy:</b> {{ model.accuracy }}</v-flex>
          <v-flex xs12 sm4 md3>
            <v-btn class="primary ml-0" @click="predict(model)">Predict</v-btn>
          </v-flex>
        </v-layout>
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