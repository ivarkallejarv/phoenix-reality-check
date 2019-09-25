import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { rootStore } from '../stores/Rootstore'
import { Actions } from 'react-native-router-flux'
import { RouteNames } from '../../GlobalEnums'

export const LobbyView = observer(() => {
  const [name, setName] = useState('')
  const { channelID, setUserName } = rootStore

  const JoinGame = () => {
    setUserName(name || 'Anonymous')
    Actions.replace(RouteNames.GAME)
  }

  return (
    <View style={styles.container}>
      <Text>Joining channel with ID: {channelID}</Text>
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Button title="Join Game" onPress={JoinGame} />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
