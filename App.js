import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, TextInput, Button, Pressable } from 'react-native';
import json from './data/zoneatlas.json';

export default function Api() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [showEventByIndex, setShowEventByIndex] = useState(-1);

  useEffect(()=> {
    let tmpEvents = [...events];
    let tmpCategories = [...categories];
    let newRegExp = '\\b' + searchString + '\\b';
    let jsonFiltered = json.filter(element => element.title.match(newRegExp));
    let jsonLength = Object.keys(jsonFiltered).length;
    
    for (let i = 0; i < jsonLength; i++) {
      if (!tmpEvents.some(item => item.title === jsonFiltered[i].title)) {
        tmpEvents.push(jsonFiltered[i]);
      }
      if (!tmpCategories.includes(jsonFiltered[i].Categories[0].title)) {
        tmpCategories.push(jsonFiltered[i].Categories[0].title)
      }
    }
    setEvents(tmpEvents);
    setCategories(tmpCategories);
    setError(null);
    setIsLoading(false);
  }, [refresh]);

  const searchEvents = () => {
    setEvents([]);
    setCategories([]);
    setShowEventByIndex(-1);
    setRefresh(!refresh);
  }

  const showEvent = (i) => {
    setShowEventByIndex(i);
  }

  const randomKey = () => {
    return Math.random().toString(16).slice(2);
  }

  if (isLoading) {
    return <View style={styles.container}><ActivityIndicator size="large"/></View>
  } else if (error) {
    return <View style={styles.container}><Text>{error}</Text></View>
  } else {
    return (
      <View style={styles.container}>
        <TextInput 
          onChangeText={searchStr => setSearchString(searchStr)}
          value={searchString}
          placeholder="Search string here..." />
        <Button 
          title="Search"
          onPress={() => searchEvents()} />
        <ScrollView>
          <Text style={styles.heading}>Kohteet ({events.length})</Text>
          {events.map((item, index) => (
            <Pressable key={randomKey()} onPress={() => showEvent(index)}>
              <Text style={styles.title} key={randomKey()}>{item.title}</Text>
              { showEventByIndex === index &&
                <Text style={styles.content} key={randomKey()}>{item.content}</Text>
              }
            </Pressable>
          ))}
          <Text style={styles.heading}>Kategoriat ({categories.length})</Text>
          {categories.map((item, index) => (
            <Text key={randomKey()}>{item}</Text>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20
  },  
  title: {
    fontSize: 16
  },
  content: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12
  }
});