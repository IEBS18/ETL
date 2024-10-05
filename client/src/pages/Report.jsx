import React, { useEffect, useState } from 'react';
import { File, Folder, Tree } from "@/components/ui/file-tree";
import { Trash } from 'lucide-react';
import { LoaderCircle } from 'lucide-react'; // Import LoaderCircle
import { toast } from "sonner"

function Report() {
    const [extractedFiles, setExtractedFiles] = useState([]);
    const [transformedFiles, setTransformedFiles] = useState([]);
    const [tableData, setTableData] = useState({ columns: [], rows: [] }); // State for table data
    const [loading, setLoading] = useState(false); // Loading state

    // Fetch files on component mount
    useEffect(() => {
        async function fetchFiles() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/getallfiles`, {
                    method: 'GET',
                    credentials: 'include', // Include credentials (cookies)
                });
                const data = await response.json();
                setExtractedFiles(data.extracted_files);
                setTransformedFiles(data.transformed_files);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        }
        fetchFiles();
    }, []);

    // Function to extract the filename from the S3 path
    const getFilenameFromPath = (s3Path) => {
        return s3Path.split('/').pop();  // Get the last part of the S3 path
    };

    // Function to fetch table data based on the clicked file
    const fetchTableData = async (filePath) => {
        setLoading(true); // Set loading to true when starting fetch
        try {
            const payload = {
                output_path: filePath,
            };
            const response = await fetch(`${import.meta.env.VITE_API_URL}/viewdata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setTableData({ columns: data.columns, rows: data.first_fifty_rows });
            } else {
                console.error('Error fetching file data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching file data:', error);
        } finally {
            setLoading(false); // Set loading to false when fetch is complete
        }
    };

    // Function to delete file
    const deleteFile = async (filePath, type) => {
        try {
            const payload = {
                filePath: filePath,
                type: type
            };
            const response = await fetch(`${import.meta.env.VITE_API_URL}/deletefile`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                credentials: 'include', // Include credentials for DELETE request
            });

            if (response.ok) {
                toast("File Deleted.")
                if (type === 'extracted') {
                    setExtractedFiles(extractedFiles.filter(file => file !== filePath));
                } else if (type === 'transformed') {
                    setTransformedFiles(transformedFiles.filter(file => file.s3_path !== filePath));
                }
            } else {
                console.error('Error deleting file:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    return (
        <div className="relative flex h-full w-full flex-row m-y-2">
            {/* File Tree */}
            <div className="w-1/2 rounded-lg border bg-background md:shadow-xl mr-2">
                <Tree
                    className="p-2 overflow-hidden rounded-md bg-background"
                    initialExpandedItems={["1", "2", "3"]}
                    elements={ELEMENTS}
                >
                    <Folder element="MineX" value="1">
                        <Folder element="Extracted" value="2">
                            {extractedFiles.map((file, index) => (
                                <File key={index} value={file}>
                                    <p className="flex items-center" onClick={() => fetchTableData(file)}>
                                        {getFilenameFromPath(file)}
                                    </p>
                                    <Trash
                                        className="ml-2 cursor-pointer text-red-500"
                                        onClick={() => deleteFile(file, 'extracted')}
                                        size={16}
                                    />
                                </File>
                            ))}
                        </Folder>

                        <Folder element="Transformed" value="3">
                            {transformedFiles.map((file, index) => (
                                <File key={index} value={file.s3_path}>
                                    <p className="flex items-center" onClick={() => fetchTableData(file.s3_path)}>
                                        {getFilenameFromPath(file.s3_path)}, Query: {file.sql_query}
                                    </p>
                                    <Trash
                                        className="ml-2 cursor-pointer text-red-500"
                                        onClick={() => deleteFile(file.s3_path, 'transformed')}
                                        size={16}
                                    />
                                </File>
                            ))}
                        </Folder>
                    </Folder>
                </Tree>
            </div>

            {/* Table View */}
            <div className="w-1/2 max-w-[800px] p-4 border bg-background rounded-lg md:shadow-xl overflow-auto max-h-[800px]">
                {loading ? ( // Show loading indicator while fetching
                    <div className="flex items-center justify-center h-full">
                        <LoaderCircle className="animate-spin text-blue-500" size={40} />
                    </div>
                ) : tableData.columns.length > 0 ? (
                    <table className="min-w-full bg-white text-left">
                        <thead>
                            <tr>
                                {tableData.columns.map((col, index) => (
                                    <th key={index} className="py-2 px-4 border bg-gray-700 text-white">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {tableData.columns.map((col, colIndex) => (
                                        <td key={colIndex} className="py-2 px-4 border">{row[col]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className='text-5xl font-bold text-center'>Click on a file to preview its data.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Static ELEMENTS data for initial tree rendering
const ELEMENTS = [
    {
        id: "1",
        isSelectable: false,
        name: "MineX",
        children: [
            {
                id: "2",
                isSelectable: false,
                name: "Extracted",
            },
            {
                id: "3",
                isSelectable: false,
                name: "Transformed",
            },
        ],
    },
];

export default Report;
