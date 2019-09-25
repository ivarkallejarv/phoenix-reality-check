import React from 'react'
import { observer } from 'mobx-react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { rootStore } from '../stores/Rootstore'
import { GameEvent } from '../../ApiTypes'

export const GameView = observer(() => {
  const { channelID, userName, game, UUID, sendMessage } = rootStore

  const getClientName = (ID) => {
    if (game.playerList) {
      const { name } = game.playerList.find(({ clientId }) => clientId === ID)
      return name
    }
    return 'No name found'
  }

  switch (game.status) {
    case GameEvent.QUESTION:
      return (
        <View style={styles.container}>
          <Text>Current Question</Text>
          <Text>{game.question}</Text>

          {UUID && game.target ? (
            <View>
              {game.playerList &&
                game.playerList.map(({ name, vip }, index) => (
                  <Button
                    key={`player-${index}`}
                    title={name}
                    onPress={() => sendMessage({ sender: UUID, content: { type: GameEvent.QUESTION, value: name } })}
                  />
                ))}
            </View>
          ) : (
            <Text>Be patient, another player is answering atm</Text>
          )}
        </View>
      )
    case GameEvent.ROUND_END:
      return (
        <View>
          <Text>Question that was answered {game.answer && game.answer.question}</Text>
          <Text>Answer {game.answer && getClientName(game.answer.clientId)}</Text>
        </View>
      )
    case GameEvent.END:
      return (
        <View>
          <Text>The game has ended</Text>
          <Text>All answers </Text>

          {game.answerList &&
            game.answerList.map(({ clientId, question }, index) => (
              <View key={`Answer-${index}`}>
                <Text>{question}</Text>
                <Text>{getClientName(clientId)}</Text>
              </View>
            ))}
        </View>
      )
    default:
      return (
        <View style={styles.container}>
          <Text>Waiting for game to start</Text>

          <Text>Channel ID: {channelID}</Text>
          <Text>Username: {userName}</Text>

          <Text>Players that have joined currently</Text>
          {game.playerList &&
            game.playerList.map(({ name, vip }, index) => (
              <Text key={`player-${index}`}>
                {name}
                {vip && 'VIP'}
              </Text>
            ))}
        </View>
      )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
