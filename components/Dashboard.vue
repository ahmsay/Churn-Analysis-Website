<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm6 md6>
        <v-layout :column="!mobile" wrap>
          <v-flex xs12 sm6 md6>
            <v-card flat>
              <v-card-title class="title font-weight-light welcome white--text mb-0">
                <v-icon color="white" class="mr-3">sentiment_very_satisfied</v-icon>
                <span>Welcome !</span>
              </v-card-title>
              <v-card-text>
                <p>Welcome to Churnify.</p>
                <p>If you are new here, you can navigate to training page to train your first model.</p>
                <p>You can see your trained models in this page.</p>
                <p>In prediction page, you can make single or multiple predictions to see whether your customers will be churned or not.</p>
                <p class="mb-0">You don't need to refresh the page to see your new model.</p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md6>
            <v-card flat>
              <v-card-title class="title font-weight-light statistics white--text mb-0">
                <v-icon color="white" class="mr-3">show_chart</v-icon>
                <span>Statistics</span>
              </v-card-title>
              <v-card-text>
                <ul>
                  <li>You have {{ models.length }} models.</li>
                  <li>{{ successfullModels.length }} of your models have higher than %85 accuracy.</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>

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
            <v-list three-line style="max-height: 498px; overflow-y: auto;" class="py-0">
              <v-list-tile @mouseover="showDeleteBtn = idx" @mouseout="showDeleteBtn = -1" @click="nothing" :key="model.modelname" v-for="(model, idx) in models">
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
                <v-btn class="error white--text" @click="removeModel(beingRemoved)">Delete</v-btn>
              </v-layout>
            </v-card>
          </v-dialog>
          <v-snackbar v-model="snackbar" top :timeout="3000">
            <span>Model deleted.</span>
            <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
          </v-snackbar>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { EventBus } from '../plugins/event-bus.js';
  import db from '../plugins/fb';
  import { storageRef } from '../plugins/fb';

  export default {
    data:() => ({
      dialog: false,
      snackbar: false,
      showDeleteBtn: -1,
      beingRemoved: { modelname: '', id: '' },
      loaders: {
        remove: false
      },
      firstname: '',
      lastname: '',
      email: ''
    }),
    props: {
      models: Array
    },
    computed: {
      mobile() {
        return this.$vuetify.breakpoint.name == 'xs';
      },
      successfullModels() {
        return this.models.filter(m => {
          return m.accuracy > 0.85
        })
      }
    },
    methods: {
      nothing() {

      },
      showDialog(model) {
        this.dialog = true;
        this.beingRemoved = model;
      },
      train() {
        EventBus.$emit('train', 1);
      },
      predict(model) {
        EventBus.$emit('predict', model, 2);
      },
      removeModel(model) {
        this.loaders.remove = true;
        this.dialog = false;
        db.collection('models').doc(model.id).delete().then(() => {
          this.loaders.remove = false;
          this.beingRemoved = { modelname: '', id: '' };
          this.snackbar = true;
        });
        var deletingModel = storageRef.child(model.uid + model.modelname + '.txt');
        deletingModel.delete();
        var deletingScaler = storageRef.child(model.uid + model.modelname + 'scaler' + '.txt');
        deletingScaler.delete();
      }
    }
  }
</script>