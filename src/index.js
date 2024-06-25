import React from 'react'
import { createRoot } from 'react-dom/client'
import { Alert } from 'antd'

import App from './components/App'
import './index.css'

class RootComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOnline: true
    }
  }

  componentDidMount() {
    window.addEventListener('online', this.updateOnlineStatus)
    window.addEventListener('offline', this.updateOnlineStatus)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateOnlineStatus)
    window.removeEventListener('offline', this.updateOnlineStatus)
  }

  updateOnlineStatus = () => {
    this.setState({ isOnline: navigator.onLine })
  }

  render() {
    const { isOnline } = this.state
    return (
      <React.StrictMode>
        {isOnline ? (
          <App />
        ) : (
          <Alert message="Проверьте подключение к интернету" type="error" />
        )}
      </React.StrictMode>
    )
  }
}

createRoot(document.getElementById('root')).render(<RootComponent />)
