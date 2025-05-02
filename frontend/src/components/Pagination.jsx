import React from 'react';
import './Pagination.css'; // Tạo file CSS cho component này

function Pagination({ currentPage, totalPages, onPageChange }) {
  // Hàm xử lý khi nhấn nút trang
  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber); // Gọi hàm callback từ props để thay đổi trang
    }
  };

  // Tạo danh sách các nút trang để hiển thị (có thể làm phức tạp hơn sau)
  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Logic đơn giản: chỉ hiển thị vài trang quanh trang hiện tại
    // Có thể cải thiện để hiển thị "..." nếu có quá nhiều trang
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(totalPages, 5);
    }
    if (currentPage > totalPages - 3) {
        startPage = Math.max(1, totalPages - 4);
    }


    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`page-item ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Thêm dấu "..." nếu cần (logic cơ bản)
    if (startPage > 1) {
        pageNumbers.unshift(<span key="start-ellipsis" className="ellipsis">...</span>);
        pageNumbers.unshift(
            <button key={1} onClick={() => handlePageClick(1)} className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
                1
            </button>
        );
    }
    if (endPage < totalPages) {
        pageNumbers.push(<span key="end-ellipsis" className="ellipsis">...</span>);
        pageNumbers.push(
            <button key={totalPages} onClick={() => handlePageClick(totalPages)} className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
                {totalPages}
            </button>
        );
    }


    return pageNumbers;
  };

  // Không hiển thị gì nếu chỉ có 1 trang hoặc không có trang nào
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-area">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1} // Vô hiệu hóa nếu đang ở trang đầu
        className="page-item prev-next"
      >
        Trước
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages} // Vô hiệu hóa nếu đang ở trang cuối
        className="page-item prev-next"
      >
        Sau
      </button>
    </div>
  );
}

export default Pagination;