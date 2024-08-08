import styled from '@emotion/native'

export const HeaderContainer = styled.View(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.sizes.sm,
    backgroundColor: theme.colors.primary,
    width: '100%',
    borderBottomRightRadius: theme.sizes.xxxs,
    borderBottomLeftRadius: theme.sizes.xxxs,
}))

export const ChatContainer = styled.View(({ theme }) => ({
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.background2,
}))

export const ChatWrapper = styled.View(({ theme }) => ({
    flex: 1,
    width: '100%',
}))

export const InputContainer = styled.View(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.sizes.sm,
    gap: theme.sizes.xs,
}))

export const SendButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.colors.primary,
    padding: theme.sizes.xs,
    borderRadius: theme.sizes.sm,
    justifyContent: 'center',
    alignItems: 'center',
}))

export const InputWrapper = styled.View(({ theme }) => ({
    flex: 1,
}))