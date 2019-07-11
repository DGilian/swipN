import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';

import * as firebase from 'firebase';
import dataUser from '../data/dataUsers';


export default class AllFriends extends PureComponent {
  
  state = {
    imgPath: '/',
  };

  componentDidMount() {

  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
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
