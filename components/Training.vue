<template>
	<v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 class="mb-1">
        <v-card flat>
          <v-card-title class="title font-weight-light trainamodel white--text">
            <v-icon color="white" class="mr-3">school</v-icon>
            <span>Train a New Model</span>
          </v-card-title>
            <v-stepper v-model="step" @keydown.enter="step++">
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
                  <v-card flat class="mb-3 background">
                    <v-card-title class="subheading font-weight-bold">Upload your dataset</v-card-title>
                    <v-card-text>
                      <upload-btn v-if="!loaders.upload" class="px-0 white--text" color="trainamodel" :ripple="false" :fileChangedCallback="upload"></upload-btn>
                      <v-btn v-if="loaders.upload" :disabled="true" :loading="true">Upload</v-btn>
                      <p class="mb-0 mt-2 error--text" v-if="!allInfos.valid">{{ allInfos.error }}</p>
                    </v-card-text>
                  </v-card>
                  <v-btn class="trainamodel white--text ml-0" :disabled="!allInfos.valid || loaders.upload" @click="step++">Next</v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card flat class="mb-3 background">
                    <v-card-title class="subheading font-weight-bold">Select your target column</v-card-title>
                    <v-card-text>
                      <v-select v-model="targetCol" :items="targetableCols" label="Target column"></v-select>
                      <span v-if="targetableCols.length==0">Change your dataset</span>
                    </v-card-text>
                  </v-card>
                  <v-btn class="trainamodel white--text ml-0" :disabled="targetableCols.length==0" @click="step++">Next</v-btn>
                  <v-btn flat @click="cancel">Cancel</v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-card flat class="mb-3 background">
                    <v-card-title class="subheading font-weight-bold">Select your training columns</v-card-title>
                    <v-card-text>
                      <v-select v-model="selectedTrainCols" :items="allTrainCols" item-text="name" label="Select" :menu-props="{ maxHeight: '400' }" return-object multiple></v-select>
                      <v-btn class="trainamodel white--text ml-0" @click="selectAll">Select All</v-btn>
                    </v-card-text>
                  </v-card>
                  <v-btn class="trainamodel white--text ml-0" :disabled="!colsSelected" @click="step++">Next</v-btn>
                  <v-btn flat @click="cancel">Cancel</v-btn>
                </v-stepper-content>

                <v-stepper-content step="4">
                  <v-card flat class="mb-3 background">
                    <v-card-title class="subheading font-weight-bold">Configure your column types</v-card-title>
                    <v-card-text>
                      <p class="mb-2 subheading">The following columns are automatically detected as categoric:</p>
                      <v-chip :class="'ml-0 mr-2 chip'+(col.cat == 1 || moreCatCols.includes(col))+' white--text'" small disabled :key="col.name" v-for="col in catList">{{ col.name }}</v-chip>
                      <p class="my-2 subheading">If there are more categoric columns, please select.</p>
                      <v-select v-model="moreCatCols" :items="catable" item-text="name" label="Select" :menu-props="{ maxHeight: '400' }" return-object multiple></v-select>
                    </v-card-text>
                  </v-card>
                  <v-btn class="trainamodel white--text ml-0" @click="step++">Next</v-btn>
                  <v-btn flat @click="cancel">Cancel</v-btn>
                </v-stepper-content>

                <v-stepper-content step="5">
                  <v-card flat class="mb-3 background">
                    <v-card-title class="subheading font-weight-bold">Send your preferences</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="modelName" label="Enter your models name"></v-text-field>
                        <p class="mb-0">
                          <span class="subheading font-weight-medium">Dataset: </span>
                          <span class="subheading">{{ allInfos.fileName }}</span>
                        </p>
                        <p class="mb-0">
                          <span class="subheading font-weight-medium">Training columns: </span>
                          <v-tooltip top :key="col.name" v-for="col in selectedTrainCols">
                            <v-chip slot="activator" :class="'ml-0 mr-2 chip'+(col.cat == 1 || moreCatCols.includes(col))+' white--text'" small disabled>{{ col.name }}</v-chip>
                            <span v-if="col.cat == 1 || moreCatCols.includes(col)">Categoric</span>
                            <span v-if="col.cat == 0 && !moreCatCols.includes(col)">Numeric</span>
                          </v-tooltip>
                        </p>
                        <p class="mb-0">
                          <span class="subheading font-weight-medium">Target column: </span>
                          <v-chip small disabled class="trainamodel white--text">{{ targetCol }}</v-chip>
                        </p>
                        <span class="error--text" v-if="sendError.show">{{ sendError.msg }}</span>
                    </v-card-text>
                  </v-card>
                  <v-btn class="trainamodel white--text ml-0" :loading="loaders.send" :disabled="loaders.send" @click="sendUserPrefs">Send</v-btn>
                  <v-btn flat @click="cancel">Cancel</v-btn>
                </v-stepper-content>

                <v-stepper-content step="6">
                  <v-card flat class="mb-3 background">
                    <v-card-title class="subheading font-weight-bold">Success</v-card-title>
                    <v-card-text>
                      <p class="mb-0 subheading">Your model is being trained.</p>
                    </v-card-text>
                  </v-card>
                  <v-btn class="ml-0 trainamodel white--text" @click="cancel">Train another model</v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md6 v-if="allInfos.valid">
        <v-card flat color="datatable" @click.stop="dialogDataTable = true" style="cursor: pointer">
          <v-card-title class="title font-weight-light white--text">
            <v-icon color="white" class="mr-3">table_chart</v-icon>
            <span>Data Table</span>
          </v-card-title>
          <v-dialog v-model="dialogDataTable" max-width="1250px">
            <datatable :dataset="allInfos.dataset" :columns="allInfos.columns"></datatable>
          </v-dialog>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md6 v-if="allInfos.valid">
        <v-card flat color="charts" @click.stop="dialogChart = true" style="cursor: pointer">
          <v-card-title class="title font-weight-light white--text">
            <v-icon color="white" class="mr-3">insert_chart</v-icon>
            <span>Charts</span>
          </v-card-title>
          <v-dialog v-model="dialogChart" max-width="1250px">
            <charts :chartInfos="allInfos.chartInfos"></charts>
          </v-dialog>
        </v-card>
      </v-flex>
    </v-layout>
	</v-container>
</template>

<script>
  import DataTable from './DataTable'
  import Charts from './Charts'
  import UploadButton from 'vuetify-upload-button';

  export default {
    components: {
      'datatable': DataTable,
      'charts': Charts,
      'upload-btn': UploadButton
    },
    data:() => ({
      dialogDataTable: false,
      dialogChart: false,
      sendError: { msg: 'This model name already exists. Please enter another name.', show: false },
      loaders: {
        upload: false,
        send: false
      },
      allInfos: {
        error: '',
        valid: false,
        fileName: '',
        columns: [],
        dataset: [],
        colInfos: [],
        chartInfos: []
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
          return c.name != col && (c.cat == 0 || c.number <= 30)
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
      },
      catable() {
        return this.numList.filter(c => { return c.number <= 30 })
      }
    },
    methods: {
      upload(file) {
        this.loaders.upload = true;
        this.$parse(file, 'feedback', this.$session.get('uname'), this.$session.get('passw')).then(result => {
          this.loaders.upload = false;
          this.allInfos = result;
        });
      },
      selectAll() {
        this.allTrainCols.forEach(val => {
          if (!this.selectedTrainCols.includes(val))
            this.selectedTrainCols.push(val);
        });
      },
      sendUserPrefs() {
        this.loaders.send = true;
        let cats = [];
        let nums = [];
        let col = {};
        while ((col = this.moreCatCols.pop()) != null)
          col.cat = 1;
        this.catList.forEach(val => { cats.push(this.allInfos.colInfos.map(c => { return c.name; }).indexOf(val.name)); });
        this.numList.forEach(val => { nums.push(this.allInfos.colInfos.map(c => { return c.name; }).indexOf(val.name)); });
        let targetCol = this.allInfos.columns.indexOf(this.targetCol);
        this.$post('/train', { modelname: this.modelName, dataset: this.allInfos.dataset, columns: this.allInfos.columns, target: targetCol, categoricalcolumns: cats, numericalcolumns: nums, username: this.$session.get('uname'), password: this.$session.get('passw')}).then(data => {
          this.loaders.send = false;
          if(data.info == 1) {
            this.step = 6;
            this.sent = true;
            this.sendError.show = false;
          } else if (data.info == 0) {
            this.sendError.show = true;
          } else if (data.info == -1) {
            console.log(data);
          }
        });
      },
      cancel() {
        this.allInfos = {
          error: '',
          valid: false,
          fileName: '',
          columns: [],
          dataset: [],
          colInfos: [],
          chartInfos: []
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