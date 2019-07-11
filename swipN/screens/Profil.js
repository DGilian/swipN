import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, FlatList, ScrollView, ActivityIndicator,
  TouchableOpacity, Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import color from '../constants/colors';

import user from '../data/dataUsers';
import Message from '../components/Message';
import joinFavoriteMessageUser from '../data/joinFavoriteMessageUser';
import joinMyMessageUser from '../data/joinMyMessageUser';

import { withFirebase, isEmpty } from 'react-redux-firebase';
import { compose } from 'recompose';
import { connect } from 'react-redux';

// picture
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'uuid';

class Profil extends PureComponent {
  state = {
    isLoading: true,
    avatarPath: '',
  }

  componentDidMount() {
    const { firebase, profile } = this.props
    if(isEmpty(profile.avatar)) {
      const image = firebase.storage().ref().child('appSwipe/avatar.jpg');
      image.getDownloadURL().then((url) => {
        this.setState({
          avatarPath: url,
          isLoading: false,
        })
      })
      .catch((e)=> {
        console.log(e)
      });
    }
    else {
      this.setState({
        avatarPath: profile.avatar,
        isLoading: false,
      })
    }
  }

  componentDidUpdate() {
    const { profile } = this.props
      this.setState({
        avatarPath: profile.avatar
      })
  }
  
  onEditProfil = ()=> {
    Alert.alert(
      'Change profile image',
      '',
      [
        {text: 'Open Camera', onPress: () => this.openCamera()},
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Open Library', onPress: () => this.openLibrary()},
      ],
      {cancelable: false},
    );
  }

  openCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permissions to make this work!');
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });

    if (!result.cancelled) {
      this.upLoadImage(result.uri)
    }
  }

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    if (!result.cancelled) {
      this.upLoadImage(result.uri)
    }
  }
  
  upLoadImage = async (uri) => {
    const { firebase, profile } = this.props;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = () => {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    // firebase.deleteFile(firebase.profile.avatar)
    const avatarName = uuid.v4()
    !isEmpty(profile.avatarName) && firebase.deleteFile(`swipe/${profile.avatarName}`);
    const ref = firebase.storage().ref().child(`swipe/${avatarName}`);
    const snapshot = await ref.put(blob);


    // We're done with the blob, close and release it
    blob.close();

    const url = await snapshot.ref.getDownloadURL();
    if (!isEmpty(url)) {
      firebase.updateProfile({
        avatar: url,
        avatarName: avatarName,
      });
    }
  }

  logout = () => {
    const { firebase, navigation } = this.props
    firebase.logout()
    navigation.navigate('AuthLoading');
  }
  render() {
    const { navigation, profile } = this.props;
    let userName = profile.username !== '' ? profile.username : 'username'

    if (this.state.isLoading) {
      return (
        <View style={styles.waiting}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={styles.container}>
          <LinearGradient
            colors={['#243857', '#151930']}
            start={[0.5, 0.25]}
            end={[0.46, 0.93]}
            style={styles.headerBackground}
          >
            <View style={styles.headerContainer}>
              <View style={styles.profilContainer}>
                <Image
                  source={{ uri: this.state.avatarPath }}
                  style={styles.contentImage}
                />
                <Text style={styles.userName}>{userName}</Text>
              </ View>
              <View style={styles.containerEditButton}>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={this.logout}
                  underlayColor='#fff'
                >
                  <MaterialCommunityIcons name="logout-variant" size={24} color={color.button}/>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={this.onEditProfil}
                  underlayColor='#fff'
                >
                  <Text style={styles.editText}>...</Text>
                </TouchableOpacity>
              </View>
            </ View>
          </LinearGradient>

          <View>
            <FlatList
              data={joinMyMessageUser}
              renderItem={({ item }) => (
                <Message
                  navigation={navigation}
                  key={item.key}
                  userName={item.userName}
                  userPic={item.userPic}
                  description={item.description}
                  time={item.time}
                  totalLike={item.totalLike}
                  totalComments={item.totalComments}
                  messagePic={item.picture}
                  screen={'myMessages'}
                />)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const enhance = compose(
  withFirebase,
  connect((state) => ({
      profile: state.firebase.profile
  })),
);

export default enhance(Profil);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  headerBackground: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  profilContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  userName: {
    color: 'white',
    padding: 20,
  },
  waiting: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  containerEditButton: {
    flex: 1,
    width: 20,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  editButton:{
    paddingTop:3,
    paddingBottom:8,
    backgroundColor:'#fff',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 20,
  },
  editText:{
      color:'black',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10
  }
  // buttonMenu: {
  //   width: `${100}%`,
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   marginBottom: 10,
  // },
  // button: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   padding: 10,
  // },
  // buttonSelected: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   padding: 10,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#fff',
  // },
});
