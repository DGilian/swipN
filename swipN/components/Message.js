import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import propTypes from 'prop-types';
import moment from 'moment';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { isEmptyH } from '../helpers/helpers';

import color from '../constants/colors';

// redux
import { withFirebase } from 'react-redux-firebase';
import {connect} from 'react-redux'
import {compose} from 'recompose'

// set api
import { setLike } from '../firebase/set'

class Message extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLike: false,
      isFavorite: false,
      likes: 0,
    };
  }

  componentDidMount =()=> {
    console.log('didMoung message')
    this.setState({likes: this.props.totalLike.length})
    if(this.props.totalLike && this.props.totalLike.includes(this.props.auth.uid)){
      this.setState({isLike: true})
    }
  }


  toggleFavorite(id) {
    // Définition de notre action ici
    // const action = { type: "TOGGLE_FAVORITE", value: id}
    // this.props.dispatch(action)

    // a suppr
    // this.setState(prevState => ({ isFavorite: !prevState.isFavorite }))
  }

  setIsLike(noteId, currentUserId) {
    setLike(noteId, currentUserId)
    if(this.state.isLike) {
      this.setState({ isLike: false, likes: this.state.likes -1})
    }
    else {
      this.setState({ isLike: true, likes: this.state.likes +1})
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { id, description, userName, time, totalComments, userPic, messagePic, screen } = this.props;
    
    // redux
    const { auth } = this.props

    return ( 
      <View style={styles.container}>
        <View style={styles.head}>
          <TouchableOpacity
            style={styles.userContainer}
            onPress={() => navigate('Friend', { userPic, userName })}
          >
            <Image
              source={{ uri: userPic }}
              style={styles.userImage}
            />
            <Text style={styles.userName}>{userName}</Text>
          </TouchableOpacity>
          <Text style={styles.postTime}>{moment(time).startOf('minute').fromNow()}</Text>
        </View>
        <View style={styles.content}>
          {isEmptyH(messagePic)
            && (
            <Image
              source={{ uri: messagePic }}
              style={styles.contentImage}
            />
            )
          }
          {isEmptyH(description)
            && (
              <Text style={styles.contentText}>{description}</Text>
            )
          }
        </View>
        <View style={styles.commandContainer}>
          <TouchableOpacity onPress={() => this.setIsLike(id ,auth.uid)}>
            <View style={styles.command}>
              {this.state.isLike === false
                ? <Ionicons name="ios-heart-empty" size={24} color={color.postIcon} />
                : <Ionicons name="ios-heart" size={24} color={color.likeIcon} />
              }
              <Text style={styles.nbLike}>
                {this.state.likes}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('Comments')}>
            <View
              style={styles.command}
            >
              <MaterialCommunityIcons
                name="comment-multiple-outline"
                size={24}
                color={color.postIcon}
              />
              <Text style={styles.nbLike}>
                {totalComments.length}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.toggleFavorite(id)}>
            <View style={styles.command}>
              {(screen === 'home' || screen === 'friend')
              && (
              <MaterialCommunityIcons
                name={this.state.isFavorite ? 'star-circle' : 'star-circle-outline'}
                size={24}
                color={this.state.isFavorite ? color.isFavorite : color.postIcon}
              />
              )
              }
              {screen === 'myMessages'
                && (
                  <Feather
                    name="trash-2"
                    size={24}
                    color={color.postIcon}
                  />
                )
              }
              {screen === 'myFavorites'
                && (
                  <MaterialCommunityIcons
                    name="star-circle"
                    size={24}
                    color={color.postIcon}
                  />
                )
              }
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     // on recupere que les favories plutot que tout le state
//     favoritesNotes : state.favoritesNotes
//   }
// }

const enhance = compose(
  withFirebase,
  connect((state) => ({
      profile: state.firebase.profile,
      auth: state.firebase.auth
  })),
);

export default enhance(Message) 

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
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.background,
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
  },
  userContainer: {
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
  },
  contentImage: {
    width: 'auto',
    height: 211,
  },
  contentText: {
    padding: 10,
    ...Platform.select({
      ios: {
        fontFamily: 'Optima',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
  commandContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 50,
  },
  command: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  nbLike: {
    marginLeft: 10,
  },
});

Message.propTypes = ({
  navigation: propTypes.shape({ navigate: propTypes.func }),
  description: propTypes.string,
  userName: propTypes.string,
  time: propTypes.string,
  totalLike: propTypes.array,
  totalComments: propTypes.array,
  userPic: propTypes.string,
  messagePic: propTypes.string,
  screen: propTypes.string,
});

Message.defaultProps = ({
  navigation: {},
  description: '',
  userName: '',
  time: '',
  totalLike: [],
  totalComments: [],
  userPic: '',
  messagePic: '',
  screen: '',
});
