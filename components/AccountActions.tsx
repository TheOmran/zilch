import { COLORS } from '@/utilities/theme'
import { MaterialIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import type { FC } from 'react'
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation
} from 'react-native-reanimated'
import styled from 'styled-components/native'

type ActionButton = {
  id: string
  icon: keyof typeof MaterialIcons.glyphMap
  label: string
}

type AccountActionsProps = {
  scrollY: Animated.SharedValue<number>
  disabled: boolean | Error
}

const AccountActions: FC<AccountActionsProps> = ({ scrollY, disabled }) => {
  const actionButtons: ActionButton[] = [
    { id: 'top-up', icon: 'add', label: 'Top up' },
    { id: 'exchange', icon: 'swap-horiz', label: 'Exchange' },
    { id: 'transfer', icon: 'arrow-upward', label: 'Transfer' },
    { id: 'details', icon: 'credit-card', label: 'Details' }
  ]

  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 25],
      [1, 0],
      Extrapolation.CLAMP
    )

    const translateY = interpolate(
      scrollY.value,
      [0, 50],
      [0, 20],
      Extrapolation.CLAMP
    )

    return {
      opacity,
      transform: [{ translateY }]
    }
  })

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
    <AnimatedContainer style={containerStyle}>
      {actionButtons.map((item) => (
        <ActionButton disabled={!!disabled} key={item.id} onPress={handlePress}>
          <ActionButtonCircle>
            <MaterialIcons
              color={COLORS.secondary}
              name={item.icon}
              size={24}
            />
          </ActionButtonCircle>
          <ActionButtonText>{item.label}</ActionButtonText>
        </ActionButton>
      ))}
    </AnimatedContainer>
  )
}

export default AccountActions

const AnimatedContainer = styled(Animated.View)`
  flex-direction: row;
  gap: 12px;
  justify-content: space-around;
  width: 100%;
`

const ActionButton = styled.TouchableOpacity<{ disabled: boolean }>`
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

const ActionButtonCircle = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${COLORS.primary};
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`

const ActionButtonText = styled.Text`
  color: ${COLORS.black};
  font-size: 12px;
`
