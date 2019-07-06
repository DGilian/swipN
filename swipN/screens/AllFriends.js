import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';

import * as firebase from 'firebase';
import dataUser from '../data/dataUsers';


// const firebaseConfig = {
//   apiKey: "AIzaSyAntFoolOZqB1pLONF7tYV9Cv9Q_cs3pLI",
//   authDomain: "swip-6e8e4.firebaseapp.com",
//   databaseURL: "https://swip-6e8e4.firebaseio.com",
//   projectId: "swip-6e8e4",
//   storageBucket: "swip-6e8e4.appspot.com",
//   messagingSenderId: "170254203030",
//   appId: "1:170254203030:web:db171c1c00b57c39"
// };
// firebase.initializeApp(firebaseConfig);

export default class AllFriends extends PureComponent {
  
  state = {
    imgPath: '/',
  };

  componentDidMount() {
    const images = firebase.storage().ref().child('swipe/31479554.png');
    images.getDownloadURL().then((url) => {
      this.setState({ imgPath: url })
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Image
                source={{ uri: this.state.imgPath }} // *********** todo
                style={styles.userImage}
              />
        <FlatList
          numColumns={3}
          data={dataUser}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.containerImage}
              onPress={() => navigate('Friend', { userPic: item.userPic, userName: item.userName })}
            >
              <Image
                source={{ uri: item.userPic }} // *********** todo
                style={styles.userImage}
              />
              <Text>{item.userName}</Text>
            </TouchableOpacity>
          )
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerImage: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    width: `${33}%`,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
});
