import React, { FC, useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacityProps, View } from 'react-native'
import { Chevron, ContentContainer, DropDownButton, ErrorText, Item, ItemText, Label, LabelText, ModalContainer, ModalWrapper, Wrapper } from './styles'
import { useTheme } from '@emotion/react'
import Modal from 'react-native-modal'
import { Button } from '../Button'

export interface DropDownItem {
  label: string
  value: string
}

export const defaultItem: DropDownItem = {
  label: '',
  value: '',
}

export interface DropDownMenuProps {
  items: DropDownItem[]
  onSelect: (item: DropDownItem) => void
  menuProps?: TouchableOpacityProps
  itemProps?: TouchableOpacityProps
  label: string
  variant?: "contained" | "outlined"
  leftText?: string
  rightText?: string
  selected?: DropDownItem
  placeholder?: string
  chevron: React.ReactNode
  error?: string
}

export const DropDownMenu: FC<DropDownMenuProps> = ({
  items,
  onSelect,
  menuProps,
  itemProps,
  label,
  variant = "contained",
  leftText = '',
  rightText = '',
  selected = defaultItem,
  placeholder = '',
  chevron,
  error,
}) => {
  const [visible, setVisible] = useState(false)
  const [itemsState, setItemsState] = useState<DropDownItem[]>(items)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const theme = useTheme()

  const handleSelect = (item: DropDownItem) => {
    setVisible(false)
    onSelect(item)
  }

  const handlePress = () => {
    setVisible(!visible)
  }

  const onFilterSearch = (text: string) => {
    const filteredItems = items.filter((item) => item.label.toLowerCase().includes(text.toLowerCase()))
    setItemsState(filteredItems)
  }

  useEffect(() => {
    setItemsState(items)
  }, [items])

  return (
    <Wrapper>
      <LabelText>{label}</LabelText>
      <DropDownButton onPress={
        handlePress
      }
        {...menuProps}
        onPressOut={() => {
          setVisible(false)
        }}
        style={{
          backgroundColor: variant === "contained" ? theme.colors.primary : "transparent",
          borderWidth: variant === "outlined" ? 2 : 0,
          borderColor: theme.colors.primary,
        }}
      >
        <ContentContainer>
          {selected.label !== '' && selected.value !== '' ? (
            <Label
              style={{ color: variant === "contained" ? "white" : "black", fontSize: theme.sizes.xs }}
            >{leftText + selected.label + rightText}</Label>
          ) : (
            <Label
              style={{ color: variant === "contained" ? "white" : "gray", fontSize: theme.sizes.xs }}
            >{label}</Label>
          )}
          <Chevron visible={visible}>
            {chevron}
          </Chevron>
        </ContentContainer>
        <Modal
          isVisible={visible}
          onBackdropPress={() => setVisible(false)}
          useNativeDriver
          useNativeDriverForBackdrop
          hideModalContentWhileAnimating
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
        >
          <ModalContainer
            isSearching={isSearchFocused}
          >
            <ModalWrapper>
              <Text
                style={{
                  textAlign: 'center',
                }}
              >
                {label}
              </Text>
              {itemsState.length !== 0 ? (
                <ScrollView
                  style={{
                    flex: 1,
                  }}
                >
                  {itemsState.map((item, index) => (
                    <Item key={index} onPress={() => handleSelect(item)} isSelected={selected.value === item.value} {...itemProps}>
                      <ItemText isSelected={selected.value === item.value}>{leftText + item.label + rightText}</ItemText>
                    </Item>
                  ))}
                </ScrollView>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.background2,
                      textAlign: 'center',
                    }}
                  >
                    {placeholder}
                  </Text>
                </View>
              )}
              <Button
                text='Limpiar'
                onPress={() => {
                  setVisible(false)
                  onSelect(defaultItem)
                }}
              />
            </ModalWrapper>
          </ModalContainer>
        </Modal>
      </DropDownButton>
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  )
}