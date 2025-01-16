import React from 'react'
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";

export default function Pagination({ handlePreviousPage, handleNextPage, currentPage, TotalImages, imagesPerPage }) {
    
    return (
        <div className="d-flex justify-content-between align-items-center mt-1 py-2">
            <button
                className="btn btn-outline-primary"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
            >
                <GrLinkPrevious />

            </button>
            <span>Page {currentPage} of {Math.ceil(TotalImages / imagesPerPage)}</span>
            <button
                className="btn btn-outline-primary "
                onClick={handleNextPage}
                disabled={currentPage === Math.ceil(TotalImages / imagesPerPage)}
            >
                <GrLinkNext />

            </button>
        </div>
    )
}
