import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

export const TYPE        = 'mobile'
export const getClientId = () => DeviceInfo.getUniqueID()
export const PLATFORM    = Platform.OS
export const isEmulator  = () => DeviceInfo.isEmulatorSync()
