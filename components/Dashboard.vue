<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm6 md6>
        <v-card>
          <v-card-title class="title font-weight-light yourmodels white--text">Your Models</v-card-title>
          <v-card-text>
            <span v-if="models.length == 0">You don't have any model :(</span>
            <v-list three-line class="pt-0" style="max-height: 360px; overflow-y: auto;">
              <v-list-tile @click="predict(model)" :key="model.modelname" v-for="model in models">
                <v-list-tile-content>
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
              </v-list-tile>
            </v-list>
            <v-btn class="yourmodels white--text mx-0 mb-0" @click="train">Train a new model</v-btn>
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

    }),
    props: ['models'],
    methods: {
      dewit() {
        console.log(1);
      },
      refresh() {
        /*this.$post('/modelList', { username: this.$session.get('uname'), password: this.$session.get('passw') }).then(data => {
          console.log(data);
        });*/
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