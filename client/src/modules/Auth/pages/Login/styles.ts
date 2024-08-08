import styled from '@emotion/native'

export const FormContainer = styled.View(({ theme }) => ({
    gap: theme.sizes.xs,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
}))

export const SignUpText = styled.Text(({ theme }) => ({
    color: theme.colors.primary,
    fontSize: theme.sizes.sm,
    fontWeight: 'bold',
}))

export const SignUpTextNormal = styled.Text(({ theme }) => ({
    color: theme.colors.foreground3,
    fontSize: theme.sizes.sm,
}))

export const Container = styled.View(({ theme }) => ({
    padding: theme.sizes.sm,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
}))