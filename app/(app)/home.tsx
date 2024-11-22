import type { FC } from 'react'
import styled from 'styled-components/native'
import { MaterialIcons } from '@expo/vector-icons'
import Logo from '@/assets/images/logo.svg'
import { useAuth } from '@/hooks/useAuth'

const HomeScreen: FC = () => {
  const { signOut } = useAuth()

  return (
    <Container>
      <Header>
        <Logo width={100} height={40} />
        <SignOutButton onPress={signOut}>
          <MaterialIcons name="logout" size={24} color="#333" />
        </SignOutButton>
      </Header>
      <Content>
        <PlaceholderText>Content goes here</PlaceholderText>
      </Content>
    </Container>
  )
}

export default HomeScreen

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-vertical: 10px;
`

const SignOutButton = styled.Pressable`
  padding-vertical: 8px;
`

const Content = styled.ScrollView`
  flex: 1;
  padding: 10px;
  background-color: #f5f5f5;
  margin: 10px;
  border-radius: 12px;
`

const PlaceholderText = styled.Text`
  font-size: 18px;
  color: #999;
`
