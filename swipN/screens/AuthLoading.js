import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { withFirebase, isEmpty } from 'react-redux-firebase';
import { compose } from 'recompose';
import { connect } from 'react-redux';

class AuthLoadingScreen extends PureComponent {
  constructor() {
    super();
  }

  componentWillReceiveProps({auth, navigation}) {
    if (!isEmpty(auth)) {
      navigation.navigate('App');
    }
    !isEmpty(auth) ? navigation.navigate('App') : navigation.navigate('Auth')
  }

  render() {
    'renderAuthLoading'
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


const enhance = compose(
  withFirebase,
  connect(state => (
    {
    auth: state.firebase.auth,
  })),
);

export default enhance(AuthLoadingScreen);
