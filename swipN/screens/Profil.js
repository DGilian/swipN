import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, FlatList, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import color from '../constants/colors';

import user from '../data/dataUsers';
import Message from '../components/Message';
import joinFavoriteMessageUser from '../data/joinFavoriteMessageUser';
import joinMyMessageUser from '../data/joinMyMessageUser';

export default class Profil extends PureComponent {
  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={styles.container}>
          <LinearGradient
            colors={['#243857', '#151930']}
            start={[0.5, 0.25]}
            end={[0.46, 0.93]}
            style={styles.header}
          >
            <Image
              source={{ uri: user[3].userPic }}
              style={styles.contentImage}
            />
            <Text style={styles.userName}>UserName</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
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
