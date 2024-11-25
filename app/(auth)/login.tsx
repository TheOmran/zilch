import Logo from '@/assets/images/logo.svg'
import { useAuth } from '@/hooks/useAuth'
import type { LoginInput } from '@/types/user'
import { COLORS } from '@/utilities/theme'
import { Ionicons } from '@expo/vector-icons'
import { type FC, useRef, useState } from 'react'
import { type ButtonProps, Dimensions, TextInput } from 'react-native'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native'
import styled from 'styled-components/native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const INPUT_WIDTH = Math.min(400, SCREEN_WIDTH * 0.85)

const LoginScreen: FC = () => {
  const { signIn, isLoading } = useAuth()
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState<'email' | 'password' | null>(null)

  const passwordRef = useRef<TextInput>(null)

  const [loginInput, setLoginInput] = useState<LoginInput>({
    email: '',
    password: ''
  })

  const handleLogin = async (): Promise<void> => {
    try {
      let hasError = false

      if (!isValidEmail(loginInput.email)) {
        setEmailError('Please enter a valid email address')
        hasError = true
      } else {
        setEmailError(null)
      }

      if (loginInput.password.length < 6) {
        setPasswordError('Password must be at least 6 characters')
        hasError = true
      } else {
        setPasswordError(null)
      }

      if (hasError) return

      await signIn({
        email: loginInput.email.trim(),
        password: loginInput.password
      })
    } catch (err) {
      setEmailError('Invalid email or password')
      setPasswordError('Invalid email or password')
    }
  }

  const handleInputChange =
    (field: keyof LoginInput) =>
    (text: string): void => {
      if (field === 'email') setEmailError(null)
      if (field === 'password') setPasswordError(null)
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
        contentContainerStyle={{
          backgroundColor: COLORS.white,
          justifyContent: 'center',
          gap: 30,
          flex: 1
        }}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        <LogoContainer>
          <Logo height={50} width={150} />
        </LogoContainer>
        <Container>
          <FormContainer>
            <InputContainer>
              <InputLabel>Email</InputLabel>
              <InputField
                autoCapitalize="none"
                autoComplete="email"
                blurOnSubmit={false}
                editable={!isLoading}
                hasError={Boolean(emailError)}
                isFocused={isFocused === 'email'}
                keyboardType="email-address"
                onBlur={() => setIsFocused(null)}
                onChangeText={handleInputChange('email')}
                onFocus={() => setIsFocused('email')}
                onSubmitEditing={() => passwordRef.current?.focus()}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.midGrey}
                returnKeyType="next"
                value={loginInput.email}
              />
              {emailError && (
                <ErrorContainer>
                  <Ionicons
                    color={COLORS.error}
                    name="alert-circle"
                    size={18}
                  />
                  <ErrorText>{emailError}</ErrorText>
                </ErrorContainer>
              )}
            </InputContainer>

            <InputContainer>
              <InputLabel>Password</InputLabel>
              <PasswordContainer>
                <PasswordInput
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!isLoading}
                  hasError={Boolean(passwordError)}
                  isFocused={isFocused === 'password'}
                  onBlur={() => setIsFocused(null)}
                  onChangeText={handleInputChange('password')}
                  onFocus={() => setIsFocused('password')}
                  onSubmitEditing={handleLogin}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.midGrey}
                  ref={passwordRef}
                  returnKeyType="done"
                  secureTextEntry={!showPassword}
                  value={loginInput.password}
                />
                {loginInput.password.length > 0 && (
                  <PasswordToggle
                    accessibilityLabel={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    accessibilityRole="button"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      color={COLORS.darkGrey}
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                    />
                  </PasswordToggle>
                )}
              </PasswordContainer>
              {passwordError && (
                <ErrorContainer>
                  <Ionicons
                    color={COLORS.error}
                    name="alert-circle"
                    size={18}
                  />
                  <ErrorText>{passwordError}</ErrorText>
                </ErrorContainer>
              )}
            </InputContainer>

            <LoginButton
              accessibilityLabel="Login button"
              accessibilityRole="button"
              disabled={
                isLoading ||
                !isValidEmail(loginInput.email) ||
                loginInput.password.length < 6
              }
              onPress={handleLogin}
            >
              {isLoading ? (
                <LoadingSpinner color={COLORS.secondary} />
              ) : (
                <ButtonText>Sign In</ButtonText>
              )}
            </LoginButton>
          </FormContainer>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const Container = styled.View`
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: ${COLORS.white};
`

const LogoContainer = styled.View`
  align-items: center;
`

const FormContainer = styled.View`
  width: ${INPUT_WIDTH}px;
  gap: 20px;
`

const ErrorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 5px;
`

const ErrorText = styled.Text`
  color: ${COLORS.error};
  font-size: 14px;
  flex: 1;
`

const InputContainer = styled.View`
  gap: 8px;
`

const InputLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${COLORS.black};
  margin-left: 4px;
`

const InputField = styled(TextInput)<{
  hasError?: boolean
  isFocused?: boolean
}>`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ hasError, isFocused }) =>
    hasError ? COLORS.error : isFocused ? COLORS.primary : COLORS.midGrey};
  font-size: 16px;
  background-color: ${COLORS.white};
  color: ${COLORS.black};
  opacity: ${({ editable }) => (editable === false ? 0.5 : 1)};
`

const PasswordInput = styled(InputField)`
  padding-right: 45px;
`

const PasswordContainer = styled.View`
  width: 100%;
  position: relative;
`

const PasswordToggle = styled.Pressable`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-10px);
`

const LoginButton = styled.Pressable<Pick<ButtonProps, 'disabled'>>`
  background-color: ${COLORS.primary};
  padding: 16px;
  border-radius: 12px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  width: 100%;
  align-items: center;
  margin-top: 10px;
`

const ButtonText = styled.Text`
  color: ${COLORS.white};
  font-size: 16px;
  font-weight: 600;
`

const LoadingSpinner = styled(ActivityIndicator).attrs({
  size: 'small'
})`
  padding: 2px 0;
`
