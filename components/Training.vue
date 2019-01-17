<template>
	<div class="container">
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step>1" step="1">Upload</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step>2" step="2">Target</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step>3" step="3">Training Columns</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step>4" step="4">Types</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step>5" step="5">Send</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-5" color="#f5f5f5">
            <v-card-title>Upload your dataset</v-card-title>
            <v-card-text>
              <input type="file" id="file" ref="file" @change="upload"/><br><br>
              <p v-if="!allInfos.valid">{{ allInfos.error }}</p>
            </v-card-text>
          </v-card>
          <v-btn :disabled="!allInfos.valid" color="primary" @click="step++">Next</v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-5" color="#f5f5f5">
            <v-card-title>Select your target column</v-card-title>
            <v-card-text>
              <v-select v-model="targetCol" :items="targetableCols" label="Target column"></v-select>
              <span v-if="targetableCols.length==0">Change your dataset ffs</span>
            </v-card-text>
          </v-card>
          <v-btn :disabled="targetableCols.length==0" color="primary" @click="step++">Next</v-btn>
          <v-btn flat @click="cancel">Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card class="mb-5" color="#f5f5f5">
            <v-card-title>Select your training columns</v-card-title>
            <v-card-text>
              <div v-bind:key="col.name" v-for="col in allTrainCols">
                <input type="checkbox" v-model="selectedTrainCols" :id="col.name" :value="col">
                <label :for="col.name">{{ col.name }}</label>
              </div>
            </v-card-text>
          </v-card>
          <v-btn color="primary" :disabled="!colsSelected" @click="step++">Next</v-btn>
          <v-btn flat @click="cancel">Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-card class="mb-5" color="#f5f5f5">
            <v-card-title>Select the categoric and numeric columns</v-card-title>
            <v-card-text>
              <p>The following columns are automatically detected as categoric:</p>
              <span :key="col.name" v-for="col in catList">{{ col.name }} </span><br><br>
              <p>If there are more categoric columns, please select.</p>
              <div :key="col.name" v-for="col in numList">
                <input :disabled="col.number>30" type="checkbox" :value="col" v-model="moreCatCols">
                <label :for="col">{{ col.name }}</label>
              </div>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="step++">Next</v-btn>
          <v-btn flat @click="cancel">Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="5">
          <v-card class="mb-5" color="#f5f5f5">
            <v-card-title>Your preferences</v-card-title>
            <v-card-text>
                <v-text-field v-model="modelName" label="Enter model name"></v-text-field>
                <div><b>Dataset: </b>{{ allInfos.fileName }}</div>
                <div>
                  <span><b>Selected Columns: </b></span>
                  <span :key="col.name" v-for="col in selectedTrainCols">{{ col.name+' '  }}</span>
                </div>
                <div>
                  <span><b>Categoric Columns: </b></span>
                  <span :key="col.name" v-for="col in catList">{{ col.name+' ' }}</span>
                  <span :key="col.name" v-for="col in moreCatCols">{{ col.name+' ' }}</span>
                </div>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="sendUserPrefs">Apply</v-btn>
          <v-btn flat @click="cancel">Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="6">
          <v-card class="mb-5" color="#f5f5f5">
            <v-card-title>Success</v-card-title>
            <v-card-text>
              <span>Your model is being trained.</span>
              <v-btn @click="cancel">Train another model</v-btn>
            </v-card-text>
          </v-card>
        </v-stepper-content>

      </v-stepper-items>
    </v-stepper>
    <datatable v-if="allInfos.dataset.length != 0" :dataset="allInfos.dataset" :columns="allInfos.columns"></datatable>
    <charts v-if="allInfos.dataset.length != 0"></charts>
	</div>
</template>

<script>
  import DataTable from './DataTable'
  import Charts from './Charts'

  export default {
    components: {
      'datatable': DataTable,
      'charts': Charts
    },
    created() {

    },
    data:() => ({
      allInfos: {
        error: '',
        valid: false,
        fileName: '',
        columns: [],
        dataset: [],
        colInfos: []
      },
      targetCol: '',
      step: 0,
      selectedTrainCols: [],
      moreCatCols: [],
      modelName: '',
      sent: false
    }),
    computed: {
      targetableCols() {
        let columns = [];
        this.allInfos.colInfos.forEach(val => {
          if (val.number == 2)
            columns.push(val.name);
        });
        if (columns.length != 0) {
          // eslint-disable-next-line
          this.targetCol = columns[columns.length-1];
        }
        return columns
      },
      allTrainCols() {
        let col = this.targetCol;
        return this.allInfos.colInfos.filter(c => {
          return c.name != col && (c.cat == 0 || c.number < 30)
        })
      },
      colsSelected() {
        return (this.selectedTrainCols.length > 0)
      },
      catList() {
        return this.selectedTrainCols.filter(c => { return c.cat == 1 })
      },
      numList() {
        return this.selectedTrainCols.filter(c => { return c.cat == 0 })
      }
    },
    methods: {
      upload() {
        this.$parse(this.$refs.file.files[0], 'feedback').then(result => { this.allInfos = result; });
      },
      sendUserPrefs() {
        let cats = [];
        let nums = [];
        let col = {};
        while ((col = this.moreCatCols.pop()) != null)
          col.cat = 1;
        this.catList.forEach(val => {
          cats.push(val.name);
        });
        this.numList.forEach(val => {
          nums.push(val.name);
        });
        console.log(this.modelName);
        console.log(this.allInfos.dataset);
        console.log(this.allInfos.columns);
        console.log(this.targetCol);
        console.log(cats);
        console.log(nums);
        this.step = 6;
        this.sent = true;
      },
      cancel() {
        this.$refs.file.value = '';
        this.allInfos = {
          error: '',
          valid: false,
          fileName: '',
          columns: [],
          dataset: [],
          colInfos: []
        },
        this.step = 1;
        this.selectedTrainCols = [];
        this.modelName = '';
        this.sent = false;
        this.moreCatCols = []; // test
      }
    }
  }
</script>