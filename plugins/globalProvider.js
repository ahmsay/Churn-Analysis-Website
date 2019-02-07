import readXlsxFile from 'read-excel-file';

export default {
    install (Vue) {
      Vue.prototype.$URL = 'https://churn-analysis-api.herokuapp.com'
      
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

      Vue.prototype.$parse = function(file, action, uname, passw) {
        return new Promise(resolve => {
          let fileResult = {
            error: '',
            valid: false,
            fileName: '',
            columns: [],
            dataset: [],
            colInfos: []
          };
          if (file != undefined) {
            fileResult.fileName = file.name;
            let ext = file.name.split('.');
            let size = file.size;
            if (size < 5242880) {
              if (ext[1] == 'csv') {
                let reader = new FileReader();
                reader.addEventListener("load", function() {
                  let rawData = reader.result;
                  let dataset = [];
                  let lines = rawData.match(/[^\r\n]+/g);
                  //let lines = rawData.split("\r\n")
                  let len = lines.length-1;
                  let columns = lines[0].split(",");
                  for (let i=1; i<len; i++) {
                    let values = lines[i].split(",");
                    dataset.push(values);
                  }
                  fileResult.columns = columns;
                  fileResult.dataset = dataset;
                  if (action == 'feedback') {
                    this.$post('/columnsInfos', { columns: columns, dataset: dataset, username: uname, password: passw }).then(data => {
                      if (data.info == 1) {
                        fileResult.colInfos = data.colInfos;
                        fileResult.valid = true;
                        resolve(fileResult);
                      } else if (data.info == -1) {
                        fileResult.error = 'There is something wrong with your dataset. Please check it or try another one.';
                        resolve(fileResult);
                      }
                    });
                  } else if (action == 'predict') {
                    let colInfos = [
                      { name: 'Geography', values: ['France', 'Germany', 'Spain'], counts: [5014, 2509, 2477] },
                      { name: 'NumOfProducts', values: ['1', '2', '3', '4'], counts: [5084, 4590, 266, 60] }
                    ]
                    fileResult.colInfos = colInfos;
                    fileResult.valid = true;
                    resolve(fileResult);
                  }
                }.bind(this), false);
                reader.readAsText(file);
              } else if (ext[1] == 'xlsx') {
                readXlsxFile(file).then((rows) => {
                  let columns = rows.splice(rows[0], 1)[0];
                  let dataset = rows;
                  fileResult.columns = columns;
                  fileResult.dataset = dataset;
                  if (action == 'feedback') {
                  this.$post('/columnsInfos', { columns: columns, dataset: dataset, username: uname, password: passw }).then(data => {
                      if (data.info == 1) {
                        fileResult.colInfos = data.colInfos;
                        fileResult.valid = true;
                        resolve(fileResult);
                      } else if (data.info == -1) {
                        fileResult.error = 'There is something wrong with your dataset. Please check it or try another one.';
                        resolve(fileResult);
                      }
                    });
                  } else if (action == 'predict') {
                    let colInfos = [
                      { name: 'Geography', values: ['France', 'Germany', 'Spain'], counts: [5014, 2509, 2477] },
                      { name: 'NumOfProducts', values: ['1', '2', '3', '4'], counts: [5084, 4590, 266, 60] }
                    ]
                    fileResult.colInfos = colInfos;
                    fileResult.valid = true;
                    resolve(fileResult);
                  }
                });
              } else {
                fileResult.error = 'This file type is not supported.';
                resolve(fileResult);
              }
            } else {
              fileResult.error = 'The file size is too big.';
              resolve(fileResult);
            }
          } else {
            resolve(fileResult);
          }
        });
      }

    }
  }