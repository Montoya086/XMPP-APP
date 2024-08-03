import React, { ReactElement } from 'react'
import { LoadingContainer, Lottie } from './styles'
import { Portal } from 'react-native-portalize'

export interface LoadingProps {
  loading: boolean
  children: ReactElement
  lottieSource?: any
}

export const AppLoader: React.FC<LoadingProps> = ({ loading, children, lottieSource }) => {
  return (
    <>
      <Portal>
        <LoadingContainer hide={loading}>
          <Lottie source={lottieSource} autoPlay loop />
        </LoadingContainer>
      </Portal>
      {children}
    </>
  )
}
