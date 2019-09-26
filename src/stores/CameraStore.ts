import { action, observable, runInAction } from 'mobx'
import * as Permissions from 'expo-permissions'
import { RootStore } from './Rootstore'

export class CameraStore {
  rootStore: RootStore
  @observable hasCameraPermission = false

  @action requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    runInAction(() => (this.hasCameraPermission = status === 'granted'))
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore

    Permissions.getAsync(Permissions.CAMERA)
      .then(({ status }) => (this.hasCameraPermission = status === 'granted'))
      .catch((e) => console.log(e))
  }
}
