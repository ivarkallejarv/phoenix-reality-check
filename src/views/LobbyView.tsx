import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { rootStore } from '../stores/Rootstore'
import { Actions } from 'react-native-router-flux'
import { RouteNames } from '../../GlobalEnums'
import { styles } from './IndexView'

export const LobbyView = observer(() => {
  const [name, setName] = useState('')
  const { setUserName } = rootStore

  const JoinGame = () => {
    setUserName(name || 'Anonymous')
    Actions.replace(RouteNames.GAME)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subHeading}>Enter your name to join the game</Text>
      <TextInput style={styles.input} value={name} onChangeText={(text) => setName(text)} />
      <TouchableOpacity onPress={JoinGame} style={styles.button}>
        <Text style={styles.buttonText}>Join Game</Text>
      </TouchableOpacity>
    </View>
  )
})
