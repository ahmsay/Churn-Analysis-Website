<template>
	<div class="container">
		<input v-if="progress == 0" type="file" id="file" ref="file" @change="upload"/>
    <div v-if="progress == 1">
      <p><b>Target column: </b> {{targetCol}}</p>
      <v-select v-model="targetCol" :items="columns" label="Select target column"></v-select>
      <v-btn @click="setTarget">Next</v-btn>
    </div>
		<div v-if="progress == 2">
			<span><b>Categoric columns: </b></span>
			<span @click="swapToCat(index)" v-bind:key="col" v-for="(col, index) in catCols">{{col}}, </span>
			<br>
			<span><b>Numeric columns: </b></span>
			<span @click="swapToNum(index)" v-bind:key="col" v-for="(col, index) in numCols">{{col}}, </span><br>
			<v-btn @click="setCatNum">Next</v-btn>
		</div><br>
		<div v-if="progress == 3">
			<p><b>Training Columns</b></p>
			<div v-bind:key="col" v-for="col in columns">
				<input type="checkbox" :id="col" :value="col" v-model="trainCols">
				<label :for="col">{{col}}</label>
			</div>
      <v-btn @click="sendPrefs">Send Preferences</v-btn>
		</div>
	</div>
</template>

<script>
  export default {
  	data() {
	  return {
	  	progress: 0,
	  	file: '',
	  	rawData: "-",
	  	columns: [],   // all column names
	  	dataset: [],   // all values
	  	catCols: [],   // categoric column names
	  	numCols: [],   // numeric column names
	  	trainCols: [], // training column names
	  	targetCol: '-' // target column name
	  }
  	},
  	methods: {
  		upload() {
  			this.file = this.$refs.file.files[0];
  			let reader = new FileReader();
  			reader.addEventListener("load", function() {
  				this.rawData = reader.result;
  				this.sendDataset();
  			}.bind(this), false);
  			reader.readAsText(this.file);
  		},
  		sendDataset() {
  			let lines = this.rawData.split("\n");
  			let len = lines.length-1;
  			this.columns = lines[0].split(",");
  			for (let i=1; i<len; i++) {
				let values = lines[i].split(",");
				this.dataset.push(values);
  			}
        /*this.$post('/upload', {'columns': this.columns, 'dataset': this.dataset}).then(data => {
          if (data['appropriate'] == 'True')
            this.progress++;
          else if (data['appropriate'] == 'False')
            // display alert
        });*/
  		},
      setTarget() {
        /*this.$post('/checkTarget', {'target': this.targetCol}).then(data => {
          if (data['appropriate'] == 'True') {
            let col = this.columns.indexOf(this.targetCol);
            this.columns.splice(col, 1);
            this.displayColTypes(data['cat_cols'], data['num_cols']);
            this.progress++;
          }
          else if (data['appropriate'] == 'False')
            // display alert
        });*/
      },
  		displayColTypes(catCols, numCols) {
  			for (let i=0; i<catCols.length; i++) {
  				let col = catCols[i];
  				this.catCols.push(this.columns[col]);
  			}
  			for (let i=0; i<numCols.length; i++) {
  				let col = numCols[i];
  				this.numCols.push(this.columns[col]);
  			}
  		},
      swapToCat(index) {
        let col = this.catCols[index];
        this.catCols.splice(index, 1);
        this.numCols.push(col);
      },
      swapToNum(index) {
        let col = this.numCols[index];
        this.numCols.splice(index, 1);
        this.catCols.push(col);
      },
  		setCatNum() {
  			/*this.$post('/checkCatNum', {'catCols': this.catCols}).then(data => {
        wrongCols = data['colsThatHaveMoreThan30Categories']
        });*/
  		},
  		sendPrefs() {
  			console.log(this.catCols);
  			console.log(this.numCols);
  			console.log(this.trainCols);
  			console.log(this.targetCol);
  			this.progress++;
  		}
  	}
  }
</script>