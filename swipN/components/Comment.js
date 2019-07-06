import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import { StyleSheet, View, Text, Image, Platform, TouchableOpacity } from 'react-native';
import moment from 'moment';

import color from '../constants/colors';

export default class Comment extends PureComponent {
  render() {
    const { userPic, userName, time, description, navigation } = this.props;
    return (
      <View style={styles.container} ignoredStyles={['sans-serif']}>
        <View style={styles.head}>
          <TouchableOpacity
            style={styles.user}
            onPress={() => navigation.navigate('Friend', { userPic, userName })}
          >
            <Image
              source={{ uri: userPic }}
              style={styles.userImage}
            />
            <Text style={styles.userName}>{userName}</Text>
          </TouchableOpacity>
          <Text style={styles.postTime}>{moment(time).startOf('hour').fromNow()}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.contentText}>{description}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        fontFamily: 'Optima',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
    backgroundColor: 'white',
    marginTop: 0,
    height: 'auto',
  },
  fontIfIgnored: {
    fontFamily: 'sans-serif',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.background,
    paddingLeft: 10,
    marginTop: 10,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
  },
  postTime: {
    fontSize: 10,
    marginLeft: 30,
    opacity: 0.5,
  },
  content: {
    backgroundColor: 'white',
    marginLeft: 35,
  },
  contentImage: {
    width: 'auto',
    height: 211,
  },
  contentText: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 15,
  },
});

Comment.propTypes = ({
  userPic: propTypes.string,
  userName: propTypes.string,
  time: propTypes.string,
  description: propTypes.string,
});

Comment.defaultProps = ({
  userPic: '',
  userName: 'hello',
  time: '',
  description: '',
});
