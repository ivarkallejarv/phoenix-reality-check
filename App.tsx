import React, { useEffect, useState } from 'react'
import * as Font from 'expo-font'
import { Router, Scene, Stack } from 'react-native-router-flux'
import { IndexView } from './src/views/IndexView'
import { LobbyView } from './src/views/LobbyView'
import { GameView } from './src/views/GameView'
import { RouteNames } from './GlobalEnums'
import { View, Text } from 'react-native'

export type RouteList = {
  [key in RouteNames]: { pattern: string; component: () => React.ReactElement; title: string }
}

export const ROUTES: RouteList = {
  [RouteNames.CONNECT]: { pattern: RouteNames.CONNECT, component: IndexView, title: 'Welcome to Reality Check' },
  [RouteNames.LOBBY]: { pattern: RouteNames.LOBBY, component: LobbyView, title: 'Lobby' },
  [RouteNames.GAME]: { pattern: RouteNames.GAME, component: GameView, title: 'Playing Game' },
}

export default function App() {
  const [appIsReady, setAppState] = useState(false)

  useEffect(() => {
    loadAssetsAsync()
  })

  const loadAssetsAsync = async () => {
    await Font.loadAsync({
      'rounded-mplus': require('./assets/fonts/MPLUSRounded1c-Regular.ttf'),
    })
    setAppState(true)
  }

  return appIsReady ? (
    <Router>
      <Stack key="root">
        {Object.values(ROUTES).map(({ pattern, component, title }) => (
          <Scene key={pattern} component={component} title={title} hideNavBar={true} />
        ))}
      </Stack>
    </Router>
  ) : (
    <View>
      <Text>Loading, please wait</Text>
    </View>
  )
}
