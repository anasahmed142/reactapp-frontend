import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./App";

const Home = () => {
    const { loggedIn, setLoggedIn, email } = useContext(AuthContext);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [tags, setTags] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadError, setUploadError] = useState(null);

    useEffect(() => {
        // Fetch uploaded files on load
        if (loggedIn) {
            fetchUploadedFiles();
        }
    }, [loggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setLoggedIn(false);
        navigate("/login");
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).filter(file => 
            file.type.startsWith("image/") || file.type.startsWith("video/")
        );
        setFiles(selectedFiles);
    };

    const handleTagChange = (index, value) => {
        setTags({ ...tags, [index]: value });
    };

    const handleUpload = () => {
        if (files.length === 0) {
            setUploadError("Please select files to upload.");
            return;
        }
        const updatedTags = files.map((_, index) => tags[index] || "Untitled");

        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append("files", file);
            formData.append(`tags[${index}]`, updatedTags[index]);
        });

        fetch("http://localhost:3080/upload", {
            method: "POST",
            headers: {
                'jwt-token': JSON.parse(localStorage.getItem("user"))?.token || ""
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Files uploaded successfully!');
                fetchUploadedFiles();
                setUploadedFiles(data.files || []);
                setFiles([]);
                setUploadError(null);
            } else {
                setUploadError("File upload failed. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error during upload:', error);
            setUploadError("An error occurred while uploading the files.");
        });
    };

    const fetchUploadedFiles = () => {
        setFiles([]);
        fetch("http://localhost:3080/files", {
            method: "GET",
            headers: {
                'jwt-token': JSON.parse(localStorage.getItem("user"))?.token || "",
            },
        })
        .then(response => response.json())
        .then(data => setUploadedFiles(data.files || []))
        .catch(() => setUploadError("Failed to fetch files."));
    };

    
    const getShareableLink = (fileId) => {
        const link = `${window.location.origin}/files/${fileId}`;

        return link; // Return the shareable link
    };

    return (
        <div className="mainContainer">
            <div className={"titleContainer"}>
                <div>Welcome!</div>
            </div>
            <div>{loggedIn ? `Hello, ${email}` : "Please log in"}</div>
            <div className={"buttonContainer"}>
                {loggedIn ? (
                    <>
                        <input
                            className={"inputButton"}
                            type="button"
                            onClick={handleLogout}
                            value="Log out"
                        />
                        <div>Your email address is {email}</div>
                    </>
                ) : (
                    <input
                        className={"inputButton"}
                        type="button"
                        onClick={() => navigate("/login")}
                        value="Log in"
                    />
                )}
            </div>

            {loggedIn && (
                <div>
                    <h3>Upload Files</h3>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        style={{
                            padding: '10px',
                            margin: '5px 0',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            backgroundColor: '#f9f9f9',
                        }}
                        onChange={handleFileChange}
                    />
                    {files.length > 0 && (
                        <div>
                            {files.map((file, index) => (
                                <div key={index}>
                                    <input
                                        type="text"
                                        placeholder="Enter tag for file"
                                        onChange={(e) => handleTagChange(index, e.target.value)}
                                    />
                                </div>
                            ))}
                            <button onClick={handleUpload}>Upload</button>
                        </div>
                    )}
                    {uploadError && <div className="error-message">{uploadError}</div>}
                    <h3>Uploaded Files</h3>
                    <div className="file-container">
                        {uploadedFiles.length > 0 ? (
                            uploadedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '10px',
                                        margin: '5px 0',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        backgroundColor: '#f9f9f9',
                                    }}
                                >
                                    <p>{file.filename}</p>
                                    <p>Views: {file.views}</p>
                                    <p>Shareable Link: 
                                        <a
                                            href={getShareableLink(file.fileId)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Link
                                        </a>
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No files uploaded yet</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
