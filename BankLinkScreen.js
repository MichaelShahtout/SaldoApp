import * as PlaidSdk from 'react-native-plaid-link-sdk';
import { NativeModules } from 'react-native';
console.log('Plaid SDK exports:', PlaidSdk);
console.log('NativeModules.PlaidLink:', NativeModules.PlaidLink);
import React, { useState, useEffect } from 'react';
import { Button, ActivityIndicator } from 'react-native';

import {
  PLAID_ENV,
  PLAID_CLIENT_ID,
  PLAID_SECRET,
} from '@env';

export default function BankLinkScreen() {
  const PLAID_BASE      = `https://${PLAID_ENV}.plaid.com`;

  console.log({ PLAID_ENV, PLAID_CLIENT_ID, PLAID_SECRET, PLAID_BASE });

  // inside your component
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    // create a link_token directly from the app
    fetch(`${PLAID_BASE}/link/token/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:    PLAID_CLIENT_ID,
        secret:       PLAID_SECRET,
        user:         { client_user_id: 'personal-app' },
        client_name:  'Saldo App',
        products:     ['transactions'],
        country_codes:['US'],
        language:     'en',
      }),
    })
      .then(r => r.json())
      .then(data => {
        console.log("create token response:", data);
        if (data.link_token) {
          setLinkToken(data.link_token);
        } else {
          console.error("Plaid error:", data.error_message);
        }
      })
      .catch(console.error);
  }, []);

  // render PlaidLink once linkToken is available

  if (!linkToken) {
    return <ActivityIndicator />;
  }

  // Handler to launch Plaid Link
  const handleOpenLink = () => {
    PlaidSdk.create({ token: linkToken });
    PlaidSdk.open({
      onSuccess: ({ publicToken, metadata }) => {
        fetch(`${PLAID_BASE}/item/public_token/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_id: PLAID_CLIENT_ID, secret: PLAID_SECRET, public_token: publicToken }),
        })
        .then(r => r.json())
        .then(data => {
          const accessToken = data.access_token;
          // handle accessToken...
        })
        .catch(console.error);
      },
      onExit: ({ error, metadata }) => {
        console.error(error);
      },
    });
  };

  return (
    <Button title="Connect Your Bank" onPress={handleOpenLink} />
  );
}