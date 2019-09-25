import { action, observable, runInAction } from 'mobx'
import * as Permissions from 'expo-permissions'

export class CameraStore {
  rootStore = null
  @observable hasCameraPermission = null

  @action requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    runInAction(() => (this.hasCameraPermission = status === 'granted'))
  }

  constructor(rootStore) {
    this.rootStore = rootStore

    Permissions.getAsync(Permissions.CAMERA)
      .then(({ status }) => (this.hasCameraPermission = status === 'granted'))
      .catch((e) => console.log(e))
  }
}
