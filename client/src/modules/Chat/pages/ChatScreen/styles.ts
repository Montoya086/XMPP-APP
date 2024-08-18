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

export const FileButton = styled.TouchableOpacity(({ theme }) => ({
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
    gap: theme.sizes.xxs,
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

export const UserStatusContainer = styled.TouchableOpacity(({ theme }) => ({
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

export const ContactItem = styled.TouchableOpacity<{
    isSelected: boolean
}>(({ theme, isSelected }) => ({
    padding: theme.sizes.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background1,
    borderLeftWidth: isSelected ? 10 : 5,
    borderLeftColor: theme.colors.primary,
}))

export const ContactItemNameStatus = styled.View(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.sizes.xs,
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

export const AddContactModalContainer = styled.View(({ theme }) => ({
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: theme.colors.background0,
    padding: theme.sizes.sm,
    marginVertical: theme.sizes.xxxl,
    margin: theme.sizes.sm,
    borderRadius: theme.sizes.xs,
    gap: theme.sizes.xs,
}))

const getColor = (status: "online" | "away" | "xa" | "dnd" | "offline") => {
    switch(status){
        case "online":
            return "#00FF00";
        case "away":
            return "#FFFF00";
        case "xa":
            return "#FFA500";
        case "dnd":
            return "#FF0000";
        case "offline":
            return "gray";
    }
}

export const StatusBall = styled.View<{status: "online" | "away" | "xa" | "dnd" | "offline"}>(({ theme,status }) => ({
    width: theme.sizes.xs,
    height: theme.sizes.xs,
    borderRadius: theme.sizes.xs,
    backgroundColor: getColor(status),
    borderWidth: 1,
    borderColor: theme.colors.foreground4,
}))

export const StatusCard = styled.TouchableOpacity(({ theme }) => ({
    padding: theme.sizes.xs,
    borderRadius: theme.sizes.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.foreground0,
    width: '100%',
    flexDirection: 'row',
    gap: theme.sizes.xs,
}))

export const FileContainer = styled.TouchableOpacity(({ theme }) => ({
    flexDirection: "row",
    gap: theme.sizes.xs,
    borderWidth: 1,
    borderColor: theme.colors.background0,
    borderRadius: theme.sizes.xxs,
    padding: theme.sizes.xs,
    justifyContent: "center",
    alignItems: "center"
}))

export const NotificationContainer = styled.View(({ theme }) => ({
    width: "100%",
    padding: theme.sizes.xs,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBlockColor: "#000",
    gap: theme.sizes.xs
}))

export const NotificationTextContainer = styled.View(({ theme }) => ({
    flexDirection: "row",
    gap: theme.sizes.xxs
}))

export const NotificationButtonsContainer = styled.View(({ theme }) => ({
    flexDirection: "row",
    gap: theme.sizes.xxs
}))

export const AcceptButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.colors.success,
    flex: 1,
    padding: theme.sizes.xxs,
    alignItems: "center",
    justifyContent: "center"
}))

export const RejectButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.colors.error,
    flex: 1,
    padding: theme.sizes.xxs,
    alignItems: "center",
    justifyContent: "center"
}))