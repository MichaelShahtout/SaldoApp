import 'dotenv/config';

export default {
  expo: {
    // …all your existing app.json fields here…
    extra: {
      plaidClientId: process.env.PLAID_CLIENT_ID,
      plaidSecret:    process.env.PLAID_SECRET,
      plaidEnv:       process.env.PLAID_ENV,
    },
    ios: {
        bundleIdentifier: "com.anonymous.saldo-app"
    },
    android: {
        package: "com.anonymous.saldoapp"
    }
  },
};