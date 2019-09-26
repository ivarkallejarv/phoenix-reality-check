import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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

  if (displayBarCodeScanner) {
    return <BarCodeScanner onBarCodeScanned={scannedQRCode} style={StyleSheet.absoluteFillObject} />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reality Check</Text>
      {hasCameraPermission ? (
        <>
          <Text style={styles.body}>To connect to a game, scan QR code from the host.</Text>
          <TouchableOpacity onPress={() => setBarCodeScanner(true)} style={styles.button}>
            <Text style={styles.buttonText}>Scan QR Code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.body}>To connect to a game, we need permission to use the camera</Text>
          <TouchableOpacity onPress={requestCameraPermission} style={styles.button}>
            <Text style={styles.buttonText}>Allow Camera for this app</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
})

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 40,
    paddingLeft: 45,
    paddingRight: 45,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#222222',
    paddingTop: 100,
    paddingBottom: 40,
    paddingLeft: 45,
    paddingRight: 45,
  },
  scrollBody: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 48,
    fontFamily: 'rounded-mplus',
  },
  subHeading: {
    color: '#fff',
    fontSize: 36,
    fontFamily: 'rounded-mplus',
  },
  body: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'rounded-mplus',
  },
  button: {
    backgroundColor: '#BFA936',
    borderRadius: 8,
    width: 330,
    height: 60,
  },
  buttonText: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'rounded-mplus',
  },
  input: {
    height: 60,
    width: 330,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 24,
  },
})
