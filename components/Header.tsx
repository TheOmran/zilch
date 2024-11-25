import Logo from '@/assets/images/logo.svg'
import { useAuth } from '@/hooks/useAuth'
import { COLORS } from '@/utilities/theme'
import { MaterialIcons } from '@expo/vector-icons'
import type { FC } from 'react'
import styled from 'styled-components/native'

export const Header: FC = () => {
  const { signOut } = useAuth()

  return (
    <HeaderContainer>
      <Logo height={40} width={100} />
      <SignOutButton onPress={signOut}>
        <MaterialIcons color={COLORS.darkGrey} name="logout" size={24} />
      </SignOutButton>
    </HeaderContainer>
  )
}

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
`

const SignOutButton = styled.Pressable`
  padding: 8px;
`
