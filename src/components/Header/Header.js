import React from 'react'
import { Tabs } from 'antd'
import './Header.css'

const items = [
  {
    key: '1',
    label: 'Search',
  },
  {
    key: '2',
    label: 'Rated',
  },
]
function Header() {
  return <Tabs defaultActiveKey="1" items={items} />
}
export default Header