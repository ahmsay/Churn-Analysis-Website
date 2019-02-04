<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm6 md6>
        <v-card flat>
          <v-card-title class="title font-weight-light yourmodels white--text mb-0">
            <v-icon color="white" class="mr-3">cloud</v-icon>
            <span>Your Models</span>
            <v-btn small absolute fab right @click="train">
              <v-icon color="yourmodels">add</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text v-if="models.length == 0">You don't have any model.</v-card-text>
          <v-card-text class="pa-0">
            <v-list three-line style="max-height: 441px; overflow-y: auto;" class="py-0">
              <v-list-tile @mouseover="showDeleteBtn = idx" @mouseout="showDeleteBtn = -1" @click="test" :key="model.modelname" v-for="(model, idx) in models">
                <v-list-tile-content @click="predict(model)">
                  <v-list-tile-title class="font-weight-medium">{{ model.modelname }}</v-list-tile-title>
                  <v-list-tile-sub-title>
                    <span class="font-weight-medium">Algorithm: </span>
                    <span>{{ model.algorithm }}</span>
                  </v-list-tile-sub-title>
                  <v-list-tile-sub-title>
                    <span class="font-weight-medium">Accuracy: </span>
                    <span>{{ model.accuracy }}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-btn v-if="showDeleteBtn == idx" @click="deleteModel(model)" icon flat>
                  <v-icon color="yourmodels">close</v-icon>
                </v-btn>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { EventBus } from "../plugins/event-bus.js";

  export default {
    data:() => ({
      showDeleteBtn: -1
    }),
    props: {
      models: Array
    },
    methods: {
      train() {
        EventBus.$emit('train', 1);
      },
      test() {

      },
      predict(model) {
        EventBus.$emit('predict', model);
      },
      deleteModel(model) {
        console.log(model);
      }
    }
  }
</script>
