/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  Platform
} from 'react-native';

import ReactNative from 'react-native';
import * as firebase from 'firebase';
const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./styles.js');

const {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
} = ReactNative;

const firebaseConfig = {
  apiKey: "AIzaSyAHQpxSj9OFbhqz4Zonn5Zy8LzRBNPv1Zs",
  authDomain: "shoppinglistpro-80f0a.firebaseapp.com",
  databaseURL: "https://shoppinglistpro-80f0a.firebaseio.com",
  storageBucket: ""
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class ShoppingListApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
    this.itemsRef = firebaseApp.database().ref();
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  componentDidMount() {
      this.listenForItems(this.itemsRef);
   }

   _addItem() {
    AlertIOS.prompt(
      'Add New Item',
      null,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {
          text: 'Add',
          onPress: (text) => {
            this.itemsRef.push({ title: text })
          }
        },
      ],
      'plain-text'
    );
  }

   _renderItem(item) {
      const onPress = () => {
        AlertIOS.alert(
          'Complete',
          'Are you sure you want to delete this item?',
          [
            {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
            {text: 'Cancel', onPress: (text) => console.log('Cancel')}
          ],
        );
      };

      return (
        <ListItem item={item} onPress={onPress}/>
      );
    }

   render() {
    return (
      <View style={styles.container}>

        <StatusBar title="Shopping List" />

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

        <ActionButton onPress={this._addItem.bind(this)} title="Add"/>

      </View>
    )
  }
}
