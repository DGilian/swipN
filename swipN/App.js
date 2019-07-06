import React from 'react';
import { Button, View } from 'react-native';
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
  HeaderBackButton,
  createSwitchNavigator,
} from 'react-navigation';

import { FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

import AuthLoadingScreen from './screens/AuthLoading';
import ProfilScreen from './screens/Profil';
import NewPost from './screens/NewPost';
import LoginScreen from './screens/Login';
import HomeScreen from './screens/HomeScreen';
import CommentsScreen from './screens/CommentsScreen';
import FriendScreen from './screens/FriendScreen';
import AllFriends from './screens/AllFriends';
import ChatFriend from './screens/ChatFriend';
import FavoriteScreen from './screens/FavoriteScreen';

import color from './constants/colors';


// redux

import { Provider } from 'react-redux'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { rrfProps, store } from './firebase/config'

// ** stack

const AuthStack = createStackNavigator({
  SignIn: {
    screen: LoginScreen,
    navigationOptions: () => ({
      title: 'Login',
      header: null,
    }),
  },
});

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: () => ({
      title: 'SwipNotes',
    }),
  },
  Comments: {
    screen: CommentsScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Comments',
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    }),
  },
  Friend: {
    screen: FriendScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Friend',
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    }),
  },
  ChatFriend: {
    screen: ChatFriend,
    navigationOptions: ({ navigation }) => ({
      title: 'Chat Friend',
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    }),
  },
});

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const newPostNavigator = createStackNavigator({
  NewPost: {
    screen: NewPost,
    navigationOptions: ({ navigation }) => ({
      title: 'New Message',
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    }),
  },
});

newPostNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index === 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};


const allFriendsNavigator = createStackNavigator({
  AllFriends: {
    screen: AllFriends,
    navigationOptions: () => ({
      title: 'My Friends',
    }),
  },
  Friend: {
    screen: FriendScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Friend',
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    }),
  },
  ChatFriend: {
    screen: ChatFriend,
    navigationOptions: ({ navigation }) => ({
      title: 'Chat Friend',
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    }),
  },
});

allFriendsNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const ProfilStack = createStackNavigator({
  Profil: {
    screen: ProfilScreen,
    navigationOptions: () => ({
      title: 'My Profil',
    }),
  },
  Comments: {
    screen: CommentsScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Comments',
      headerLeft: <HeaderBackButton onPress={() => { navigation.goBack(null); }} />,
    }),
  },
  Friend: {
    screen: FriendScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Friend',
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    }),
  },
  ChatFriend: {
    screen: ChatFriend,
    navigationOptions: ({ navigation }) => ({
      title: 'Chat Friend',
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    }),
  },
});

ProfilStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const favoriteStack = createStackNavigator({
  Favorite: {
    screen: FavoriteScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'My favorites',
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    }),
  },
  Friend: {
    screen: FriendScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Friend',
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    }),
  },
});

// ** bottomtab
const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeStack,
    navigationOptions: {
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ focused }) => {
        return focused ? <MaterialCommunityIcons name="home" size={24} color={color.tabBarIcon} />
          : <MaterialCommunityIcons name="home-outline" size={24} color={color.tabBarIcon} />;
      },
    },
  },
  Favorite: {
    screen: favoriteStack,
    navigationOptions: {
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ focused }) => {
        return focused ? <MaterialCommunityIcons name="star-circle" size={26} color={color.postIcon}
      />
          : <MaterialCommunityIcons name="star-circle-outline" size={26} color={color.tabBarIcon} />;
      },
    },
  },
  NewPost: {
    screen: newPostNavigator,
    navigationOptions: {
      tabBarIcon: () => {
        return (
          <View>
            <AntDesign name="pluscircleo" size={30} color={color.tabBarIcon} />
          </View>
        )
      },
    },
  },
  AllFriends: {
    screen: allFriendsNavigator,
    navigationOptions: {
      tabBarIcon: () => {
        return <FontAwesome name="users" size={24} color={color.tabBarIcon} />
      },
    },
  },
  Profil: {
    screen: ProfilStack,
    navigationOptions: {
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ focused }) => {
        return focused ? <FontAwesome name="user" size={24} color={color.tabBarIcon} />
          : <FontAwesome name="user-o" size={24} color={color.tabBarIcon} />;
      },
    },
  },
},
{
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeBackgroundColor: color.tabBar, // Couleur d'arrière-plan de l'onglet sélectionné
    inactiveBackgroundColor: color.tabBar, // Couleur d'arrière-plan des onglets non sélectionnés
    showLabel: false, // On masque les titres
    showIcon: true, // On informe le TabNavigator qu'on souhaite afficher les icônes définis
  },
});

// ** switch
const switchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: TabNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

let Navigation = createAppContainer(switchNavigator);

// For Redux
// Render the app container component with the provider around it
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <Navigation />
      </ReactReduxFirebaseProvider>
    </Provider>
    );
  }
}