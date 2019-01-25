<template>
  <v-container>
    <v-select v-model="selectedModel" :items="models" item-text="name" label="Choose Your Model" :menu-props="{ maxHeight: '400' }" return-object></v-select>
  	<v-card class="mb-4 secondary" v-if="selectedModel.name != undefined">
  	  <v-card-title class="subheading font-weight-bold primary white--text">Single Customer Prediction</v-card-title>
  	  <v-card-text>
        <v-layout row wrap>
          <v-flex class="pr-4" :key="col.options.name" v-for="(col, idx) in catCols" xs12 sm4 md3>
            <v-select v-model="catCols[idx].selected" :items="col.options.values" :label="col.options.name"></v-select>
          </v-flex>
          <v-flex class="pr-4" :key="col.name" v-for="(col, idx) in numCols" xs12 sm4 md3>
            <v-text-field type="number" :label="col.name" v-model.number="numCols[idx].value"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout align-center>
          <v-btn class="primary ml-0" @click="predictSingle">Predict</v-btn>
          <h3>{{ targetCol }}:</h3>
        </v-layout>
        <p class="mb-0 mt-2" v-if="!filled">Please fill all values</p>
  	  </v-card-text>
  	</v-card>
    <v-card class="mb-4 secondary" v-if="selectedModel.name != undefined">
      <v-card-title class="subheading font-weight-bold primary white--text">Multiple Customer Prediction</v-card-title>
      <v-card-text>
        <input type="file" id="file" ref="file" @change="upload"/><br><br>
        <v-btn class="primary ml-0" @click="predictMulti">Predict</v-btn>
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
          return this.selectedModel.targetCol.name;
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
          columns.unshift(this.selectedModel.targetCol.name);
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