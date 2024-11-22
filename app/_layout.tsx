import { useAuth } from '@/hooks/useAuth'
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import { useCallback, useEffect } from 'react'
import type { FC } from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

SplashScreen.preventAutoHideAsync()

const RootLayout: FC = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/home')
    }
  }, [isAuthenticated, segments, isLoading])

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  }, [])

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <Container onLayout={onLayoutRootView}>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: false
            }}
          >
            <Stack.Screen
              name="(auth)/login"
              options={{
                gestureEnabled: false,
                headerShown: false,
                animation: 'fade'
              }}
            />

            <Stack.Screen
              name="(app)/home"
              options={{
                headerShown: false,
                animation: 'fade'
              }}
            />
          </Stack>
        </SafeAreaView>
      </Container>
    </SafeAreaProvider>
  )
}

export default RootLayout

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`
