<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title class="title font-weight-medium primary white--text">Select a Model</v-card-title>
      <v-select class="px-3" v-model="selectedModel" :items="models" item-text="modelname" label="Select" :menu-props="{ maxHeight: '400' }" return-object></v-select>
    </v-card>
  	<v-card class="mb-4 secondary" v-if="selectedModel.modelname != undefined">
  	  <v-card-title class="subheading font-weight-bold primary white--text">Single Customer Prediction</v-card-title>
  	  <v-card-text>
        <v-layout row wrap>
          <v-flex class="px-2" :key="col.options.name" v-for="(col, idx) in catCols" xs12 sm4 md3>
            <v-select v-model="catCols[idx].selected" :items="col.options.values" :label="col.options.name"></v-select>
          </v-flex>
          <v-flex class="px-2" :key="col.name" v-for="(col, idx) in numCols" xs12 sm4 md3>
            <v-text-field type="number" :label="col.name" v-model.number="numCols[idx].value"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout align-center>
          <v-btn class="primary ml-0" :loading="loaders.single" :disabled="loaders.single" @click="predictSingle">Predict</v-btn>
          <h3>{{ targetCol }}: {{ result }}</h3>
        </v-layout>
        <p class="mb-0 mt-2" v-if="!filled">Please fill all values</p>
  	  </v-card-text>
  	</v-card>
    <v-card class="mb-4 secondary" v-if="selectedModel.modelname != undefined">
      <v-card-title class="subheading font-weight-bold primary white--text">Multiple Customer Prediction</v-card-title>
      <v-card-text>
        <input type="file" id="file" ref="file" @change="upload"/><br><br>
        <v-btn class="primary ml-0" :loading="loaders.multi" :disabled="loaders.multi" @click="predictMulti">Predict</v-btn>
        <span v-if="!allInfos.valid">{{ allInfos.error }}</span>
      </v-card-text>
    </v-card>
    <datatable v-if="allInfos.dataset.length != 0" :dataset="allInfos.dataset" :columns="allInfos.columns"></datatable>
    <charts v-if="allInfos.chartInfos.length != 0" :chartInfos="allInfos.chartInfos"></charts>
  </v-container>
</template>

<script>
  import { EventBus } from '../plugins/event-bus.js';
  import DataTable from './DataTable';
  import Charts from './Charts';

  export default {
    components: {
      'datatable': DataTable,
      'charts': Charts
    },
    created() {
      this.selectedModel = this.passedModel;
    },
    destroyed() {
      EventBus.$emit('reset', {});
    },
    data:() => ({
      loaders: {
        single: false,
        multi: false
      },
      selectedModel: {},
      allInfos: {
        error: '',
        valid: false,
        fileName: '',
        columns: [],
        dataset: [],
        colInfos: [],
        chartInfos: []
      },
      filled: true,
      predicted: false,
      result : ''
    }),
    props: {
      models: Array,
      passedModel: Object
    },
    computed: {
      catCols() {
        let columns = [];
        if (this.selectedModel.modelname != undefined) {
          this.selectedModel.catCols.forEach(val => {
            columns.push({ options: val, selected: null });
          });
          return columns;
        } else {
          return [];
        }
      },
      numCols() {
        let columns = [];
      	if (this.selectedModel.modelname != undefined) {
          this.selectedModel.numCols.forEach(val => {
            columns.push({ name: val, value: null });
          });
  	      return columns;
      	} else {
      	  return [];
      	}
      },
      targetCol() {
        let column = '';
        if (this.selectedModel.modelname != undefined)
          return this.selectedModel.targetCol.name;
        else
          return column;
      }
    },
    methods: {
      encode(row, idx, len) {
        if (len < 3) {
          row.push(idx);
        } else {
          for(let i=1; i<len; i++) {
            if (i == idx)
              row.push(1);
            else
              row.push(0);
          }
        }
        return row;
      },
      predictSingle() {
        this.loaders.single = true;
        let filled = true;
        for (let i=0; i<this.numCols.length; i++) {
          if (this.numCols[i].value == null || this.numCols[i].value === '')
            filled = false;
        }
        for (let i=0; i<this.catCols.length; i++) {
          if (this.catCols[i].selected == null)
            filled = false;
        }
        this.filled = filled;
        if (this.filled) {
          let row = [];
          this.catCols.forEach(val => {
            let idx = val.options.values.indexOf(val.selected);
            let len = val.options.values.length;
            row = this.encode(row, idx, len);
          });
          this.numCols.forEach(val => { row.push(val.value); });
          this.$post('/predict', { modelname: this.selectedModel.modelname, predictset: [row], username: this.$session.get('uname'), password: this.$session.get('passw') }).then(data => {
            this.result = this.selectedModel.targetCol.values[data.prediction[0]];
            console.log(data);
            this.loaders.single = false;
          });
        }
      },
      upload() {
        this.$parse(this.$refs.file.files[0], 'predict').then(result => { this.allInfos = result; });
        this.predicted = false;
      },
      predictMulti() {
        this.loaders.multi = true;
        let catIndexes = [];
        let numIndexes = [];
        this.selectedModel.catCols.forEach(val => { catIndexes.push(this.allInfos.columns.indexOf(val.name)); });
        this.selectedModel.numCols.forEach(val => { numIndexes.push(this.allInfos.columns.indexOf(val)); });
        let rows = [];
        this.allInfos.dataset.forEach(val => {
          let row = [];
          this.selectedModel.catCols.forEach((col, i) => {
            let idx = col.values.indexOf(val[catIndexes[i]]);
            let len = col.values.length;
            row = this.encode(row, idx, len);
          });
          rows.push(row);
          for(let i=0; i<numIndexes.length; i++) {
            let v = parseFloat(val[numIndexes[i]]);
            row.push(v);
          }
        });
        if(this.allInfos.dataset.length != 0 && !this.predicted) {
          this.$post('/predict', { modelname: this.selectedModel.modelname, predictset: rows, username: this.$session.get('uname'), password: this.$session.get('passw') }).then(data => {
            let results = data.prediction;
            for (let i=0; i<results.length; i++)
              results[i] = this.selectedModel.targetCol.values[data.prediction[i]];
            let columns = this.allInfos.columns;
            let dataset = this.allInfos.dataset;
            columns.unshift(this.selectedModel.targetCol.name+'2');
            for (let i=0; i<dataset.length; i++)
              dataset[i].unshift(results[i]);
            this.allInfos.columns = columns;
            this.allInfos.dataset = dataset;
            this.predicted = true;
            this.loaders.multi = false;
          });
        }
      }
    }
  }
</script>