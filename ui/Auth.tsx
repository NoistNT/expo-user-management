import { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Button, Input } from 'react-native-elements'

import { supabase } from '../lib/supabase'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  })

  const signInWithEmail = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const signUpWithEmail = async () => {
    setLoading(true)

    const {
      data: { session },
      error
    } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification')
    setLoading(false)
  }

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    setUserData({ ...userData, [name]: value })
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          placeholder="email@address.com"
          value={userData.email}
          onChangeText={(value) => handleChange({ name: 'email', value })}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          placeholder="Password"
          value={userData.password}
          onChangeText={(value) => handleChange({ name: 'password', value })}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          buttonStyle={{
            backgroundColor: 'black',
            paddingVertical: 12,
            marginVertical: 2
          }}
          disabled={loading}
          title="Sign In"
          onPress={() => signInWithEmail()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          buttonStyle={{
            backgroundColor: 'slateblue',
            paddingVertical: 12,
            marginVertical: 2
          }}
          disabled={loading}
          title="Sign Up"
          onPress={() => signUpWithEmail()}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch'
  },
  mt20: {
    marginTop: 20
  }
})
