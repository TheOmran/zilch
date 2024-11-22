import { useAuth } from '@/hooks/useAuth'
import type { LoginInput } from '@/types/user'
import { Ionicons } from '@expo/vector-icons'
import { type FC, useRef, useState } from 'react'
import { type ButtonProps, TextInput } from 'react-native'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native'
import styled from 'styled-components/native'

const LoginScreen: FC = () => {
  const { signIn, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const passwordRef = useRef<TextInput>(null)

  const [loginInput, setLoginInput] = useState<LoginInput>({
    email: '',
    password: ''
  })

  const handleLogin = async (): Promise<void> => {
    try {
      if (!isValidEmail(loginInput.email)) {
        setError('Please enter a valid email address')
        return
      }

      if (loginInput.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }

      setError(null)
      await signIn({
        email: loginInput.email.trim(),
        password: loginInput.password
      })
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  const handleInputChange =
    (field: keyof LoginInput) =>
    (text: string): void => {
      setError(null)
      setLoginInput((prev) => ({ ...prev, [field]: text }))
    }

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={false}
      >
        <Container>
          {error && <ErrorText>{error}</ErrorText>}

          <InputField
            autoCapitalize="none"
            autoComplete="email"
            blurOnSubmit={false}
            editable={!isLoading}
            hasError={Boolean(error) && !isValidEmail(loginInput.email)}
            keyboardType="email-address"
            onChangeText={handleInputChange('email')}
            onSubmitEditing={() => passwordRef.current?.focus()}
            placeholder="Email"
            placeholderTextColor="#666666"
            returnKeyType="next"
            value={loginInput.email}
          />

          <PasswordContainer>
            <PasswordInput
              autoCapitalize="none"
              autoComplete="password"
              editable={!isLoading}
              hasError={Boolean(error) && loginInput.password.length < 6}
              onChangeText={handleInputChange('password')}
              onSubmitEditing={handleLogin}
              placeholder="Password"
              placeholderTextColor="#666666"
              ref={passwordRef}
              returnKeyType="done"
              secureTextEntry={!showPassword}
              value={loginInput.password}
            />
            {loginInput.password.length > 0 && (
              <PasswordToggle onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  color="#666666"
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                />
              </PasswordToggle>
            )}
          </PasswordContainer>

          <LoginButton
            disabled={
              isLoading ||
              loginInput.email.length === 0 ||
              loginInput.password.length === 0
            }
            onPress={handleLogin}
          >
            {isLoading ? <LoadingSpinner /> : <ButtonText>Login</ButtonText>}
          </LoginButton>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const Container = styled.View`
 flex: 1;
 justify-content: center;
 align-items: center;
 padding: 20px;
 background-color: #ffffff;
`

const ErrorText = styled.Text`
 color: #ff0000;
 font-size: 14px;
 margin-bottom: 5px;
 align-self: flex-start;
`

const InputField = styled(TextInput)<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ hasError }) => (hasError ? '#ff0000' : '#ccc')};
  margin-bottom: 15px;
  font-size: 16px;
  opacity: ${({ editable }) => (editable === false ? 0.5 : 1)};
`

const PasswordInput = styled(TextInput)<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ hasError }) => (hasError ? '#ff0000' : '#ccc')};
  padding-right: 45px;
  font-size: 16px;
  opacity: ${({ editable }) => (editable === false ? 0.5 : 1)};
`

const PasswordContainer = styled.View`
 width: 100%;
 margin-bottom: 15px;
`

const PasswordToggle = styled.Pressable`
 position: absolute;
 right: 10px;
 top: 40%;
 transform: translateY(-10px);
 padding: 5px;
`

const LoginButton = styled.Pressable<Pick<ButtonProps, 'disabled'>>`
 background-color: #00D287;
 padding: 10px 20px;
 border-radius: 8px;
 opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
 min-width: 120px;
 align-items: center;
`

const ButtonText = styled.Text`
 color: #085439;
 font-size: 16px;
 font-weight: 600;
`

const LoadingSpinner = styled(ActivityIndicator).attrs({
  color: '#085439',
  size: 'small'
})`
 padding: 2px 0;
`
