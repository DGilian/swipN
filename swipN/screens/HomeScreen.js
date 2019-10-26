import React, { PureComponent } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, ScrollView, Text } from 'react-native';
import Message from '../components/Message';

import joinMessageUser from '../data/joinMessageUser';
import color from '../constants/colors';

import { getNote, getUser} from '../firebase/get';


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

  constructor(props) {
    super(props);
    this.state = {
      location: null,
      errorMessage: null,
      isLoading: true,
      idNotesAround: [],
      dataNotesAround: [],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    // when navigate on this page
    navigation.addListener ('willFocus', () =>
      this.getLocationAsync().then(()=> {
        this.getAroundNotes()
      })
    );
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.getAroundNotes(location);
  };


  getAroundNotes = (location) => {
    let geoQuery = geoFire.query({
      center: [location.coords.latitude, location.coords.longitude],
      radius: 1 //kilometers
    });

    let listId = []
    geoQuery.on("key_entered", function(key, loc, distance) {
      listId.push(key)
    });

    geoQuery.on("ready", () => {
      if(listId.length !== this.state.dataNotesAround.length) {
        this.setState({ 
          dataNotesAround: []
        })
        this.fetchDataNotesAround(listId)
        this.setState({ idNotesAround: listId })
      }
    })
  }

  fetchDataNotesAround = (idList) => {
      idList.map((noteId)=> {
      getNote(noteId).then((dataNote) => {
        let note = {
          id: dataNote.key,
          description: dataNote.val().description,
          time: dataNote.val().time,
          totalLike: dataNote.val().totalLike,
          totalComments: dataNote.val().totalComments,
          messagePic: dataNote.val().picture,
        }
        getUser(dataNote.val().userId).then((dataUser) => {
          note.userName = dataUser.val().username;
          note.userPic = dataUser.val().avatar;

          this.setState({ dataNotesAround: [...this.state.dataNotesAround, note]})
        })
      }
      )
    })
    if (this.state.idNotesAround.length === this.state.dataNotesAround.length) {
      this.setState({isLoading: false})
    } 
  }

  render() {
    const { navigation } = this.props;

    if (this.state.isLoading) { // !isLoaded(notes) || 
      return (
        <View style={styles.waiting}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: '#fff' }}
        >
          <FlatList
            data={this.state.dataNotesAround} // notesList
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
                messagePic={item.messagePic}
                screen="home"
              />)
            }
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

// const populates = [
//   { child: 'userId', root: 'users' } // replace userId with user object
// ]

// const enhance = compose(
//   firebaseConnect([
//     // passing populates parameter also creates all necessary child queries
//     { path: 'notes', populates }
//   ]),
//   connect(({ firebase }) => ({
//     // populate original from data within separate paths redux
//     notes: populate(firebase, 'notes', populates),
//     // firebase.ordered.notes or firebase.data.notes for unpopulated notes
//   }))
// );

export default HomeScreen;

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
