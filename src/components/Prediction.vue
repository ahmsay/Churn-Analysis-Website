<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12>
        <v-card flat>
          <v-card-title class="title font-weight-light selectamodel white--text">
            <v-icon color="white" class="mr-3">gps_fixed</v-icon>
            <span>Select a Model</span>
          </v-card-title>
          <v-select @change="refresh" class="px-3" v-model="selectedModel" :items="models" item-text="modelname" label="Select" :menu-props="{ maxHeight: '400' }" return-object></v-select>
        </v-card>
      </v-flex>

      <v-flex xs12 sm8 md8 d-flex>
        <v-card v-if="selectedModel.modelname != undefined" flat>
          <v-card-title class="title font-weight-light singlepred white--text">
            <v-icon color="white" class="mr-3">person</v-icon>
            <span>Single Prediction</span>
          </v-card-title>
          <v-card-text style="max-height: 293px; overflow-y: auto;">
            <v-layout row wrap>
              <v-flex class="px-2" :key="col.options.name" v-for="(col, idx) in catCols" xs12 sm6 md4>
                <v-select v-model="catCols[idx].selected" :items="col.options.values" :label="col.options.name"></v-select>
              </v-flex>
              <v-flex class="px-2" :key="col.name" v-for="(col, idx) in numCols" xs12 sm6 md4>
                <v-text-field type="number" :label="col.name" v-model.number="numCols[idx].value" @keydown.enter="predictSingle"></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <v-layout align-center>
              <v-btn class="singlepred white--text ml-1" :loading="loaders.single" :disabled="loaders.single" @click="predictSingle">Predict</v-btn>
              <span class="subheading font-weight-medium">{{ targetCol }}: </span>
              <v-chip v-if="result !== ''" disabled class="singlepred white--text">{{ result }}</v-chip>
              <span class="ml-2 error--text" v-if="!filled.value">{{ filled.msg }}</span>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm4 md4 d-flex>
        <v-card v-if="selectedModel.modelname != undefined" flat>
          <v-card-title class="title font-weight-light multipred white--text">
            <v-icon color="white" class="mr-3">group</v-icon>
            <span>Multiple Prediction</span>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs6 sm12 md6>
                <upload-btn v-if="!loaders.upload" block class="px-0 white--text" color="multipred" :ripple="false" :fileChangedCallback="upload"></upload-btn>
                <v-btn v-if="loaders.upload" block :disabled="true" :loading="true">Upload</v-btn>
              </v-flex>

              <v-flex xs6 sm12 md6 v-if="allInfos.valid">
                <v-btn block class="multipred white--text mb-1" :loading="loaders.multi" :disabled="loaders.multi" @click="predictMulti">Predict</v-btn>
              </v-flex>

              <v-flex xs12 sm12 md12 class="py-0" v-if="!allInfos.valid">
                <p class="mb-0 error--text">{{ allInfos.error }}</p>
              </v-flex>

              <v-flex xs12 sm12 md12 v-if="allInfos.valid">
                <v-card flat ripple color="datatable" @click.stop="dialogs[0].show = true" style="cursor: pointer">
                  <v-card-title class="title font-weight-light white--text">
                    <v-icon color="white" class="mr-3">table_chart</v-icon>
                    <span>Data Table</span>
                  </v-card-title>
                  <v-dialog v-model="dialogs[0].show" max-width="1250px">
                    <datatable :dataset="allInfos.dataset" :columns="allInfos.columns"></datatable>
                  </v-dialog>
                </v-card>
              </v-flex>

              <v-flex xs12 sm12 md12 v-if="allInfos.valid">
                <v-card flat ripple color="charts" @click.stop="dialogs[1].show = true" style="cursor: pointer">
                  <v-card-title class="title font-weight-light white--text">
                    <v-icon color="white" class="mr-3">insert_chart</v-icon>
                    <span>Charts</span>
                  </v-card-title>
                  <v-dialog v-model="dialogs[1].show" max-width="1250px">
                    <charts :colInfos="allInfos.colInfos" :title="'Charts'"></charts>
                  </v-dialog>
                </v-card>
              </v-flex>

              <v-flex xs12 sm12 md12 v-if="predicted">
                <v-btn class="multipred white--text" block @click="save" :loading="loaders.save" :disabled="loaders.save">Save</v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { EventBus } from '../plugins/event-bus.js';
  import DataTable from './DataTable';
  import Charts from './Charts';
  import UploadButton from 'vuetify-upload-button';
  import XLSX from 'xlsx';
  import saveAs from 'file-saver';

  export default {
    components: {
      'datatable': DataTable,
      'charts': Charts,
      'upload-btn': UploadButton
    },
    created() {
      this.selectedModel = this.passedModel;
      EventBus.$on('close', val => { this.dialogs[val].show = false; });
    },
    destroyed() {
      EventBus.$emit('reset', {});
    },
    data:() => ({
      dialogs: [{ show: false }, { show: false }],
      loaders: {
        single: false,
        multi: false,
        upload: false,
        save: false
      },
      selectedModel: {},
      allInfos: {
        error: '',
        valid: false,
        fileName: '',
        columns: [],
        dataset: [],
        colInfos: []
      },
      filled: { msg: '', value: true },
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
        }
        return columns;
      },
      numCols() {
        let columns = [];
      	if (this.selectedModel.modelname != undefined) {
          this.selectedModel.numCols.forEach(val => {
            columns.push({ name: val, value: null });
          });
        }
        return columns;
      },
      targetCol() {
        let column = '';
        if (this.selectedModel.modelname != undefined)
          column = this.selectedModel.targetCol.name;
        return column;
      }
    },
    methods: {
      refresh() {
        this.allInfos = {
          error: '',
          valid: false,
          fileName: '',
          columns: [],
          dataset: [],
          colInfos: []
        }
        this.filled.value = true;
        this.predicted = false;
        this.result = '';
      },
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
        if (!this.loaders.single) {
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
          this.filled.msg = 'Please fill all values properly.';
          this.filled.value = filled;
          if (this.filled.value) {
            let row = [];
            this.catCols.forEach(val => {
              let idx = val.options.values.indexOf(val.selected);
              let len = val.options.values.length;
              row = this.encode(row, idx, len);
            });
            this.numCols.forEach(val => { row.push(val.value); });
            this.$post('/predict', { modelname: this.selectedModel.modelname, predictset: [row], uid: this.$session.get('uid') }).then(data => {
              this.loaders.single = false;
              if (data.info == 1) {
                this.result = this.selectedModel.targetCol.values[data.prediction[0]];
              } else if (data.info == 0) {
                this.filled.msg = 'You have reached your limit.';
                this.filled.value = false;
              } else if (data.info == -1) {
                this.filled.msg = 'Server error.';
                this.filled.value = false;
              }
            });
          } else {
            this.loaders.single = false;
          }
        }
      },
      upload(file) {
        this.loaders.upload = true;
        this.allInfos.valid = false;
        this.$parse(file, this.$session.get('uid')).then(result => {
          this.loaders.upload = false;
          this.allInfos = result;
        });
        this.predicted = false;
      },
      predictMulti() {
        if(this.allInfos.dataset.length != 0 && !this.predicted) {
          this.loaders.multi = true;
          let catIndexes = [];
          let numIndexes = [];
          this.selectedModel.catCols.forEach(val => { catIndexes.push(this.allInfos.columns.indexOf(val.name)); });
          this.selectedModel.numCols.forEach(val => { numIndexes.push(this.allInfos.columns.indexOf(val)); });
          let rows = [];
          this.allInfos.dataset.forEach(val => {
            let row = [];
            this.selectedModel.catCols.forEach((col, i) => {
              let idx = col.values.findIndex(el => el == val[catIndexes[i]]);
              let len = col.values.length;
              row = this.encode(row, idx, len);
            });
            rows.push(row);
            for(let i=0; i<numIndexes.length; i++) {
              let v = parseFloat(val[numIndexes[i]]);
              row.push(v);
            }
          });
          this.$post('/predict', { modelname: this.selectedModel.modelname, predictset: rows, uid: this.$session.get('uid') }).then(data => {
            this.loaders.multi = false;
            if(data.info == 1) {
              let results = data.prediction;
              for (let i=0; i<results.length; i++)
                results[i] = this.selectedModel.targetCol.values[data.prediction[i]];
              let columns = this.allInfos.columns;
              let dataset = this.allInfos.dataset;
              columns.unshift(this.selectedModel.targetCol.name);
              for (let i=0; i<dataset.length; i++)
                dataset[i].unshift(results[i]);
              this.allInfos.columns = columns;
              this.allInfos.dataset = dataset;
              this.predicted = true;
              this.dialogs[0].show = true;
            } else if (data.info == 0) {
              this.allInfos.error = 'You have reached your limit.';
              this.allInfos.valid = false;
            } else if (data.info == -1) {
              this.allInfos.error = 'Server error.';
              this.allInfos.valid = false;
            }
          });
        } else {
          this.dialogs[0].show = true;
        }
      },
      save() {
        let wb = XLSX.utils.book_new();
        wb.SheetNames.push('results');
        let results = this.allInfos.dataset;
        results.unshift(this.allInfos.columns);
        let ws = XLSX.utils.aoa_to_sheet(results);
        wb.Sheets['results'] = ws;
        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary', compression: true });
        saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), this.selectedModel.modelname + '_results' + '.xlsx');
      },
      s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
    }
  }
</script>