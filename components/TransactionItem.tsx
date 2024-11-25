import type { TransactionType } from '@/types/transactions'
import { COLORS } from '@/utilities/theme'
import { MaterialIcons } from '@expo/vector-icons'
import { type FC, useMemo } from 'react'
import styled from 'styled-components/native'

interface TransactionItemProps {
  item: TransactionType
}

export const TransactionItem: FC<TransactionItemProps> = ({ item }) => {
  const formattedDate = useMemo(
    () => (type: 'date' | 'time') =>
      type === 'date'
        ? new Date(item.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
          })
        : new Date(item.date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
    [item.date]
  )

  return (
    <Container>
      <Card>
        <LogoContainer>
          <MaterialIcons
            color={item.is_credit ? COLORS.secondary : COLORS.darkGrey}
            name={item.is_credit ? 'add-circle' : 'store'}
            size={24}
          />
        </LogoContainer>
        <ContentContainer>
          <VendorContainer>
            <TransactionTitle
              isCredit={item.is_credit ?? false}
              numberOfLines={1}
            >
              {item?.vendor || item?.creditor}
            </TransactionTitle>
            <TransactionDate>
              {formattedDate('date')} • {formattedDate('time')}
            </TransactionDate>
          </VendorContainer>
          <Amount isCredit={item.is_credit ?? false}>
            {item.is_credit ? '+' : '-'}£{Math.abs(item.amount).toFixed(2)}
          </Amount>
        </ContentContainer>
      </Card>
    </Container>
  )
}

const Container = styled.View`
  padding-horizontal: 4px;
  padding-vertical: 6px;
`

const Card = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-radius: 16px;
  shadow-color: ${COLORS.black};
  shadow-offset: 0px 5px;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  elevation: 2;
`

const LogoContainer = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${COLORS.lightGrey};
  margin-right: 14px;
  align-items: center;
  justify-content: center;
`

const ContentContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`

const VendorContainer = styled.View`
  flex: 1;
`

const TransactionTitle = styled.Text<{ isCredit: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.isCredit ? COLORS.tertiary : COLORS.black)};
  overflow: hidden;
  text-overflow: ellipsis;
`

const TransactionDate = styled.Text`
  font-size: 14px;
  color: ${COLORS.darkGrey};
  margin-top: 4px;
`

const Amount = styled.Text<{ isCredit: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.isCredit ? COLORS.tertiary : COLORS.black)};
`
