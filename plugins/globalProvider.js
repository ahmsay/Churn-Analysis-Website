export default {
    install (Vue) {
      Vue.prototype.$URL = 'http://127.0.0.1:5000'
      //Vue.prototype.$URL = 'http://10.31.27.61:5000'
      
      Vue.prototype.$get = function(path) {
      	return new Promise(resolve => {
      		this.$http.get(this.$URL + path)
      		.then(data => {
      			let x = data.json();
    			resolve(x);
      		})
      		.catch(error => {
      			console.log(error);
      		});
      	});
      }

      Vue.prototype.$post = function(path, body) {
      	return new Promise(resolve => {
      		this.$http.post(this.$URL + path, body)
      		.then(data => {
      			let x = data.json();
      			resolve(x);
      		})
      		.catch(error => {
      			console.log(error);
      		})
      	});
      }

      Vue.prototype.$parse = function(file, action) {
        return new Promise(resolve => {
          let fileResult = {
            error: '',
            valid: false,
            fileName: '',
            columns: [],
            dataset: [],
            colInfos: [],
            chartInfos: []
          };
          if (file != undefined) {
            fileResult.fileName = file.name;
            let ext = file.name.split('.');
            let size = file.size;
            if (ext[1] == 'csv') {
              if (size < 5242880) {
                let reader = new FileReader();
                reader.addEventListener("load", function() {
                  let rawData = reader.result;
                  let dataset = [];
                  let lines = rawData.split("\n");
                  let len = lines.length-1;
                  let columns = lines[0].split(",");
                  for (let i=1; i<len; i++) {
                    let values = lines[i].split(",");
                    dataset.push(values);
                  }
                  fileResult.columns = columns;
                  fileResult.dataset = dataset;
                  if (action == 'feedback') {
                    /*this.$post('/check', { columns: columns, dataset: dataset }).then(data => {
                      fileResult.colInfos = data.col_infos;
                      fileResult.chartInfos = data.chart_infos;
                    })*/
                    let colInfos = [
                      { name: 'RowNumber', number: 10000, cat: 0 },
                      { name: 'CustomerId', number: 10000, cat: 0 },
                      { name: 'Surname', number: 580, cat: 1 },
                      { name: 'CreditScore', number: 9000, cat: 0 },
                      { name: 'Geography', number: 3, cat: 1 },
                      { name: 'Gender', number: 2, cat: 1 },
                      { name: 'Age', number: 48, cat: 0 },
                      { name: 'Tenure', number: 15, cat: 0 },
                      { name: 'Balance', number: 9000, cat: 0 },
                      { name: 'NumOfProducts', number: 10, cat: 0 },
                      { name: 'HasCrCard', number: 2, cat: 0 },
                      { name: 'IsActiveMember', number: 2, cat: 0 },
                      { name: 'EstimatedSalary', number: 9000, cat: 0 },
                      { name: 'Exited', number: 2, cat: 0 }
                    ];
                    fileResult.colInfos = colInfos;
                    let chartInfos = [
                      { name: 'Geography', labels: ['France', 'Germany', 'Spain'], data: [5014, 2509, 2477] },
                      { name: 'NumOfProducts', labels: ['1', '2', '3', '4'], data: [5084, 4590, 266, 60] }
                    ]
                    fileResult.chartInfos = chartInfos;
                  } else if (action == 'predict') {
                    let chartInfos = [
                      { name: 'Geography', labels: ['France', 'Germany', 'Spain'], data: [5014, 2509, 2477] },
                      { name: 'NumOfProducts', labels: ['1', '2', '3', '4'], data: [5084, 4590, 266, 60] }
                    ]
                    fileResult.chartInfos = chartInfos;
                  }
                }.bind(this), false);
                reader.readAsText(file);
                fileResult.valid = true;
              } else {
                fileResult.error = 'The file size is too big.';
              }
            } else {
              fileResult.error = 'This file type is not supported.';
            }
          }
          resolve(fileResult);
        });
      }

    }
  }