import styled from '@emotion/native'
import LottieView from 'lottie-react-native'
import { View } from 'react-native'

export const LoadingContainer = styled(View)<{ hide: boolean }>(({ hide }) => ({
  display: hide ? 'flex' : 'none',
  flex: 1,
  justifyContent: 'center',
  backgroundColor: '#cacaca90',
  alignItems: 'center',
}))

export const Lottie = styled(LottieView)(({}) => ({
  height: '65%',
  width: '65%',
}))
