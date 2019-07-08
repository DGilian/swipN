import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { withFirebase, isEmpty } from 'react-redux-firebase';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Login extends Component {

  constructor() {
    super()
    this.state = {
      status: 'signIn',    //    'signIn' ||'signUp' || 'forgotPassword'
      email: '',
      password: '',
      username: '',
      errorMessage: '',
    }
  }

  componentWillReceiveProps({auth, navigation}) {
    if (!isEmpty(auth)) {
      navigation.navigate('App');
    }
  }

  onSignIn = () => {
    const { firebase } = this.props
    firebase.login({
      email: this.state.email,
      password: this.state.password
    })
      .then((e) => {
          this.setState({
              errorMessage: '',
              email: '',
              password: ''
          });
          this.props.navigation.navigate('App');
      })
      .catch((e) => {
          this.setState({errorMessage: e.message});
      });
  }

  register = () => {
    const { firebase } = this.props
    firebase.createUser(
      { email: this.state.email , password: this.state.password},
      { username: this.state.username, email: this.state.email, avatar: 'https://firebasestor...8-b92e-0027b312ff38'},
    ).then((e)=> {
      this.setState({
        email: '',
        password: '',
        username: '',
      })
      this.props.navigation.navigate('AuthLoading');
    })
    .catch((error) => {
      this.setState({ errorMessage: error.message})
    });
  }

  render() {
    // console.log(this.props.firebase)
    return (
      <LinearGradient
        style={styles.containerAll}
        colors={['#243857', '#151930']}
        start={[0.5, 0.25]}
        end={[0.46, 0.93]}
      >
        <View style={styles.container}>
          <Text style={styles.title}>SwipNotes</Text>
          {this.state.status === 'signIn'
            && (
              <View style={styles.signInContainer}>
                <View style={styles.containerInput}>
                  <TextInput
                    style={styles.input}
                    placeholder="Login"
                    onChangeText={(value) => this.setState({email: value})}
                    onSubmitEditing={() => console.log('onSubmit')}
                    placeholderTextColor="#fff"
                    autoCapitalize={word='none'}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={(value) => this.setState({password: value})}
                    onSubmitEditing={() => console.log('onSubmit')}
                    placeholderTextColor="#fff"
                    autoCapitalize={word='none'}
                    secureTextEntry={true}
                  />
                </View>
                <View style={styles.signIn}>
                  <Button
                    title="Sign In"
                    color="#fff"
                    onPress={()=> this.onSignIn()}
                  />
                </View>
                {this.state.errorMessage !== ''
                  && (
                    <View>
                      <Text style={styles.errorMessages}>{this.state.errorMessage}</Text>
                    </View>
                  )
                }
                <Text style={styles.forgotPass}>
                  Forgot Password ?
                </Text>
                <View style={styles.signUp}>
                  <Button
                    title="Sign Up"
                    color="#fff"
                    onPress={()=> this.setState({ status: 'signUp', errorMessage:''})}
                  />
                </View>
              </View>
            )
          }
          {this.state.status === 'signUp'
            && (
              <View style= {styles.signInContainer}>
                <View style={styles.containerInput}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={(value) => this.setState({username: value})}
                    onSubmitEditing={() => console.log('onSubmit')}
                    placeholderTextColor="#fff"
                    autoCapitalize={word='none'}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Adress Email"
                    onChangeText={(value) => this.setState({email: value})}
                    onSubmitEditing={() => console.log('onSubmit')}
                    placeholderTextColor="#fff"
                    autoCapitalize={word='none'}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={(value) => this.setState({password: value})}
                    onSubmitEditing={() => console.log('onSubmit')}
                    placeholderTextColor="#fff"
                    autoCapitalize={word='none'}
                  />
                </View>
                <View style={styles.signIn}>
                  <Button
                    title="Register"
                    color="#fff"
                    onPress={this.register}
                  />
                </View>
                {this.state.errorMessage !== ''
                  && (
                    <View>
                      <Text style={styles.errorMessages}>{this.state.errorMessage}</Text>
                    </View>
                  )
                }
                <View style={styles.signUp}>
                  <Button
                    title="Sign In"
                    color="#fff"
                    onPress={()=>  this.props.navigation.navigate('AuthLoading')}
                  />
                </View>
              </View>
            )
          }
    
        </View>
      </LinearGradient>
    );
  }
}

const enhance = compose(
  withFirebase,
  connect(state => (
    {
    auth: state.firebase.auth,
  })),
);

export default enhance(Login);


Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  auth: PropTypes.objectOf(PropTypes.string),
};

Login.defaultProps = {
  navigation: {
    navigate: () => {},
  },
  auth: {},
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  signInContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 27,
  },
  containerInput: {
    marginTop: 50,
  },
  input: {
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 100,
    height: 40,
    width: 340,
    marginTop: 30,
    color: '#fff',
    backgroundColor: '#0c1624',
  },
  errorMessages: {
    color: 'red',
    fontSize: 20,
    width: 340,
    textAlign: 'center',
    padding: 20,
  },
  signIn: {
    backgroundColor: '#0c1624',
    height: 40,
    width: 340,
    borderRadius: 5,
    color: '#fff',
    marginTop: 30,
    marginBottom: 40,
  },
  forgotPass: {
    color: '#fff',
  },
  signUp: {
    backgroundColor: '#0c1624',
    height: 40,
    width: 150,
    borderRadius: 5,
    color: '#fff',
    marginTop: 70,
  },

});
