import { Account } from '@/components/AccountBalance'
import { Header } from '@/components/Header'
import { TransactionItem } from '@/components/TransactionItem'
import { COLORS } from '@/utilities/theme'
import { useQuery } from '@tanstack/react-query'
import * as Haptics from 'expo-haptics'
import { ActivityIndicator, RefreshControl, View } from 'react-native'
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue
} from 'react-native-reanimated'
import styled from 'styled-components/native'

const AnimatedFlatList = Animated.FlatList

const HomeScreen: React.FC = () => {
  const scrollY = useSharedValue(0)

  const onScroll = useAnimatedScrollHandler((ev) => {
    scrollY.value = ev.contentOffset.y
  })

  const {
    isFetching: isCardLoading,
    data: cardData,
    error: cardError,
    refetch: refetchCard
  } = useQuery({
    queryKey: ['card'],
    queryFn: () =>
      fetch(
        'https://random-data-api.com/api/v3/projects/613cf175-bf47-4a07-b9dc-f000829bc7b8?api_key=trIfwvdsTSSwzM7F90vJTg'
      ).then((res) => res.json())
  })

  const {
    isFetching: isTransactionsPending,
    data: transactionsData,
    error: transactionsError,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () =>
      fetch(
        'https://random-data-api.com/api/v3/projects/b6d7c807-3406-4ce8-94cf-46da83514f7c?api_key=aWg8Wc2OV-85c1riKcDIzw'
      ).then((res) => res.json())
  })

  const refetch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    refetchTransactions()
    refetchCard()
  }

  // // NOTE: These are for testing only!
  // const { isCardLoading, cardData, cardError } = {
  //   isCardLoading: true,
  //   cardData: null,
  //   cardError: null
  // }

  // // NOTE: These are for testing only!
  // const { isTransactionsPending, transactionsData, transactionsError } = {
  //   isTransactionsPending: true,
  //   transactionsData: null,
  //   transactionsError: null
  // }

  const sortedTransactions = [
    ...(transactionsData?.transactions || []),
    ...(transactionsData?.credits || [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Container>
      <Header />
      <AnimatedFlatList
        ListEmptyComponent={() => {
          if (transactionsError) {
            return (
              <ErrorContainer>
                <ErrorText>Oh no!</ErrorText>
                <ErrorSubText>
                  {'Failed to load transactions.\nPlease try again.'}
                </ErrorSubText>
                <RetryButton onPress={() => refetchTransactions()}>
                  <RetryButtonText>Retry</RetryButtonText>
                </RetryButton>
              </ErrorContainer>
            )
          }
          if (isTransactionsPending) {
            return (
              <LoadingContainer>
                <ActivityIndicator color="#00b374" size="large" />
              </LoadingContainer>
            )
          }
          return null
        }}
        ListHeaderComponent={
          <View>
            <Account
              card={{
                isCardLoading,
                cardData,
                cardError,
                refetchCard
              }}
              scrollY={scrollY}
            />
            <TransactionsHeader>
              <TransactionsLabel>Transactions</TransactionsLabel>
              <ViewAllButton>View all</ViewAllButton>
            </TransactionsHeader>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={sortedTransactions}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        refreshControl={
          <RefreshControl
            onRefresh={refetch}
            refreshing={isTransactionsPending || isCardLoading}
            tintColor={'#00b374'}
          />
        }
        renderItem={({ item }) => <TransactionItem item={item} />}
        scrollEventThrottle={16}
        stickyHeaderIndices={[0]}
      />
    </Container>
  )
}

export default HomeScreen

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.white};
`

const TransactionsHeader = styled.View`
  height: 75px;
  background-color: ${COLORS.white};
  padding-horizontal: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const TransactionsLabel = styled.Text`
  font-size: 20px;
  font-weight: 400;
`

const ViewAllButton = styled.Text`
  font-size: 16px;
  font-weight: 600;
`

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: ${COLORS.white};
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
  background-color: #00b374;
  border-radius: 8px;
`

const RetryButtonText = styled.Text`
  color: ${COLORS.white};
  font-size: 16px;
  font-weight: 600;
`

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`
