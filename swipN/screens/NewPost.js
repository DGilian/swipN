import React, { PureComponent } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TextInput, ActivityIndicator } from 'react-native';

// license MapView : https://github.com/react-native-community/react-native-maps 
import MapView from 'react-native-maps'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

// eslint-disable-next-line import/no-extraneous-dependencies
import Icon from 'react-native-vector-icons/Ionicons';
import color from '../constants/colors';
import InputSW from '../components/InputSW';

export default class NewPost extends PureComponent {
  state = {
    location: null,
    errorMessage: null,
    isLoading: true,
  };
  
  componentDidMount() {
    this.getLocationAsync()
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location, isLoading: false });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.waiting}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <KeyboardAwareView >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.container}>
            <MapView
              style={styles.map}
              initialRegion={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            />
            <InputSW parent="newPost"/>
          </View>
        </SafeAreaView>
      </KeyboardAwareView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  map: {
    height: `${100}%`,
    width: `${100}%`,
  },
  textInput: {
    backgroundColor: 'white',
    width: `${100}%`,
    padding: 10,
    position: 'absolute',
    bottom: 0,
  },
});
