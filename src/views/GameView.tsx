import React from 'react'
import { observer } from 'mobx-react'
import { Text, TouchableOpacity, View } from 'react-native'
import { rootStore } from '../stores/Rootstore'
import { ClientEvent, GameEvent } from '../../ApiTypes'
import { styles } from './IndexView'

export const GameView = observer(() => {
  const { userName, game, UUID, sendMessage } = rootStore

  const getClientName = (ID) => {
    if (game.playerList && ID) {
      const { name } = game.playerList.find(({ clientId }) => clientId === ID)
      return name
    }
    return 'No name found'
  }

  const sendAnswer = (clientId) => () => {
    sendMessage({ sender: UUID, content: { type: ClientEvent.ANSWER, value: { clientId } } })
  }

  switch (game.status) {
    case GameEvent.QUESTION:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{game.question}</Text>

          {userName === game.target ? (
            <>
              {game.playerList &&
                game.playerList.map(({ clientId, name, vip }, index) => (
                  <TouchableOpacity key={`player-${index}`} onPress={sendAnswer(clientId)} style={styles.button}>
                    <Text style={styles.buttonText}>{name}</Text>
                  </TouchableOpacity>
                ))}
            </>
          ) : (
            <Text style={styles.body}>{game.target} is answering, waiting for your turn</Text>
          )}
        </View>
      )
    case GameEvent.ROUND_END:
      return (
        <View style={styles.container}>
          <Text style={styles.body}>Question that was answered {game.answer && game.answer.question}</Text>
          <Text style={styles.body}>Answer {game.answer && getClientName(game.answer.clientId)}</Text>
        </View>
      )
    case GameEvent.END:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Results</Text>
          {game.answerList &&
            game.answerList.map(({ clientId, question }, index) => (
              <View key={`Answer-${index}`}>
                <Text style={styles.body}>{question}</Text>
                <Text style={styles.body}>{getClientName(clientId)}</Text>
              </View>
            ))}
        </View>
      )
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.body}>Waiting for game to start</Text>

          <Text style={styles.body}>Players that have joined currently</Text>
          <View>
            {game.playerList &&
              game.playerList.map(({ name, vip }, index) => (
                <Text style={styles.body} key={`player-${index}`}>
                  {name}
                  {vip && ' => VIP'}
                </Text>
              ))}
          </View>
        </View>
      )
  }
})
