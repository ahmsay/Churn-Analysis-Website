<template>
  <div class="container">
    <v-card class="mb-5" color="#f5f5f5">
      <v-card-title>Your Models</v-card-title>
      <v-card-text>
        <v-layout align-center row wrap :key="model.name" v-for="model in models">
          <v-flex xs12 sm6 md3><b>Name:</b> {{ model.name }}</v-flex>
          <v-flex xs12 sm6 md3><b>Algorithm:</b> {{ model.algorithm }}</v-flex>
          <v-flex xs12 sm6 md3><b>Accuracy:</b> {{ model.accuracy }}</v-flex>
          <v-flex xs12 sm6 md3>
            <v-btn @click="predict(model.name)">Predict</v-btn>
          </v-flex>
        </v-layout>
        <v-btn @click="train">Train a new model</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import {EventBus} from "../plugins/event-bus.js";

  export default {
    data:() => ({
      
    }),
    props: ['models'],
    methods: {
      train() {
        EventBus.$emit('train', 0);
      },
      predict(name) {
        EventBus.$emit('predict', name);
      }
    }
  }
</script>