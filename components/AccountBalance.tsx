import { CreditCard } from '@/components/CreditCard'
import type { CardInfoType } from '@/types/card'
import { COLORS } from '@/utilities/theme'
import { MaterialIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { AnimatePresence, MotiView } from 'moti'
import { Skeleton } from 'moti/skeleton'
import type { FC } from 'react'
import { Dimensions, Pressable } from 'react-native'
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation
} from 'react-native-reanimated'
import styled from 'styled-components/native'
import AccountActions from './AccountActions'

const { width: SCREEN_WIDTH } = Dimensions.get('screen')

type AccountProps = {
  scrollY: Animated.SharedValue<number>
  card: {
    isCardLoading: boolean
    cardData: CardInfoType
    cardError: Error | null
    refetchCard: () => void
  }
}

export const Account: FC<AccountProps> = ({ scrollY, card }) => {
  const balanceCardStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      [0, 60, 200],
      [0, SCREEN_WIDTH / 10, SCREEN_WIDTH * 0.3 + 10],
      Extrapolation.CLAMP
    )

    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [0, -90],
      Extrapolation.CLAMP
    )

    const height = interpolate(
      scrollY.value,
      [0, 200],
      [200, 70],
      Extrapolation.CLAMP
    )

    const width = interpolate(
      scrollY.value,
      [0, 200],
      [SCREEN_WIDTH - 40, SCREEN_WIDTH * 0.6 - 10],
      Extrapolation.CLAMP
    )

    return !card.cardError
      ? {
          transform: [{ translateX }, { translateY }],
          height,
          width
        }
      : {
          height: 215,
          width: SCREEN_WIDTH - 40
        }
  })

  const menuIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [50, 200],
      [0, 1],
      Extrapolation.CLAMP
    )

    return !card.cardError && !card.isCardLoading ? { opacity } : { opacity: 0 }
  })

  const balanceAmountStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, 200],
      [36, 22],
      Extrapolation.CLAMP
    )

    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [0, 32],
      Extrapolation.CLAMP
    )

    return { fontSize, transform: [{ translateY }] }
  })

  const balanceLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0],
      Extrapolation.CLAMP
    )

    return { opacity }
  })

  const containerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 200],
      [425, 75],
      Extrapolation.CLAMP
    )
    return !card.cardError ? { height } : { height: 240 }
  })

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    card.refetchCard()
  }

  const handleMenuPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
  }

  return (
    <Container style={containerStyle}>
      <AnimatePresence>
        {!card.cardError && (
          <MotiView
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            exitTransition={{ type: 'timing', duration: 300 }}
            from={{ opacity: 0 }}
            key="card"
            transition={{ type: 'timing', duration: 300 }}
          >
            <CreditCard card={card} scrollY={scrollY} />
          </MotiView>
        )}
      </AnimatePresence>
      <AnimatedBalanceCard style={balanceCardStyle}>
        <AnimatePresence exitBeforeEnter>
          {card.isCardLoading && !card.cardError && (
            <MotiView
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              exitTransition={{ type: 'timing', duration: 300 }}
              from={{ opacity: 0 }}
              key="loading"
              transition={{ type: 'timing', duration: 300 }}
            >
              <BalanceSection>
                <BalanceLabel style={balanceLabelStyle}>
                  Current balance
                </BalanceLabel>
                <BalanceAmount style={balanceAmountStyle}>
                  <Skeleton
                    colors={[COLORS.lightGrey, COLORS.primary]}
                    height={34}
                    width={170}
                  />
                </BalanceAmount>
              </BalanceSection>
            </MotiView>
          )}

          {card.cardError && !card.cardData && (
            <MotiView
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              exitTransition={{ type: 'timing', duration: 300 }}
              from={{ opacity: 0 }}
              key="error"
              style={{ flex: 1, justifyContent: 'center' }}
              transition={{ type: 'timing', duration: 300 }}
            >
              <ErrorContainer>
                <ErrorText>Oh no!</ErrorText>
                <ErrorSubText>
                  {"We couldn't fetch your account data.\nPlease try again."}
                </ErrorSubText>
                <RetryButton onPress={handleRetry}>
                  <RetryButtonText>Retry</RetryButtonText>
                </RetryButton>
              </ErrorContainer>
            </MotiView>
          )}

          {!card.isCardLoading && !card.cardError && card.cardData && (
            <MotiView
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              exitTransition={{ type: 'timing', duration: 300 }}
              from={{ opacity: 0 }}
              key="content"
              transition={{ type: 'timing', duration: 300 }}
            >
              <BalanceSection>
                <BalanceLabel style={balanceLabelStyle}>
                  Current balance
                </BalanceLabel>
                <BalanceAmount style={balanceAmountStyle}>
                  £{(card.cardData.card_balance * 1000).toFixed(2)}
                </BalanceAmount>
              </BalanceSection>
            </MotiView>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!card.cardError && (
            <MotiView
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 20 }}
              exitTransition={{ type: 'timing', duration: 300 }}
              from={{ opacity: 0, translateY: 20 }}
              key="actions"
              transition={{ type: 'timing', duration: 300 }}
            >
              <AccountActions
                disabled={card.isCardLoading || !card.cardData}
                scrollY={scrollY}
              />
            </MotiView>
          )}
        </AnimatePresence>

        <MenuIcon style={menuIconStyle}>
          <Pressable onPress={handleMenuPress}>
            <MaterialIcons color={COLORS.black} name="more-vert" size={24} />
          </Pressable>
        </MenuIcon>
      </AnimatedBalanceCard>
    </Container>
  )
}

const Container = styled(Animated.View)`
  background-color: ${COLORS.white};
  padding-horizontal: 10px;
`

const AnimatedBalanceCard = styled(Animated.View)`
  padding: 20px;
  background-color: ${COLORS.lightGrey};
  border-radius: 12px;
  margin: 20px 0;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
`

const BalanceSection = styled.View`
  align-items: flex-start;
  gap: 5px;
`

const BalanceAmount = styled(Animated.Text)`
  font-size: 36px;
  font-weight: bold;
`

const BalanceLabel = styled(Animated.Text)`
  color: ${COLORS.black};
  margin-top: 5px;
`

const MenuIcon = styled(Animated.View)`
  position: absolute;
  right: 20px;
  top: 20px;
`

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const ErrorText = styled.Text`
  font-size: 16px;
  color: ${COLORS.secondary};
  margin-bottom: 16px;
  font-weight: 600;
`

const ErrorSubText = styled.Text`
  font-size: 16px;
  color: ${COLORS.secondary};
  margin-bottom: 16px;
  text-align: center;
`

const RetryButton = styled.TouchableOpacity`
  padding: 12px 24px;
  background-color: ${COLORS.primary};
  border-radius: 8px;
`

const RetryButtonText = styled.Text`
  color: ${COLORS.white};
  font-size: 16px;
  font-weight: 600;
`
