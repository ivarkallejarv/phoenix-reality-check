import { action, observable, reaction } from 'mobx'
import { CameraStore } from './CameraStore'
import Pubnub from 'pubnub'
import { Answer, ClientAnswerMessage, ClientEvent, ClientHelloMessage, GameEvent, Message } from '../../ApiTypes'

export interface Player {
  clientId: string
  name: string
  vip: boolean
}

export interface GameType {
  status: GameEvent
  playerList: Player[]
  question: string
  target: string
  answer: Answer
  answerList: Answer[]
}

const publishKey = 'pub-c-bd289ae2-d65d-4100-8ddd-a514558bbf7a'
const subscribeKey = 'sub-c-51d1abbe-ce3b-11e9-9b51-8ae91c2a8a9f'

export class RootStore {
  cameraStore = new CameraStore(this)

  @observable userName = ''
  @observable channelID = ''
  @observable UUID = Pubnub.generateUUID()
  @observable PubNubInstance = new Pubnub({ publishKey, subscribeKey, uuid: this.UUID })

  @observable game: GameType = {
    status: null,
    playerList: [],
    question: '',
    target: '',
    answer: null,
    answerList: [],
  }

  @action setChannelID = (value) => (this.channelID = value)
  @action setUserName = (value) => {
    this.userName = value
    this.sendMessage({ sender: this.UUID, content: { type: ClientEvent.HELLO, value: this.userName } })
  }

  constructor() {
    reaction(() => [this.channelID], () => this.initialize())
  }

  initialize = () => {
    this.PubNubInstance.subscribe({ channels: [this.channelID], withPresence: true })

    this.PubNubInstance.addListener({
      message: function({ message }) {
        rootStore.handleMessage(message)
      },
    })
  }

  handleMessage = ({ content }) => {
    const { type, value } = content
    this.game.status = type
    switch (type) {
      case GameEvent.CLIENT_JOINED:
      case GameEvent.CLIENT_LEFT:
      case GameEvent.START:
        this.game.playerList = value
        break
      case GameEvent.QUESTION:
        if (value === String) {
          this.game.target = value
          break
        }

        const { players, question, to } = value
        this.game.playerList = players
        this.game.question = question

        let user = { name: 'Unknown' }
        if (this.game.playerList) {
          user = this.game.playerList.find(({ clientId }) => clientId === to)
        }

        this.game.target = user.name
        break
      case GameEvent.ROUND_END:
        this.game.answer = value
        break
      case GameEvent.END:
        this.game.answerList = value
        break
      default:
        console.log('Different kind of event => ', type, value)
        break
    }
  }

  sendMessage = (
    message:
      | Message<ClientHelloMessage>
      | Message<ClientAnswerMessage>
      | { sender: string; content: { type: ClientEvent } },
  ) => {
    this.PubNubInstance.publish({ message, channel: this.channelID }, () => {})
  }

  getClientName = (ID: string) => {
    if (this.game.playerList && ID) {
      const { name } = this.game.playerList.find(({ clientId }) => clientId === ID)
      return name
    }
    return 'No name found'
  }
}

export const rootStore = new RootStore()
