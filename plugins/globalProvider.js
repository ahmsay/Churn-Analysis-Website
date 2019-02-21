import XLSX from 'xlsx';

export default {
  install (Vue) {
    Vue.prototype.$URL = 'https://my-churn-api.herokuapp.com';
    
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

    Vue.prototype.$parse = function(file, uname, passw) {
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
                let lines = rawData.split(/\r\n|\n/);
                let len = lines.length-1;
                let columns = lines[0].split(",");
                for (let i=1; i<len; i++) {
                  let values = lines[i].split(",");
                  dataset.push(values);
                }
                fileResult.columns = columns;
                fileResult.dataset = dataset;
                this.$post('/columnsInfos', { columns: columns, dataset: dataset, username: uname, password: passw }).then(data => {
                  if (data.info == 1) {
                    fileResult.colInfos = data.colInfos;
                    fileResult.valid = true;
                    resolve(fileResult);
                  } else if (data.info == 0) {
                    fileResult.error = 'You have reached your limit.';
                    resolve(fileResult);
                  } else if (data.info == -1) {
                    fileResult.error = 'There is something wrong with your dataset. Please check it or try another one.';
                    resolve(fileResult);
                  }
                });
              }.bind(this), false);
              reader.readAsText(file);
            } else if (ext[1] == 'xlsx' || ext[1] == 'xls') {
              let reader = new FileReader();
              reader.addEventListener("load", function() {
                let rawData = reader.result;
                let wb = XLSX.read(rawData, { type: 'binary' });
                let rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header:1 });
                let columns = rows.splice(rows[0], 1)[0];
                let dataset = rows;
                fileResult.columns = columns;
                fileResult.dataset = dataset;
                this.$post('/columnsInfos', { columns: columns, dataset: dataset, username: uname, password: passw }).then(data => {
                  if (data.info == 1) {
                    fileResult.colInfos = data.colInfos;
                    fileResult.valid = true;
                    resolve(fileResult);
                  } else if (data.info == 0) {
                    fileResult.error = 'You have reached your limit.';
                    resolve(fileResult);
                  } else if (data.info == -1) {
                    fileResult.error = 'There is something wrong with your dataset. Please check it or try another one.';
                    resolve(fileResult);
                  }
                });
              }.bind(this), false);
              reader.readAsBinaryString(file);
            } else {
              fileResult.error = "File type '." + ext[1] + "' is not supported.";
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