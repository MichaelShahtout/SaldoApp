import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';

import BankLinkScreen from './BankLinkScreen';

import {
  PLAID_ENV,
  PLAID_CLIENT_ID,
  PLAID_SECRET,
} from '@env';


export default function App() {

  // Example amounts
  const [thisWeekAmount, setThisWeekAmount] = useState(0);
  const [thisMonthAmount, setThisMonthAmount] = useState(0);
  const [thisYearAmount, setThisYearAmount] = useState(0);

  const [thisWeekIncrease, setThisWeekIncrease] = useState(false);
  const [thisMonthIncrease, setThisMonthIncrease] = useState(false);
  const [thisYearIncrease, setThisYearIncrease] = useState(false);

  // Transaction data
  const [allTransactions, setAllTransactions] = useState([]);
  const [weeklyTransactions, setWeeklyTransactions] = useState([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [yearlyTransactions, setYearlyTransactions] = useState([]);

  // Dropdown toggles
  const [weekExpanded, setWeekExpanded] = useState(false);
  const [monthExpanded, setMonthExpanded] = useState(false);
  const [yearExpanded, setYearExpanded] = useState(false);

  const fetchAndOrganizeTransactions = async (accessToken) => {
    try {
      // Replace with your backend endpoint to fetch transactions via Plaid
      const today = new Date();
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(today.getFullYear() - 2);
      const resp = await fetch(`https://${PLAID_ENV}.plaid.com/transactions/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: PLAID_CLIENT_ID,
          secret: PLAID_SECRET,
          access_token: accessToken,
          start_date: twoYearsAgo.toISOString().split('T')[0],
          end_date:   today.toISOString().split('T')[0],
        }),
      });
      const data = await resp.json();
      setAllTransactions(data.transactions || []);

      const transactions = data.transactions || [];

      console.log(transactions);

      // Week-to-date and week-over-week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const prevWeekStart = new Date(startOfWeek);
      prevWeekStart.setDate(prevWeekStart.getDate() - 7);
      const prevWeekEnd = new Date(startOfWeek);
      prevWeekEnd.setDate(prevWeekEnd.getDate() - 1);
      const thisWeekTotal = transactions
        .filter(tx => new Date(tx.date) >= startOfWeek)
        .reduce((sum, tx) => sum + tx.amount, 0);
      const prevWeekTotal = transactions
        .filter(tx => new Date(tx.date) >= prevWeekStart && new Date(tx.date) <= prevWeekEnd)
        .reduce((sum, tx) => sum + tx.amount, 0);
      setThisWeekAmount(thisWeekTotal);
      setThisWeekIncrease(thisWeekTotal >= prevWeekTotal);

      // Month-to-date and month-over-month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const prevMonthEnd = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      const thisMonthTotal = transactions
        .filter(tx => new Date(tx.date) >= startOfMonth)
        .reduce((sum, tx) => sum + tx.amount, 0);
      const prevMonthTotal = transactions
        .filter(tx => new Date(tx.date) >= prevMonthStart && new Date(tx.date) <= prevMonthEnd)
        .reduce((sum, tx) => sum + tx.amount, 0);
      setThisMonthAmount(thisMonthTotal);
      setThisMonthIncrease(thisMonthTotal >= prevMonthTotal);

      // Year-to-date and year-over-year
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const prevYearStart = new Date(today.getFullYear() - 1, 0, 1);
      const prevYearEnd = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      const thisYearTotal = transactions
        .filter(tx => new Date(tx.date) >= startOfYear)
        .reduce((sum, tx) => sum + tx.amount, 0);
      const prevYearTotal = transactions
        .filter(tx => new Date(tx.date) >= prevYearStart && new Date(tx.date) <= prevYearEnd)
        .reduce((sum, tx) => sum + tx.amount, 0);
      setThisYearAmount(thisYearTotal);
      setThisYearIncrease(thisYearTotal >= prevYearTotal);

      // Helper to filter by date range
      const filterRange = (startOffsetDays) => {
        const cutoff = new Date();
        cutoff.setDate(today.getDate() - startOffsetDays);
        return (transactions).filter(tx => new Date(tx.date) >= cutoff);
      };

      setWeeklyTransactions(filterRange(7));
      setMonthlyTransactions(filterRange(30));
      setYearlyTransactions(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Amount Spent:</Text>
      
      {/* This Week */}
      <TouchableOpacity 
        style={[styles.spendingRowContainer, { marginTop: Dimensions.get('window').height * 0.10 }]} 
        onPress={() => setWeekExpanded(!weekExpanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.spendingRowText}>
          ▼This week
        </Text>
        <View style={styles.amountAndArrow}>
          <Text style={styles.amountText}>
            ${thisWeekAmount}
          </Text>
          <Text style={[thisWeekIncrease ? styles.arrowUp : styles.arrowDown]}>
            {thisWeekIncrease ? "↑" : "↓"}
          </Text>
        </View>
      </TouchableOpacity>
      {weekExpanded && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownText}>
            {/* Dropdown contents for "This week" go here */}
            Weekly details placeholder...
          </Text>
        </View>
      )}

      {/* This Month */}
      <TouchableOpacity 
        style={[styles.spendingRowContainer, { marginTop: Dimensions.get('window').height * 0.10 }]} 
        onPress={() => setMonthExpanded(!monthExpanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.spendingRowText}>
          ▼This month
        </Text>
        <View style={styles.amountAndArrow}>
          <Text style={styles.amountText}>
            ${thisMonthAmount}
          </Text>
          <Text style={[thisMonthIncrease ? styles.arrowUp : styles.arrowDown]}>
            {thisMonthIncrease ? "↑" : "↓"}
          </Text>
        </View>
      </TouchableOpacity>
      {monthExpanded && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownText}>
            {/* Dropdown contents for "This month" go here */}
            Monthly details placeholder...
          </Text>
        </View>
      )}

      {/* This Year */}
      <TouchableOpacity 
        style={[styles.spendingRowContainer, { marginTop: Dimensions.get('window').height * 0.10 }]} 
        onPress={() => setYearExpanded(!yearExpanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.spendingRowText}>
          ▼This year
        </Text>
        <View style={styles.amountAndArrow}>
          <Text style={styles.amountText}>
            ${thisYearAmount}
          </Text>
          <Text style={[thisYearIncrease ? styles.arrowUp : styles.arrowDown]}>
            {thisYearIncrease ? "↑" : "↓"}
          </Text>
        </View>
      </TouchableOpacity>
      {yearExpanded && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownText}>
            {/* Dropdown contents for "This year" go here */}
            Yearly details placeholder...
          </Text>
        </View>
      )}

      <BankLinkScreen onLinkSuccess={(token) => fetchAndOrganizeTransactions(token)}/>
      <View style={styles.bottomView}/>
    </ScrollView>
  );
}

// Basic styling
const styles = StyleSheet.create({
  bottomView: {
    paddingBottom: Dimensions.get('window').height * 0.05
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: Dimensions.get('window').height * 0.25,
    fontWeight: 'bold',
    color: '#000',
  },
  spendingRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  spendingRowText: {
    fontSize: 22,
    color: '#000',
  },
  amountAndArrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 24,
    color: '#000',
    marginRight: 8,
  },
  arrow: {
    fontSize: 24,
  },
  arrowDown: {
    fontSize: 24,
    color: '#77dd77'
  },
  arrowUp: {
    fontSize: 24,
    color: '#ff6961'
  },
  dropdownContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 18,
    color: '#000',
    letterSpacing: 0.5,
  },
});