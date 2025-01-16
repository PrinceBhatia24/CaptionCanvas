import React from 'react'
import { IoSearch } from "react-icons/io5";

export default function Search({ setSearch, search, setCurrentPage }) {
    return (
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Search Image"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button
                className="btn btn-primary"
                type="button"
                onClick={() => setCurrentPage(1)}
            >
                <IoSearch />

            </button>
        </div>
    )
}
