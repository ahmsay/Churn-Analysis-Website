<template>
	<div class="container">
      <v-data-table :headers="headers" :items="dataset" :rows-per-page-items="rowsPerPageItems" class="elevation-2">
        <template slot="items" slot-scope="props">
          <td v-bind:key="row" v-for="(row, idx) in columns">{{ props.item[idx] }}</td>
        </template>
    </v-data-table>
	</div>
</template>

<script>
  export default {
    data:() => ({
      rowsPerPageItems: [5, 10, 25]
    }),
    props: {
      columns: Array,
      dataset: Array
    },
    computed: {
      headers() {
        let headers = [];
        if (this.dataset == []) {
          return [];
        } else {
          this.columns.forEach((val, idx) => {
            headers.push({text: val, value: idx});
          });
          return headers;
        }
      }
    },
    methods: {

    }
  }
</script>