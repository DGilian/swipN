import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import { View, Image, TextInput, Button, StyleSheet } from 'react-native';
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import color from '../constants/colors';
import moment from 'moment';
import { db } from '../firebase/config'

// redux
import { connect } from 'react-redux'

// firebase
import { compose } from 'recompose';
import { withFirebase } from 'react-redux-firebase'

class inputSW extends PureComponent {
  constructor() {
    super();
    this.state = {
      content: '',
    };
  }

  addItem = description => {

    const { profile, auth } = this.props

    db.ref('/notes').push({
      description: description,
      userId: auth.uid,
      picture: "https://www.am-today.com/sites/default/files/articles/9986/mclaren-p1.jpg",
      time: moment(Date.now()).format(),
      totalComments: 0,
      totalLike: 0,
      totalComments: 0,
      totalLike: 0,
    });
  };

  publish = () => {
    // publish
    console.log(this.state.content)
    this.addItem(this.state.content);
    return this.setState({ content: '' });
  }

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
        <View style={styles.buttonContainer}>
          <MaterialCommunityIcons
            name="send"
            size={28}
            color={color.colorIcon}
            onPress={() => this.publish()}
          />
        </View>
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
