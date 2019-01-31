<template>
  <v-card flat class="mb-4">
    <v-card-title class="title font-weight-medium primary white--text">Data Table</v-card-title>
    <v-data-table class="elevation-2" :headers="headers" :items="dataset" :rows-per-page-items="[5, 10, 25]">
      <template slot="items" slot-scope="props">
        <td v-bind:key="row" v-for="(row, idx) in columns">{{ props.item[idx] }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
    data:() => ({

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
            headers.push({ text: val, value: idx, sortable: false });
          });
          return headers;
        }
      }
    },
    methods: {

    }
  }
</script>