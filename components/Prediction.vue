<template>
  <div class="container">
  	<v-select v-model="modelName" :items="modelList" label="Choose Your Model"></v-select>
  	<v-card v-if="model!=''" class="mb-5" color="#f5f5f5">
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
        <v-btn @click="predictSingle">Predict</v-btn>
        <span v-if="!filled">{{ filledError }}</span>
  	  </v-card-text>
  	</v-card>
    <v-card v-if="model!=''" class="mb-5" color="#f5f5f5">
      <v-card-title>Multi Customer Prediction</v-card-title>
      <v-card-text>
        <input type="file" id="file" ref="file" @change="upload"/><br><br>
        <p v-if="!allInfos.valid">{{ allInfos.error }}</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import {EventBus} from '../plugins/event-bus.js';

  export default {
    destroyed() {
      EventBus.$emit('reset', '');
    },
    data:() => ({
      modelName: '',
      allInfos: {
        error: '',
        valid: false,
        fileName: '',
        columns: [],
        dataset: [],
        colInfos: []
      },
      filled: false,
      filledError: ''
    }),
    props: {
      models: Array,
      passedModel: String
    },
    computed: {
      model() {
        if (this.passedModel != '' && this.modelName == '')
          // eslint-disable-next-line
          this.modelName = this.passedModel;
        return this.modelName;
      },
      modelList() {
      	let modelList = [];
      	this.models.forEach(val => {
      	  modelList.push(val.name);
      	});
      	return modelList;
      },
      catCols() {
        let columns = [];
        if (this.model != '') {
          let idx = this.modelList.indexOf(this.model);
          this.models[idx].catCols.forEach(val => {
            columns.push({ options: val, selected: null });
          });
          return columns;
        } else {
          return [];
        }
      },
      numCols() {
        let columns = [];
      	if (this.model != '') {
  	      let idx = this.modelList.indexOf(this.model);
          this.models[idx].numCols.forEach(val => {
            columns.push({ name: val, value: null });
          });
  	      return columns;
      	} else {
      	  return [];
      	}
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
        } else {
          this.filledError = 'Please fill all values';
        }
      },
      upload() {
        this.$parse(this.$refs.file.files[0], 'predict').then(result => { this.allInfos = result; });
      }
    }
  }
</script>