import VisaLogo from '@/assets/images/visa.svg'
import type { CardInfoType } from '@/types/card'
import { COLORS } from '@/utilities/theme'
import { MotiView } from 'moti'
import { AnimatePresence } from 'moti/build/core'
import { Skeleton } from 'moti/skeleton'
import type { FC } from 'react'
import { Dimensions } from 'react-native'
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation
} from 'react-native-reanimated'
import styled from 'styled-components/native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type CreditCardProps = {
  scrollY: Animated.SharedValue<number>
  card: {
    isCardLoading: boolean
    cardData: CardInfoType
    cardError: Error | null
    refetchCard: () => void
  }
}

export const CreditCard: FC<CreditCardProps> = ({ scrollY, card }) => {
  const cardStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 200],
      [200, 70],
      Extrapolation.CLAMP
    )

    const width = interpolate(
      scrollY.value,
      [0, 200],
      [SCREEN_WIDTH - 40, SCREEN_WIDTH * 0.3],
      Extrapolation.CLAMP
    )

    const translateX = interpolate(
      scrollY.value,
      [0, 200],
      [0, -SCREEN_WIDTH / 20 + 15],
      Extrapolation.CLAMP
    )

    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [0, 0],
      Extrapolation.CLAMP
    )

    return {
      transform: [{ translateX }, { translateY }],
      height,
      width
    }
  })

  const logoStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      [20, 200],
      [0, -12],
      Extrapolation.CLAMP
    )

    return { transform: [{ translateX }] }
  })

  const dataStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0],
      Extrapolation.CLAMP
    )
    return { opacity }
  })

  return (
    <CardContainer style={cardStyle}>
      <AnimatePresence exitBeforeEnter>
        {card.isCardLoading && (
          <MotiView
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            exitTransition={{ type: 'timing', duration: 500 }}
            from={{ opacity: 0 }}
            key="skeleton"
            style={{ flex: 1 }}
            transition={{ type: 'timing', duration: 500 }}
          >
            <CardContent>
              <CardLogo style={logoStyle}>
                <Skeleton
                  colors={[COLORS.lightGrey, COLORS.secondary]}
                  height={30}
                  width={60}
                />
              </CardLogo>
              <CardNumber style={dataStyle}>
                <Skeleton
                  colors={[COLORS.lightGrey, COLORS.secondary]}
                  height={24}
                  width={240}
                />
              </CardNumber>
              <CardInfo style={dataStyle}>
                <InfoContainer>
                  <CardLabel>Card Holder</CardLabel>
                  <Skeleton
                    colors={[COLORS.lightGrey, COLORS.secondary]}
                    height={16}
                    width={150}
                  />
                </InfoContainer>
                <InfoContainer>
                  <CardLabel>Valid Thru</CardLabel>
                  <Skeleton
                    colors={[COLORS.lightGrey, COLORS.secondary]}
                    height={16}
                    width={60}
                  />
                </InfoContainer>
              </CardInfo>
            </CardContent>
          </MotiView>
        )}

        {!card.isCardLoading && card.cardData && (
          <MotiView
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            exitTransition={{ type: 'timing', duration: 500 }}
            from={{ opacity: 0 }}
            key="content"
            style={{ flex: 1 }}
            transition={{ type: 'timing', duration: 500 }}
          >
            <CardContent>
              <CardLogo style={logoStyle}>
                <VisaLogo height={30} width={60} />
              </CardLogo>
              <CardNumber style={dataStyle}>
                {card.cardData.card_number}
              </CardNumber>
              <CardInfo style={dataStyle}>
                <InfoContainer>
                  <CardLabel>Card Holder</CardLabel>
                  <CardHolder>{card.cardData.full_name}</CardHolder>
                </InfoContainer>
                <InfoContainer>
                  <CardLabel>Valid Thru</CardLabel>
                  <ValidThru>{card.cardData.card_expiry_date}</ValidThru>
                </InfoContainer>
              </CardInfo>
            </CardContent>
          </MotiView>
        )}
      </AnimatePresence>
    </CardContainer>
  )
}

const CardContainer = styled(Animated.View)`
  height: 200px;
  background-color: ${COLORS.primary};
  border-radius: 12px;
  padding: 20px;
  justify-content: space-between;
  overflow: hidden;
`

const CardContent = styled.View`
  flex: 1;
  justify-content: space-between;
  overflow: hidden;
`

const CardNumber = styled(Animated.Text)`
  color: ${COLORS.secondary};
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: 1;
`

const CardInfo = styled(Animated.View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  overflow: hidden;
`

const InfoContainer = styled.View`
  overflow: hidden;
  flex-shrink: 1;
`

const CardHolder = styled.Text`
  color: ${COLORS.secondary};
  font-size: 16px;
  text-transform: uppercase;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const CardLabel = styled.Text`
  color: ${COLORS.secondary};
  font-size: 12px;
  margin-bottom: 4px;
  font-weight: 800;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const ValidThru = styled.Text`
  color: ${COLORS.secondary};
  font-size: 16px;
  align-self: flex-end;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const CardLogo = styled(Animated.View)`
  align-self: flex-end;
`
