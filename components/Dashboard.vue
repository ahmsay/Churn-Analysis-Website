<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm6 md6>
        <v-card flat>
          <v-card-title class="title font-weight-light yourmodels white--text mb-0">
            <v-icon color="white" class="mr-3">library_books</v-icon>
            <span>Your Models</span>
            <v-spacer></v-spacer>
            <v-icon color="white" @click="train">add_circle</v-icon>
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
                    <span>%{{ (model.accuracy * 100).toFixed(2) }}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-btn v-if="showDeleteBtn == idx || ($vuetify.breakpoint.name == 'xs' || $vuetify.breakpoint.name == 'sm')" :loading="loaders.remove && beingRemoved.modelname == model.modelname" :disabled="loaders.remove && beingRemoved.modelname == model.modelname" @click.stop="showDialog(model)" icon flat>
                  <v-icon color="yourmodels">close</v-icon>
                </v-btn>
              </v-list-tile>
            </v-list>
          </v-card-text>
          <v-dialog v-model="dialog" max-width="400px">
            <v-card>
              <v-card-title class="error white--text">
                <v-icon color="white" class="mr-3">delete</v-icon>
                <span class="title font-weight-light">Delete Model</span>
              </v-card-title>
              <v-card-text>
                <span>Delete {{ beingRemoved.modelname }} ?</span>
              </v-card-text>
              <v-layout justify-end class="pr-2 pb-2">
                <v-btn class="mr-0" flat @click="dialog = false">Cancel</v-btn>
                <v-btn class="error white--text" @click="removeModel">Delete</v-btn>
              </v-layout>
            </v-card>
          </v-dialog>
          <v-snackbar v-model="snackbar" top :timeout="3000">
            <span>Model deleted.</span>
            <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
          </v-snackbar>
        </v-card>
      </v-flex>
      <v-flex v-if="false">
        <charts :colInfos="modelCharts" :title="'Model Stats'"></charts>
      </v-flex>
    </v-layout>
    
  </v-container>
</template>

<script>
  import { EventBus } from "../plugins/event-bus.js";
  import Charts from './Charts'

  export default {
    components: {
      'charts': Charts
    },
    data:() => ({
      dialog: false,
      snackbar: false,
      showDeleteBtn: -1,
      beingRemoved: { modelname: '' },
      loaders: {
        remove: false
      }
    }),
    props: {
      models: Array
    },
    computed: {
      modelCharts() {
        let values = [];
        let counts = [];
        this.models.forEach(val => {
          values.push(val.modelname);
        });
        this.models.forEach(val => {
          counts.push((val.accuracy * 100).toFixed(2));
        });
        return [{ name: 'Accuracy', values: values, counts: counts }];
      }
    },
    methods: {
      test() {

      },
      showDialog(model) {
        this.dialog = true;
        this.beingRemoved = model;
      },
      train() {
        EventBus.$emit('train', 1);
      },
      predict(model) {
        EventBus.$emit('predict', model);
      },
      removeModel() {
        this.loaders.remove = true;
        this.dialog = false;
        let model = this.beingRemoved;
        this.$post('/removeModel', { username: this.$session.get('uname'), password: this.$session.get('passw'), modelname: model.modelname }).then(data => {
          this.loaders.remove = false;
          this.beingRemoved = { modelname: '' };
          if (data.info == 1) {
            this.snackbar = true;
            this.models.splice(this.models.indexOf(model), 1);
          }
        });
      }
    }
  }
</script>