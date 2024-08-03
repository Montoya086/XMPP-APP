import styled from '@emotion/native'

export const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background2,
}))

export const SafeContainer = styled.SafeAreaView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background2,
}))

export const ScreenWrapper = styled.View(({ theme }) => ({
  flex: 1,
  padding: theme.sizes.sm,
  justifyContent: 'center',
  alignItems: 'center',
}))
