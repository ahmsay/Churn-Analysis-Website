<template>
  <div class="container">
    <h2>Prediction</h2>
    <v-select v-model="selectedModel" :items="models" item-text="name" label="Choose Your Model" return-object></v-select>
  	<v-card v-if="selectedModel.name != undefined" class="mb-5" color="#f5f5f5">
  	  <v-card-title>Single Customer Prediction</v-card-title>
  	  <v-card-text>
        <v-layout row wrap>
          <v-flex class="px-2" :key="col.options.name" v-for="(col, idx) in catCols" xs12 sm6 md3>
            <v-select v-model="catCols[idx].selected" :items="col.options.values" :label="col.options.name"></v-select>
          </v-flex>
          <v-flex class="px-2" :key="col.name" v-for="(col, idx) in numCols" xs12 sm6 md3>
            <v-text-field type="number" :label="col.name" v-model.number="numCols[idx].value"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout align-center>
          <v-btn @click="predictSingle">Predict</v-btn>
          <h3>{{ targetCol }}:</h3>
        </v-layout>
        <span v-if="!filled">Please fill all values</span>
  	  </v-card-text>
  	</v-card>
    <v-card v-if="selectedModel.name != undefined" class="mb-5" color="#f5f5f5">
      <v-card-title>Multi Customer Prediction</v-card-title>
      <v-card-text>
        <input type="file" id="file" ref="file" @change="upload"/><br><br>
        <v-btn @click="predictMulti">Predict</v-btn>
        <p v-if="!allInfos.valid">{{ allInfos.error }}</p>
      </v-card-text>
    </v-card>
    <datatable v-if="allInfos.dataset.length != 0" :dataset="allInfos.dataset" :columns="allInfos.columns"></datatable>
    <charts v-if="allInfos.chartInfos.length != 0" :chartInfos="allInfos.chartInfos"></charts>
  </div>
</template>

<script>
  import {EventBus} from '../plugins/event-bus.js';
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
      predicted: false
    }),
    props: {
      models: Array,
      passedModel: Object
    },
    computed: {
      catCols() {
        let columns = [];
        if (this.selectedModel.name != undefined) {
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
      	if (this.selectedModel.name != undefined) {
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
        if (this.selectedModel.name != undefined)
          return this.selectedModel.targetCol;
        else
          return column;
      }
    },
    methods: {
      predictSingle() {
        let filled = true;
        for (let i=0; i<this.numCols.length; i++) {
          if (this.numCols[i].value == null || this.numCols[i].value == '')
            filled = false;
        }
        for (let i=0; i<this.catCols.length; i++) {
          if (this.catCols[i].selected == null)
            filled = false;
        }
        this.filled = filled;
        if (this.filled) {
          let values = [];
          this.catCols.forEach(val => {
            values.push(val.selected);
          });
          this.numCols.forEach(val => {
            values.push(val.value);
          })
          console.log(values);
        }
      },
      upload() {
        this.$parse(this.$refs.file.files[0], 'predict').then(result => { this.allInfos = result; });
        this.predicted = false;
      },
      predictMulti() {
        if(this.allInfos.dataset.length != 0 && !this.predicted) {
          let results = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1];
          let columns = this.allInfos.columns;
          let dataset = this.allInfos.dataset;
          columns.unshift(this.selectedModel.targetCol);
          for (let i=0; i<dataset.length; i++)
            dataset[i].unshift(results[i]);
          this.allInfos.columns = columns;
          this.allInfos.dataset = dataset;
          this.predicted = true;
        }
      }
    }
  }
</script>