import React, { PureComponent } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Sms from '../components/Sms';
import InputSW from '../components/InputSW';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';

import dialog from '../data/dialog';
import dataUser from '../data/dataUsers';

export default class ChatFriend extends PureComponent {

  render() {
    return(
      <KeyboardAwareView>
        <LinearGradient
              style={styles.smsContainer}
              colors={['#243857', '#151930']}
              start={[0.5, 0.25]}
              end={[0.46, 0.93]}
            >
          <ScrollView
            style={styles.smsScrollView}
            // eslint-disable-next-line no-return-assign
            ref={ref => this.scrollView = ref}
            onContentSizeChange={() => {
              this.scrollView.scrollToEnd({ animated: false });
            }}
          >
            <Sms data={dialog} />
          </ScrollView>
          <InputSW
            userPic={dataUser[2].userPic}
            parent="chatFriend"
          />
        </LinearGradient>
      </KeyboardAwareView>
    )
  }
}

const styles = StyleSheet.create({
  smsContainer: {
    flex: 1,
  },
  smsScrollView: {
    marginBottom: 48.5,
  },
})