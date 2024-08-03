import styled from '@emotion/native'

export const Container = styled.TouchableOpacity(({ theme }) => ({
    width: '100%',
    padding: theme.sizes.xs,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.sizes.xs,
    alignItems: 'center',
}))

export const Text = styled.Text(({ theme }) => ({
    color: theme.colors.background0,
    fontSize: theme.sizes.sm,
}))