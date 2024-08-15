import styled from '@emotion/native'

export const Container = styled.TouchableOpacity(({ theme }) => ({
    width: '100%',
    borderRadius: theme.sizes.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.foreground0,
    flexDirection: "row"
}))

export const Text = styled.Text<{
    active: boolean
}>(({ theme,active }) => ({
    color: active ? theme.colors.foreground0 : "gray",
    fontSize: theme.sizes.sm,
}))

export const TextContainer = styled.View<{
    active: boolean
}>(({ theme, active }) => ({
    padding: theme.sizes.xs,
    borderRadius: theme.sizes.xs,
    backgroundColor: active ? theme.colors.background1 : theme.colors.background0,
    width: "50%",
    justifyContent: "center",
    alignItems: "center"
}))