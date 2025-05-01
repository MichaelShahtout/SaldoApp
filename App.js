import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';

import BankLinkScreen from './BankLinkScreen';



export default function App() {

  // Example amounts
  const [thisWeekAmount] = useState(273);
  const [thisMonthAmount] = useState(1400);
  const [thisYearAmount] = useState(31400);

  // Dropdown toggles
  const [weekExpanded, setWeekExpanded] = useState(false);
  const [monthExpanded, setMonthExpanded] = useState(false);
  const [yearExpanded, setYearExpanded] = useState(false);

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
          <Text style={[styles.arrow]}>
            ↑
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
          <Text style={[styles.arrow]}>
            ↓
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
          <Text style={[styles.arrow]}>
            ↓
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

      <BankLinkScreen/>
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