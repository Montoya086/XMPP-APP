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
    paddingVertical: theme.sizes.sm,
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

export const ChatBubble = styled.View<{
    isSender: boolean
}>(({ theme, isSender }) => ({
    backgroundColor: isSender ? theme.colors.quinary : theme.colors.primary,
    padding: theme.sizes.sm,
    borderRadius: theme.sizes.xs,
    maxWidth: '70%',
    minWidth: '30%',
    alignSelf: isSender ? 'flex-end' : 'flex-start',
    marginBottom: theme.sizes.xs,
}))

export const MenuContainer = styled.View(({ theme }) => ({
    backgroundColor: theme.colors.background0,
    padding: theme.sizes.sm,
    borderTopRightRadius: theme.sizes.xs,
    borderBottomRightRadius: theme.sizes.xs,
    flex: 1,
    width: '70%',
    flexDirection: 'column',
    gap: theme.sizes.xs,
}))

export const UserStatusWrapper = styled.View(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
}))

export const UserStatusContainer = styled.View(({ theme }) => ({
    flexDirection: 'column',
    alignItems: 'flex-start',
}))

export const ContactsContainer = styled.View(({ theme }) => ({
    flex: 1,
    width: '100%',
    padding: theme.sizes.xs,
}))

export const LogoutButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.colors.error,
    padding: theme.sizes.xs,
    borderRadius: theme.sizes.xxs,
    justifyContent: 'center',
    alignItems: 'center',
}))

export const ContactItem = styled.TouchableOpacity(({ theme }) => ({
    padding: theme.sizes.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background1,
    borderLeftWidth: 5,
    borderLeftColor: theme.colors.primary,
}))

export const SectionTitleContainer = styled.View(({ theme }) => ({
    padding: theme.sizes.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
}))

export const AddButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.colors.primary,
    padding: theme.sizes.xxs,
    borderRadius: theme.sizes.xxs,
    justifyContent: 'center',
    alignItems: 'center',
}))

export const NoChatWrapper = styled.View(({ theme }) => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.sizes.xs,
}))

export const NoChatText = styled.Text(({ theme }) => ({
    color: theme.colors.primary,
    fontSize: theme.sizes.lg,
    fontWeight: 'bold',
}))