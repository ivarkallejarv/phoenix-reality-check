import React from 'react'
import { observer } from 'mobx-react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { rootStore } from '../stores/Rootstore'
import { ClientEvent, GameEvent } from '../../ApiTypes'
import { styles } from './IndexView'

export const GameView = observer(() => {
  const { userName, game, UUID: sender, sendMessage, getClientName } = rootStore
  const isVIP = game.playerList && game.playerList.find(({ clientId, vip }) => clientId === sender && vip)

  const SendAnswer = (clientId) => () =>
    sendMessage({ sender, content: { type: ClientEvent.ANSWER, value: { clientId } } })
  const StartGame = () => sendMessage({ sender, content: { type: ClientEvent.START_GAME } })

  switch (game.status) {
    case GameEvent.START:
    case GameEvent.QUESTION:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{game.question}</Text>

          {userName === game.target ? (
            <>
              {game.playerList &&
                game.playerList.map(({ clientId, name, vip }, index) => (
                  <TouchableOpacity key={`player-${index}`} onPress={SendAnswer(clientId)} style={styles.button}>
                    <Text style={styles.buttonText}>{name}</Text>
                  </TouchableOpacity>
                ))}
            </>
          ) : (
            <Text style={styles.body}>{game.target} is answering, waiting for your turn</Text>
          )}
        </View>
      )
    case GameEvent.END:
      return (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.scrollBody}>
            <Text style={styles.title}>Results</Text>
            {game.answerList &&
              game.answerList.map(({ clientId, question }, index) => (
                <View key={`Answer-${index}`}>
                  <Text style={styles.body}>{question}</Text>
                  <Text style={styles.body}>{getClientName(clientId)}</Text>
                </View>
              ))}
            {isVIP && (
              <TouchableOpacity onPress={StartGame} style={styles.button}>
                <Text style={styles.buttonText}>Restart Game</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      )
    case GameEvent.ROUND_END:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Round has ended, please wait for next round</Text>
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

          {isVIP && (
            <TouchableOpacity onPress={StartGame} style={styles.button}>
              <Text style={styles.buttonText}>Start Game</Text>
            </TouchableOpacity>
          )}
        </View>
      )
  }
})
