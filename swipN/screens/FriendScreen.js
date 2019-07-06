import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, FlatList, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';

import color from '../constants/colors';
import Message from '../components/Message';

import joinMyMessageUser from '../data/joinMyMessageUser';


export default class Friend extends PureComponent {
  constructor() {
    super();
  }

  render() {
    const { navigation } = this.props;
    const userPic = navigation.getParam('userPic', 'no-pic');
    const userName = navigation.getParam('userName', 'no-name');
    return (
      <KeyboardAwareView style={styles.container}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <LinearGradient
            style={styles.background}
            colors={['#243857', '#151930']}
            start={[0.5, 0.25]}
            end={[0.46, 0.93]}
          >
            <ScrollView
              style={styles.container}
            >
              <View style={styles.header}>
                <View style={styles.userContainer}>
                  <View style={styles.user}>
                    <Image
                      source={{ uri: userPic }}
                      style={styles.contentImage}
                    />
                    <Text style={styles.userName}>{userName}</Text>
                  </View>
                  <View style={styles.button}>
                    <Ionicons
                      name="md-chatboxes"
                      size={28}
                      color={color.unColorIcon}
                      onPress={() => navigation.navigate('ChatFriend')}
                    />
                  </View>
                </View>
              </View>
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
                        screen="friend"
                      />)}
                  />
            </ScrollView>
          </LinearGradient>
        </SafeAreaView>
      </KeyboardAwareView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
  },
  contentImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50+'%',
  },
  userName: {
    color: 'white',
    padding: 20,
  },
  button: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
    width: 50+'%',
    paddingRight: 30,
  },
});
