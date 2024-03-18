import React from 'react';
import ReactPaginate from 'react-js-pagination';

type PaginationProps = {
  activePage: number;
  itemsCountPerPage: number;
  totalItemsCount?: number; // totalItemsCount를 선택적으로 변경
  onChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  activePage,
  itemsCountPerPage,
  totalItemsCount = 0, // 기본값을 0으로 설정하거나 다른 값을 선택
  onChange,
}) => {
  return (
    <ReactPaginate
      activePage={activePage}
      itemsCountPerPage={itemsCountPerPage}
      totalItemsCount={totalItemsCount}
      pageRangeDisplayed={5}
      onChange={(pageNumber) => onChange(pageNumber)}
      prevPageText="이전"
      nextPageText="다음"
      firstPageText="처음"
      lastPageText="끝"
    />
  );
};

export default Pagination;