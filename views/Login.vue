<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm6 md8>
        <v-card class="secondary">
          <v-card-title class="title font-weight-medium primary white--text">Lorem Ipsum</v-card-title>
          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-card class="secondary">
          <v-card-title class="title font-weight-medium primary white--text">Sign in to Churnify</v-card-title>
          <v-card-text>
            <v-text-field v-model="unameL" label="Username"></v-text-field>
            <v-text-field v-model="passwL" label="Password" type="password"></v-text-field>
            <v-layout row wrap>
              <v-flex xs12 sm6 md6 class="pb-0">
                <v-btn class="mb-0 primary" block @click="login(unameL, passwL)">Sign In</v-btn>
              </v-flex>
              <v-flex xs12 sm6 md6 class="pb-0">
                <v-btn class="mb-0 primary" block @click.stop="dialog = true">Register</v-btn>
              </v-flex>
            </v-layout>
            <v-dialog v-model="dialog" persistent max-width="600px">
              <v-card class="pa-0 secondary">
                <v-card-title class="primary white--text">
                  <span class="headline">Register</span>
                </v-card-title>
                <v-card-text>
                  <v-form ref="form" v-model="valid">
                    <v-text-field v-model="uname" :rules="unameRules" label="Username" required></v-text-field>
                    <v-text-field v-model="passw" :rules="passwRules" label="Password" required type="password"></v-text-field>
                    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                  </v-form>
                </v-card-text>
                <v-layout justify-end class="pr-2 pb-2">
                  <v-btn class="primary mr-0" @click.native="closeform">Close</v-btn>
                  <v-btn class="primary" :disabled="!valid" @click="register(uname, passw, email)">Sign Up</v-btn>
                </v-layout>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    created() {
      if (this.$session.has("uname"))
        this.$router.push('/home');
    },
    data:() => ({
      dialog: false,
      unameL: '',
      passwL: '',
      valid: false,
      uname: '',
      passw: '',
      email: '',
      unameRules: [
        v => !!v || 'Username is required',
        v => v != null && v.length <= 30 && v.length >= 4 || 'Username must be between than 4 and 30 characters'
      ],
      passwRules: [
        v => !!v || 'Password is required',
        v => v != null && v.length <= 50 && v.length >= 6 || 'Password must be between than 6 and 50 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required'
      ]
    }),
    methods: {
      login (uname, passw) {
        this.$post('/login', { username: uname, password: passw }).then(data => {
          if (data.info == "1") {
            this.$session.set("uname", uname);
            this.$session.set("passw", passw);
            this.$router.push('/home');
          }
        })
      },
      register(uname, passw, email) {
        this.$post('/register', { username: uname, password: passw, email: email }).then(data => {
          if (data.info == "1") {
            this.closeform();
            this.uname = '';
            this.passw = '';
            this.email = '';
          }
        })
      },
      closeform() {
        this.$refs.form.reset();
        this.dialog = false;
      }
    }
  }
</script>