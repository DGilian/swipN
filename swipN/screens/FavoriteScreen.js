import React, { PureComponent } from 'react';
import { View, FlatList } from 'react-native';
import Message from '../components/Message';
import joinFavoriteMessageUser from '../data/joinFavoriteMessageUser';

class FavoriteScreen extends PureComponent{
  render() {
    const { navigation } = this.props;
    return(
      <View>
        <FlatList
          data={joinFavoriteMessageUser}
          renderItem={({ item }) => (
            <Message
              navigation={navigation}
              key={item.key}
              id={item.id}
              userName={item.userName}
              userPic={item.userPic}
              description={item.description}
              time={item.time}
              totalLike={item.totalLike}
              totalComments={item.totalComments}
              messagePic={item.picture}
              screen={'myFavorites'}
            />)}
        />
      </View>
    )
  }
}

export default FavoriteScreen