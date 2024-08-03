import styled from '@emotion/native'

export const Container = styled.View(({ theme }) => ({
    width: '100%',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.sizes.xs,
}))

export const Wrapper = styled.View(({ theme }) => ({
   width: '100%',
   gap: theme.sizes.xxxs, 
}))

export const LabelText = styled.Text(({ theme }) => ({
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.sizes.sm,
}))