import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';

export default class Sms extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <ScrollView style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <Text
                style={item.userId === '1' ? styles.smsFriend : styles.smsUser}
                key={item.id}
              >
                {item.content}
              </Text>
            </View>
          )}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  smsFriend: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 8,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  smsUser: {
    backgroundColor: 'rgba(0, 255, 0, 1.0)',
    margin: 10,
    padding: 8,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
});

Sms.propTypes = ({
  data: propTypes.array,
});

Sms.defaultProps = ({
  data: [],
});
