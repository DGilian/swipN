import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import { View, Image, TextInput, Button, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import color from '../constants/colors';
import moment from 'moment';
import { db, geoFire } from '../firebase/config'

// redux
import { connect } from 'react-redux'

// firebase
import { compose } from 'recompose';
import { withFirebase } from 'react-redux-firebase'
import uuid from 'uuid';

// add pic when post message
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';


class inputSW extends PureComponent {
  constructor() {
    super();
    this.state = {
      content: '',
      picUrl: '',
      phonePathPic:'',
      isUploadingPic: false,
    };
  }

  addItem = (description, picUrl) => {
    const { auth, location} = this.props
    const keyNotes = uuid.v4()

    db.ref('/notes/'+keyNotes).set({
      description: description,
      userId: auth.uid,
      picture: picUrl,
      time: moment(Date.now()).format(),
      totalComments: [],
      totalLike: [],
    });

    geoFire.set(keyNotes, [location.latitude, location.longitude]).then(function() {
      console.log("Provided key has been added to GeoFire");
    }, function(error) {
      console.log("Error: " + error);
    });

  };

  publish = () => {
    // publish
    this.setState({isUploadingPic: true})
    this.upLoadImage(this.state.phonePathPic).then(()=> {
      this.addItem(this.state.content, this.state.picUrl);
      this.props.navigation.navigate('Home')
      this.setState({isUploadingPic: false, content: '' })
    })
  }

  // cam add picture when post message ======
  onAddImage = ()=> {
    Alert.alert(
      'Add Picture',
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
      // this.upLoadImage(result.uri)
      this.setState({phonePathPic: result.uri})
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
      // this.upLoadImage(result.uri)

      this.setState({phonePathPic: result.uri})
    }
  }

  upLoadImage = async (uri) => {
    const { firebase } = this.props;
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
    // add picture in firebase
    const picName = uuid.v4()
    const ref = firebase.storage().ref().child(`swipe/${picName}`);
    const snapshot = await ref.put(blob);
    const url = await snapshot.ref.getDownloadURL().then((urlPic)=>{this.setState({picUrl: urlPic})});


    // We're done with the blob, close and release it
    blob.close();

  }
// end of add image cam when post message ===========

  render() {
    const { userPic, parent } = this.props;

    return (
      <View style={styles.addContainer}>
        {parent === "chatFriend"
          && (
            <View style={styles.iconInputContainer}>
              <Image
                source={{ uri: userPic }} // *********** todo
                style={styles.userImage}
              />
            </View>
          )
        }
        {parent === "newPost"
          && (
          <View style={styles.imagePickerContainer}>
            <View>
              <SimpleLineIcons
                name="picture"
                size={28}
                color={color.colorIcon}
                onPress={() => {}}
                style={styles.iconPicture}
                onPress={()=> this.onAddImage()}
              />
            </View>
          </View>
          )
        }
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Yours comments"
            multiline
            onChangeText={text => this.setState({ content: text })}
            value={this.state.content}
          />
        </View>
        {this.state.isUploadingPic ? (
          <View style={styles.waiting}>
            <ActivityIndicator />
          </View>
        )
        :
          <View style={styles.buttonContainer}>
            <MaterialCommunityIcons
              name="send"
              size={28}
              color={color.colorIcon}
              onPress={() => this.publish()}
            />
          </View>
        }
      </View>
    );
  }
}


const enhance = compose(
  withFirebase,
  connect((state) => ({
      profile: state.firebase.profile,
      auth: state.firebase.auth
  })),
);

export default enhance(inputSW);

const styles = StyleSheet.create({
  addContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 10,
    padding: 5,
    width: `${100}%`,
  },
  iconInputContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  imagePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  iconPicture: {
    width: 35,
    height: 29,
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '69 + %',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginRight: 10,
  },
});

inputSW.propTypes = ({
  userPic: propTypes.string,
});

inputSW.defaultProps = ({
  userPic: '',
});
