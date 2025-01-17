// Packages
import React, { useState, useEffect, useRef } from 'react'
import { createClient } from "pexels";
import * as fabric from 'fabric';
import { FabricImage } from 'fabric';

//Bootstrap
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

//Icons
import { MdDelete } from "react-icons/md";
import { FaCloudDownloadAlt } from "react-icons/fa";

//Components
import Cards from '../Components/Cards';
import Pagination from '../Components/Pagination';
import Search from '../Components/Search';

export default function Homepage() {

    const [search, setSearch] = useState("AI");
    const canvasRef = useRef();
    const imagesPerPage = window.config.ImagePerPage;

    const [state, setState] = useState({
        TotalImages: "",
        images: [],
        currentPage: 1,
        selectedImage: null,
        selectedShape: '',
        canvas: null,
        show: false,
        captionText: "",
        loading: false,
    });

    //Modal Open/Close
    const handleClose = () => setState(prevState => ({
        ...prevState,
        show: false
    }));

    const handleShow = () => setState(prevState => ({
        ...prevState,
        show: true
    }));

    const handleImageClick = async (imageUrl) => {
        handleShow();
        setState((prevState) => ({
            ...prevState,
            selectedImage: imageUrl,

        }));

        console.log("handleImageClick triggered for URL:", imageUrl);

        try {
            if (!FabricImage) {
                console.error("FabricImage is not defined. Ensure you have imported it correctly.");
                return;
            }

            if (!imageUrl) {
                console.error("Image URL is not provided.");
                return;
            }

            if (!state.canvas) {
                console.error("Canvas instance is not available.");
                return;
            }

            console.log("Loading image from URL:", imageUrl);

            const imgElement = new Image();
            imgElement.crossOrigin = "anonymous";
            imgElement.src = imageUrl;

            imgElement.onload = () => {
                console.log("Image element loaded:", imgElement);

                try {
                    const fabricImage = new FabricImage(imgElement, {
                        left: 10,
                        top: 10,
                        scaleX: 0.5,
                        scaleY: 0.5,
                    });

                    console.log("FabricImage object created:", fabricImage);

                    state.canvas.add(fabricImage);
                    state.canvas.setActiveObject(fabricImage);
                    state.canvas.renderAll();

                    console.log("Image successfully added and canvas updated.");


                } catch (error) {
                    console.error("Error adding image to canvas:", error);
                }
            };

            imgElement.onerror = (error) => {
                console.error("Failed to load image:", error);
            };
        } catch (error) {
            console.error("An error occurred while handling the image click:", error);
        }
    };


    //Utilities
    const handleAddCaption = () => {
        if (!state.selectedImage) {
            alert("Please select an image first.");
            return;
        }
        if (!state.captionText.trim()) {
            alert("Please enter a caption.");
            return;
        }
        const text = new fabric.Textbox(state.captionText, {
            left: 10,
            top: 10,
            fontSize: 20,
            fill: 'black',
            width: 200
        });

        state.canvas.add(text);
        state.canvas.renderAll();
        // setState.captionText("");
        setState(prevState => ({
            ...prevState,
            captionText: ""
        }));
    };

    const handleShapeChange = (shapeType) => {

        if (state.canvas) {
            let shape;
            switch (shapeType) {
                case "Rectangle":
                    shape = new fabric.Rect({
                        left: 100,
                        top: 100,
                        width: 100,
                        height: 60,
                        fill: "",
                        stroke: "black",
                        strokeWidth: 2,
                    });
                    break;
                case "Circle":
                    shape = new fabric.Circle({
                        left: 100,
                        top: 100,
                        radius: 50,
                        fill: "",
                        stroke: "black",
                        strokeWidth: 2,
                    });
                    break;
                case "Triangle":
                    shape = new fabric.Triangle({
                        left: 100,
                        top: 100,
                        width: 100,
                        height: 80,
                        fill: "",
                        stroke: "black",
                        strokeWidth: 2,
                    });
                    break;
                case "Polygon":
                    shape = new fabric.Polygon(
                        [
                            { x: 200, y: 0 },
                            { x: 250, y: 50 },
                            { x: 200, y: 100 },
                            { x: 150, y: 50 },
                        ],
                        {
                            left: 100,
                            top: 100,
                            fill: "",
                            stroke: "black",
                            strokeWidth: 2,
                        }
                    );
                    break;
                default:
                    console.error("Unknown", shapeType);
            }
            if (shape) {
                state.canvas.add(shape);
                state.canvas.setActiveObject(shape);
            }
        }
    };


    //SearchHandle
    const SearchHandle = async () => {
        setState(prev => ({
            ...prev,
            loading: true,
        }))
        try {
            if (!search.trim()) {
                console.log("Search query is empty");
                return;
            }
            const client = createClient(window.config.API_KEY);
            const response = await client.photos.search({
                query: search,
                per_page: imagesPerPage,
                page: state.currentPage,
            });

            // console.log(response);
            setState(prevState => ({
                ...prevState,
                images: response.photos,
                TotalImages: response.total_results,
                loading: false
            }));




        } catch (error) {
            console.error("Error Fetching Image", error);
        }
    };

    //Pagination
    const handleNextPage = () => {
        if (state.currentPage < Math.ceil(state.TotalImages / imagesPerPage)) {
            // setState.currentPage = state.currentPage + 1;
            setState(prevState => ({
                ...prevState,
                currentPage: prevState.currentPage + 1
            }));
        }
    };

    const handlePreviousPage = () => {
        if (state.currentPage > 1) {
            setState(prevState => ({
                ...prevState,
                currentPage: prevState.currentPage - 1
            }));
            // setState.currentPage = state.currentPage - 1;
        }
    };

    //Modal
    const handleDelete = () => {
        const activeObject = state.canvas.getActiveObject();
        state.canvas.remove(activeObject);
        state.canvas.renderAll();
    };

    const handleDownload = () => {
        const dataURL = state.canvas.toDataURL({ format: 'png' });

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'CanvasCaption.png';
        link.click();
    };

    //Initial API Call
    useEffect(() => {
        if (search === "") {
            setState(prev => ({
                ...prev,
                images: ["image1", "image2", "image3", "image4", "image5", "image6", "image7", "image8",],
            }))
        }
        else {
            SearchHandle();
        }
    }, [state.currentPage, search]);

    //Create canvas
    useEffect(() => {
        // console.log("useEffect triggered");
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            height: 400,
            backgroundColor: '#f0f0f0',
        });
        // console.log("initialized:", newCanvas);  
        // setState.canvas = newCanvas;
        setState(prevState => ({
            ...prevState,
            canvas: newCanvas
        }));

        // const canvas = canvasRef.current;

        // if (canvas) {
        //     const ctx = canvas.getContext('2d');

        //     const img = new Image();
        //     img.src = state.selectedImage;  

        //     img.onload = () => {

        //         canvas.width = img.width;
        //         canvas.height = img.height;
        //         ctx.drawImage(img, 0, 0);
        //     };

        //     img.onerror = (error) => {
        //         console.error("Error loading image:", error);
        //     };
        // } else {
        //     console.error("Canvas element is not available.");
        // }

        return () => {
            newCanvas.dispose();
        };


    }, [state.show]);

    //Select Canvas Object
    useEffect(() => {
        if (state.canvas) {
            state.canvas.on("selection:created", (e) => {
                const activetext = e.selected[0];
                // setState.captionText = activetext.text || "";
                setState(prevState => ({
                    ...prevState,
                    captionText: activetext.text || ""
                }));
            });
            state.canvas.on("selection:cleared", () => {
                // setState.captionText = "";
                setState(prevState => ({
                    ...prevState,
                    captionText: ""
                }));
            });
        }
    }, [state.canvas]);

    //Update Caption
    useEffect(() => {
        const activeObject = state.canvas?.getActiveObject();
        if (activeObject && activeObject.type === "textbox") {
            activeObject.set("text", state.captionText);
            state.canvas.renderAll();
        }
    }, [state.captionText, state.canvas]);



    return (
        <>
            <div className='container-fluid border borderradius'>
                <h5 className='my-3 '>Caption Canvas</h5>

                {/* Search */}
                <Search setSearch={setSearch} search={search} setCurrentPage={state.currentPage} />


                {/* Photo Grid */}
                <div className="row">
                    {state.loading ? (<div className="col-12 text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>) : (state.images.map((image, index) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3" key={image.id}>
                            <Cards Data={image} handleImageClick={handleImageClick} />
                        </div>
                    )))}
                </div>

                {/* pagination */}
                <Pagination handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} currentPage={state.currentPage} TotalImages={state.TotalImages} imagesPerPage={imagesPerPage} />


                {/* Modal */}
                <Modal show={state.show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Canvas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='row'>
                            <div className='col-lg-6 col-md-12 col-sm-12 my-1'>
                                <canvas ref={canvasRef}></canvas>
                            </div>
                            <div className='col-lg-6 col-md-12 col-sm-12 my-1 '>

                                <Form.Group className="mb-3 d-flex" controlId="formBasicPassword">
                                    <Form.Control type="text" placeholder="Enter caption" value={state.captionText} onChange={(e) => setState(prevState => ({
                                        ...prevState,
                                        captionText: e.target.value
                                    }))} />
                                    <button className="btn btn-sm btn-primary" onClick={handleAddCaption}>Add</button>
                                </Form.Group>
                                <Form.Select aria-label="Select Shape" value={state.selectedShape}
                                    onChange={(e) => { handleShapeChange(e.target.value) }}>
                                    <option>Select Shape</option>
                                    <option value="Rectangle">Rectangle</option>
                                    <option value="Circle">Circle</option>
                                    <option value="Triangle">Triangle</option>
                                    <option value="Polygon">Polygon</option>
                                </Form.Select>
                                <div className='row justify-content-end'>
                                    <div className='col-6 justify-content-end d-flex'>

                                        <button className="btn btn-danger mt-3 justify-content-end" onClick={handleDelete}><MdDelete />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>

                        <button
                            className="btn btn-primary mt-3"
                            onClick={handleDownload}
                        >
                            Download <FaCloudDownloadAlt />
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}
