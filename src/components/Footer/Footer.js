import React, { useState } from 'react'
import { Pagination } from 'antd'
import './Footer.css'

function Footer({ onPageChange, totalPages }) {
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  //   console.log(`Максимальное количество страниц: ${totalPages}`)

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber)
    onPageChange(pageNumber)
    // console.log(`Текущая страница ${pageNumber}`)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="footer__wrapper">
      <Pagination
        current={page}
        defaultCurrent={1}
        total={totalPages > 0 ? totalPages*itemsPerPage  : 1}
        showSizeChanger={false}
        onChange={handlePageChange}
      />
    </div>
  )
}

export default Footer