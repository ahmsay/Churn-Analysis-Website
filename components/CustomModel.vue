<template>
  <v-card>
    <v-card-title class="trainamodel white--text">
      <v-icon color="white" class="mr-3">tune</v-icon>
      <span class="title font-weight-light">Custom Model</span>
    </v-card-title>
    <v-card-text>
      <v-select v-model="selectedModel" :items="customModels" item-text="type" label="Select a model type" :menu-props="{ maxHeight: '300' }" return-object></v-select>
      <v-layout row wrap>
        <v-flex class="px-2" :key="opt.name" v-for="(opt, idx) in selectedModel.optionsCat" xs12 sm6 md4>
          <v-select v-model="selectedModel.optionsCat[idx].selected" :items="opt.values" :label="opt.name"></v-select>
        </v-flex>
        <v-flex class="px-2" :key="opt.name" v-for="(opt, idx) in selectedModel.optionsNum" xs12 sm6 md4>
          <v-text-field type="number" :label="opt.name" v-model.number="selectedModel.optionsNum[idx].selected"></v-text-field>
        </v-flex>
      </v-layout>
    </v-card-text>
      <v-layout justify-end align-center class="pr-2 pb-2">
        <span class="error--text" v-if="!filled.value">{{ filled.msg }}</span>
        <v-btn class="mr-0" flat @click="cancel">Cancel</v-btn>
        <v-btn class="trainamodel white--text" @click="apply">Apply</v-btn>
      </v-layout>
  </v-card>
</template>

<script>
  import { EventBus } from "../plugins/event-bus.js";

  export default {
    data:() => ({
      customModels: [
        { type: 'Logistic Regression', optionsCat: [], optionsNum: [] },
        { type: 'KNN', optionsCat: [{ name: 'Metric', values: ['minkowski'], selected: 'minkowski', value: 'metric' }, ], optionsNum: [{ name: 'Neighbours', selected: 3, value: 'numofneighbour' }, { name: 'P', selected: 1, value: 'p' }] },
        { type: 'Naive Bayes', optionsCat: [], optionsNum: [] },
        { type: 'Kernel SVM', optionsCat: [{ name: 'Kernel', values: ['linear', 'poly', 'rbf', 'sigmoid'], selected: 'linear', value: 'kernel' }], optionsNum: [] },
        { type: 'Decision Tree', optionsCat: [{ name: 'Criterion', values: ['gini', 'entropy'], selected: 'gini', value: 'criterion' }], optionsNum: [] },
        { type: 'Random Forest', optionsCat: [{ name: 'Criterion', values: ['gini', 'entropy'], selected: 'gini', value: 'criterion' }], optionsNum: [{ name: 'Estimators', selected: 10, value: 'estimators' }] },
        { type: 'Neural Network', optionsCat: [], optionsNum: [] },
        { type: 'XGBoost', optionsCat: [], optionsNum: [] }
      ],
      selectedModel: { type: 'Logistic Regression', optionsCat: [], optionsNum: [] },
      filled: { msg: '', value: true }
    }),
    methods: {
      cancel() {
        EventBus.$emit('close', 2);
        EventBus.$emit('changed', {}, false);
      },
      apply() {
        let params = {};
        let filled = true;
        params['modelType'] = this.selectedModel.type;
        this.selectedModel.optionsCat.forEach(val => {
          params[val.value] = val.selected;
        });
        this.selectedModel.optionsNum.forEach(val => {
          if (val.selected == null || val.selected === '' || val.selected <= 0 || val.selected % 1 !== 0)
            filled = false;
          params[val.value] = val.selected;
        });
        this.filled.msg = 'Please fill all values properly.';
        this.filled.value = filled;
        if (this.filled.value) {
          this.filled.value = false;
          this.filled.msg = '';
          EventBus.$emit('close', 2);
          EventBus.$emit('changed', params, true);
        }
      }
    }
  }
</script>