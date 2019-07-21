import React, { PureComponent } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, ScrollView, Text } from 'react-native';
import Message from '../components/Message';

import joinMessageUser from '../data/joinMessageUser';
import color from '../constants/colors';

// location
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { GEOLOCATION_OPTIONS } from '../constants/geolocation'

// firebase
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, populate, isEmpty, isLoaded} from 'react-redux-firebase';

// geoFire
import { geoFire } from '../firebase/config'

class HomeScreen extends PureComponent {

  state = {
    location: null,
    errorMessage: null,
    isLoading: true,
  };

  onSwipeLeft(state) {
    console.log(state)
  }

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

    Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.updateLocation);
  };

  updateLocation = (newLocation) =>{
    console.log('update location')
    this.setState({ location: newLocation, isLoading: false});
  }

  render() {
    const { navigation, notes} = this.props;

    if (!isLoaded(notes) || this.state.isLoading) {
      return (
        <View style={styles.waiting}>
          <ActivityIndicator />
        </View>
      );
    }

    let geoQuery = geoFire.query({
      center: [this.state.location.coords.latitude, this.state.location.coords.longitude],
      radius: 1.609 //kilometers
    });

    const results = [];
    geoQuery.on("key_entered", function(key, loc, distance) {
      console.log("Notes" + key + " found at " + loc + " (" + distance + " km away)");
    });

    let notesList = []

    if(isLoaded(notes)) {
      Object.keys(notes).map((key, id) => {
        notesList.push({
          id: key,
          userName: notes[key].userId.userName,
          userPic: notes[key].userId.avatar,
          description: notes[key].description,
          time: notes[key].time,
          totalLike: notes[key].totalLike,
          totalComments: notes[key].totalComments,
          messagePic: notes[key].picture,
        })
      })
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: '#fff' }}
        >
          <Text>{`${this.state.location.coords.latitude} ${this.state.location.coords.longitude}`}</Text>
          <FlatList
            data={notesList}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Message
                navigation={navigation}
                id={item.id}
                userName={item.userName}
                userPic={item.userPic}
                description={item.description}
                time={item.time}
                totalLike={item.totalLike}
                totalComments={item.totalComments}
                messagePic={item.picture}
                screen="home"
              />)
            }
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const populates = [
  { child: 'userId', root: 'users' } // replace userId with user object
]

const enhance = compose(
  firebaseConnect([
    // passing populates parameter also creates all necessary child queries
    { path: 'notes', populates }
  ]),
  connect(({ firebase }) => ({
    // populate original from data within separate paths redux
    notes: populate(firebase, 'notes', populates),
    // firebase.ordered.notes or firebase.data.notes for unpopulated notes
  }))
);

export default enhance(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  waiting: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
});
