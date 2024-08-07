import styled from '@emotion/native'

export const DropDownButton = styled.TouchableOpacity(({ theme }) => ({
  flexDirection: 'row',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  paddingHorizontal: 5,
  paddingTop: theme.sizes.xs,
  paddingBottom: theme.sizes.xs-3,
  zIndex: 1,
  borderRadius: theme.sizes.xs,
  alignSelf: 'baseline'
}))

export const ContentContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingRight: theme.sizes.xs,
  width: '100%',
}))

export const Label = styled.Text(({ theme }) => ({
  fontSize: theme.sizes.sm,
  color: 'white',
}))

export const DropDown = styled.View<{
  width: number
}>(({ theme, width }) => ({
  position: 'absolute',
  top: 40,
  backgroundColor: 'white',
  maxWidth: width,
}))

export const Item = styled.TouchableOpacity<{
  isSelected?: boolean
}>(({ theme, isSelected }) => ({
  padding: theme.sizes.xs,
  backgroundColor: isSelected ? theme.colors.primary : 'white',
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.background3,
}))

export const ItemText = styled.Text<{
  isSelected?: boolean
}>(({ theme, isSelected }) => ({
  fontSize: theme.sizes.sm,
  color: isSelected ? 'white' : 'black',
}))

export const Chevron = styled.View<{
  visible: boolean
}>(({ theme, visible }) => ({
  transform: [{ rotate: visible ? '180deg' : '0deg' }],
}))

export const ModalContainer = styled.SafeAreaView<{
  isSearching: boolean
}>(({ theme, isSearching }) => ({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: isSearching ? '70%' : '50%',
  backgroundColor: 'white',
  borderTopRightRadius: theme.sizes.xs,
  borderTopLeftRadius: theme.sizes.xs,
}))

export const ModalWrapper = styled.View(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.sizes.xs,
  gap: theme.sizes.xs,
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

export const ErrorText = styled.Text(({ theme }) => ({
  color: theme.colors.error,
  fontSize: theme.sizes.xs,
}))
