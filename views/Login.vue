<template>
  <div class="container">
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex class="pa-2" xs12 sm6 md8>
          <v-card color="#f5f5f5">
            <v-card-title class="title font-weight-medium">Insert title here</v-card-title>
            <v-card-text>
              Insert text here
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex class="pa-2" xs12 sm6 md4>
          <v-card color="#f5f5f5">
            <v-card-title class="title font-weight-medium">Sign in to churnify</v-card-title>
            <v-card-text>
              <v-text-field v-model="unameL" label="Username"></v-text-field>
              <v-text-field v-model="passwL" label="Password" type="password"></v-text-field>
              <v-btn block @click="login(unameL, passwL)">Sign In</v-btn>
              <v-btn block @click.stop="dialog = true">Register</v-btn>
              <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card class="pa-3">
                  <v-card-title>
                    <span class="headline">Register</span>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="form" v-model="valid">
                      <v-text-field v-model="uname" :rules="unameRules" label="Username" required></v-text-field>
                      <v-text-field v-model="passw" :rules="passwRules" type="password" label="Password" required></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="closeform">Close</v-btn>
                    <v-btn :disabled="!valid" @click="register(uname, passw)">Sign Up</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  export default {
    created() {
      if (this.$session.has("user"))
        this.$router.push('/home');
    },
    data:() => ({
      dialog: false,
      unameL: '',
      passwL: '',
      valid: false,
      uname: '',
      passw: '',
      unameRules: [
        v => !!v || 'Username is required',
        v => v != null && v.length <= 30 && v.length >= 4 || 'Username must be between than 4 and 30 characters'
      ],
      passwRules: [
        v => !!v || 'Password is required',
        v => v != null && v.length <= 50 && v.length >= 6 || 'Password must be between than 6 and 50 characters'
      ]
    }),
    methods: {
      login (uname, passw) {
        uname = 'zorkov';
        passw = 'asdzxc';
        console.log("logged in: " + uname + ", " + passw);
        this.$session.set("user", uname);
        this.$router.push('/home');
      },
      register(uname, passw) {
        this.closeform();
        this.uname = '';
        this.passw = '';
        console.log("registered: " + uname + ", " + passw);
      },
      closeform() {
        this.$refs.form.reset();
        this.dialog = false;
      }
    }
  }
</script>