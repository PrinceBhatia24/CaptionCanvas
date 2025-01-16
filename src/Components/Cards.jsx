import React from 'react'

export default function Cards({ Data, handleImageClick }) {

    return (
        <div className="card">
            <div className="card-img-container">
                <img
                    src={Data.src?.medium}
                    alt={Data.alt}
                    className="card-img-top img-fluid"
                />
            </div>
            <div className="card-body text-center py-2">
                <button className="btn btn-secondary"
                    onClick={() => handleImageClick(Data.src.medium)}
                >Add Caption</button>
            </div>
        </div>
    )
}
