import React, { useEffect } from 'react'
import AppNavigator from './navigations/AppNavigator'
import xmppService from './utils/xmpp'
import { useDispatch } from 'react-redux'
import { registerUser } from '@store/'


const AppConfiguration: React.FC = () => {

  

  return <AppNavigator />
}

export default AppConfiguration
