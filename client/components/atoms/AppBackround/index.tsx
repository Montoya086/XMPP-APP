import React from 'react'
import { Container, SafeContainer, ScreenWrapper } from './styles'
import { StyleProp, ViewStyle } from 'react-native'

interface AppBackgroundProps {
  isSafe?: boolean
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}
export const AppBackground: React.FC<AppBackgroundProps> = (props) => {
  if (props.isSafe) {
    return (
      <SafeContainer style={props.style}>
        <ScreenWrapper>
          {props.children}
        </ScreenWrapper>
      </SafeContainer>
    )
  }

  return <Container style={props.style}>{props.children}</Container>
}
