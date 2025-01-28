import React from 'react';
import Button from "@/components/Button";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Pagination({ pageNumber = 1, loading, onPrevious, onNext, onPageNumber }) {
  return (
    <div id='paginationBtnWrapper' className="flex gap-1.5 justify-center w-full mt-3">
      <Button
        id='paginationBtn'
        disabled={pageNumber === 1}
        disableClassName="rounded bg-grey-13"
        loading={loading}
        onClick={onPrevious}
        className="rounded h-6 w-6 flex justify-center items-center border border-grey-13">
        <ChevronLeftIcon style={{ color: pageNumber === 1 ? "#F8F9FA66" : "white" }} />
      </Button>

      <Button
        id='paginationBtn'
        loading={loading}
        className="rounded h-6 w-6 flex justify-center items-center bg-custom-ghostWhite text-custom-blackPearl font-extrabold text-lg"
        onClick={onPageNumber}
      >
        {pageNumber}
      </Button>

      <Button
        id='paginationBtn'
        loading={loading}
        onClick={onNext}
        className="rounded h-6 w-6 flex justify-center items-center border border-grey-13">
        <ChevronRightIcon style={{ color: "white" }} />
      </Button>
    </div>
  );
}

export default Pagination;
