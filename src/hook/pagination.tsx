import React from 'react';
import ReactPaginate from 'react-js-pagination';

interface PaginationProps {
  activePage: number;
  itemsCountPerPage: number;
  totalItemsCount?: number; // totalItemsCount를 선택적으로 변경
  onChange: (pageNumber: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
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
      prevPageText="previous"
      nextPageText="next"
      firstPageText="first"
      lastPageText="last"
    />
  );
};

export default PaginationComponent;