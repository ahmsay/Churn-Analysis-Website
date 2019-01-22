<template>
  <div class="container">
    <v-card color="#f5f5f5">
      <v-card-title class="title font-weight-medium">Your Models</v-card-title>
      <v-card-text>
        <v-layout align-center row wrap :key="model.name" v-for="model in models">
          <v-flex xs12 sm4 md3><b>Name:</b> {{ model.name }}</v-flex>
          <v-flex xs12 sm4 md3><b>Algorithm:</b> {{ model.algorithm }}</v-flex>
          <v-flex xs12 sm4 md3><b>Accuracy:</b> {{ model.accuracy }}</v-flex>
          <v-flex xs12 sm4 md3>
            <v-btn class="primary ml-0" @click="predict(model)">Predict</v-btn>
          </v-flex>
        </v-layout>
        <v-btn class="primary ml-0" @click="train">Train a new model</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import { EventBus } from "../plugins/event-bus.js";

  export default {
    data:() => ({
      
    }),
    props: ['models'],
    methods: {
      train() {
        EventBus.$emit('train', 1);
      },
      predict(model) {
        EventBus.$emit('predict', model);
      }
    }
  }
</script>