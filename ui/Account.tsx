import { Session } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Button, Input } from 'react-native-elements'

import { supabase } from '../lib/supabase'

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    username: '',
    website: '',
    avatarUrl: ''
  })

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    setUserData({ ...userData, [name]: value })
  }

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data)
        setUserData({
          ...userData,
          username: data.username,
          website: data.website,
          avatarUrl: data.avatar_url
        })
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date()
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input disabled label="Email" value={session?.user?.email} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={userData.username || ''}
          onChangeText={(value) => handleChange({ name: 'username', value })}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Website"
          value={userData.website || ''}
          onChangeText={(value) => handleChange({ name: 'website', value })}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button
          buttonStyle={{
            backgroundColor: 'black',
            paddingVertical: 12,
            marginVertical: 2
          }}
          disabled={loading}
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() =>
            updateProfile({
              username: userData.username,
              website: userData.website,
              avatar_url: userData.avatarUrl
            })
          }
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
          title="Sign Out"
          onPress={() => supabase.auth.signOut()}
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
