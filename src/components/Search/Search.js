import React, { Component } from 'react'
import { Input } from 'antd'

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  render() {
    const { hasError } = this.state
    const { handleSubmit, handlerSearchQuery } = this.props
    if (hasError) {
      return <h1>Something went wrong.</h1>
    }
    return (
      <div className="input__wrapper">
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Type to search..."
            onChange={handlerSearchQuery}
          />
        </form>
      </div>
    )
  }
}