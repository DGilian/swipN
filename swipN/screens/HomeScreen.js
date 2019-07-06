import React, { PureComponent } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import Message from '../components/Message';

import joinMessageUser from '../data/joinMessageUser';
import color from '../constants/colors';

import { getNotes } from '../firebase/get'

export default class HomeScreen extends PureComponent {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      notes: [],
    };
  }

  async componentDidMount() {
    const result = await getNotes();
    this.setState({
      notes: result,
      isLoading: false,
    });
  }

  onSwipeLeft(state) {
    console.log(state)
  }

  render() {
    const { navigation } = this.props;
    if (this.state.isLoading) {
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
            data={this.state.notes}
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
