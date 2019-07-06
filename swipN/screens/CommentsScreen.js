import React, { PureComponent } from 'react';
import { View, FlatList, TextInput, StyleSheet, ScrollView, Button, Image } from 'react-native';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import Comment from '../components/Comment';

import color from '../constants/colors';

import dataUser from '../data/dataUsers';
import joinCommentUser from '../data/joinCommentUser';

export default class CommentsScreen extends PureComponent {
  constructor() {
    super();
    this.state = {
      comment: '',
    };
  }

  publish = () => {
    return this.setState({ comment: '' });
  }

  render() {
    const { navigation } = this.props;
    return (
      <KeyboardAwareView style={styles.container}>
        <ScrollView>
          <FlatList
            data={joinCommentUser}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Comment
                userPic={item.userPic}
                userName={item.userName}
                time={item.time}
                description={item.content}
                navigation={navigation}
              />
            )
            }
          />
        </ScrollView>

        <View style={styles.addContainer}>
          <View style={styles.iconInputContainer}>
            <Image
              source={{ uri: dataUser[2].userPic }} // *********** todo
              style={styles.userImage}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Yours comments"
              multiline
              onChangeText={text => this.setState({ comment: text })}
              value={this.state.comment}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Publish"
              color={color.sendButton}
              onPress={() => this.publish()}
            />
          </View>
        </View>
      </KeyboardAwareView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingLeft: 10,
    padding: 5,
  },
  iconInputContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: `${69}%`,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
});
