import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Button, StyleSheet, Text, View } from 'react-native'
import { rootStore } from '../stores/Rootstore'
import { Actions } from 'react-native-router-flux'
import { RouteNames } from '../../GlobalEnums'

export const IndexView = observer(() => {
  const [displayBarCodeScanner, setBarCodeScanner] = useState(false)
  const { cameraStore, setChannelID } = rootStore
  const { hasCameraPermission, requestCameraPermission } = cameraStore

  const scannedQRCode = ({ data }) => {
    if (displayBarCodeScanner) {
      setChannelID(data)
      setBarCodeScanner(false)
      Actions.replace(RouteNames.LOBBY)
    }
  }

  if (!hasCameraPermission) {
    return (
      <View style={styles.container}>
        <Text>To connect to a game, we need permission to use the camera</Text>
        <Button title="Allow Camera for this app" onPress={requestCameraPermission} />
      </View>
    )
  }

  if (displayBarCodeScanner) {
    return <BarCodeScanner onBarCodeScanned={scannedQRCode} style={StyleSheet.absoluteFillObject} />
  }

  return (
    <View style={styles.container}>
      <Text>To connect to a game, scan QR code from the host.</Text>
      <Button title="Scan QR Code" onPress={() => setBarCodeScanner(true)} />
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
