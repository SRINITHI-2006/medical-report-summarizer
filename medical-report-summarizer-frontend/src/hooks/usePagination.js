import { useState } from 'react'

const usePagination = (initialPage = 0, initialSize = 10) => {
  const [page, setPage] = useState(initialPage)
  const [size] = useState(initialSize)
  const [totalPages, setTotalPages] = useState(0)

  const resetPage = () => setPage(0)

  return { page, size, totalPages, setPage, setTotalPages, resetPage }
}

export default usePagination
