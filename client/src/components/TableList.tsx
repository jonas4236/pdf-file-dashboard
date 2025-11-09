import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { JSX } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface FileItem {
  name: string;
  url: string;
  sizeMB: string;
  modified: string;
}

const TableList = (): JSX.Element => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filtered, setFiltered] = useState<FileItem[]>([]);
  const [query, setQuery] = useState({
    name: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get<FileItem[]>(
          "http://localhost:7000/print-wos/files/",
        );
        setFiles(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("❌ Axios error:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const result = files.filter((file) =>
      file.name.toLowerCase().includes(query.name.toLowerCase()),
    );
    setFiltered(result);
  }, [query, files]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl">
        🔄 Loading files...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500 text-xl">
        ❌ {error}
      </div>
    );

  const handleDownload = async (file: FileItem) => {
    try {
      const res = await axios.get(file.url, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("❌ Download error:", err);
    }
  };

  const handleExport = async () => {
    if (selectedFiles.length === 0) {
      Swal.fire(
        "Warning",
        "Please select at least one file to download.",
        "warning",
      );
      return;
    }

    for (const file of selectedFiles) {
      try {
        const response = await axios.get(file.url, { responseType: "blob" });
        const blob = new Blob([response.data]);
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error(`❌ Failed to download ${file.name}`, error);
      }
    }
  };

  return (
    <div>
      <section className="py-3 sm:py-5">
        <div className="mx-auto container">
          <div className="relative overflow-hidden shadow-md bg-white sm:rounded-lg">
            <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
              <div className="flex items-center flex-1 space-x-4">
                <h5>
                  <span className="text-black font-medium text-xl bg-green-500 rounded-md p-2">
                    Total Files:
                  </span>
                  <span className="text-black text-2xl ml-2">
                    {filtered.length}
                  </span>
                </h5>
              </div>

              <div className="flex flex-wrap gap-3 items-center justify-end">
                <input
                  type="text"
                  placeholder="Search filename..."
                  value={query.name}
                  onChange={(e) => setQuery({ ...query, name: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                  type="button"
                  onClick={handleExport}
                  className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium cursor-pointer"
                >
                  Export ({selectedFiles.length})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[80vh] overflow-y-scroll">
              <table className="w-full text-left text-gray-700 border-collapse border border-gray-300 rounded-lg shadow-sm">
                <thead className="text-xs uppercase bg-gray-50 text-gray-700 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 border border-gray-300 w-10"></th>
                    <th className="px-4 py-3 text-base border border-gray-300 w-[800px]">
                      FILE (PDF Name)
                    </th>
                    <th className="px-4 py-3 text-base border border-gray-300">
                      MODIFIED
                    </th>
                    <th className="px-4 py-3 text-base border border-gray-300">
                      SIZE (MB)
                    </th>
                    <th className="px-4 py-3 text-base border border-gray-300">
                      VIEW
                    </th>
                    <th className="px-4 py-3 text-base border border-gray-300">
                      Download PDF
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-6 text-gray-500 text-lg"
                      >
                        No matching results
                      </td>
                    </tr>
                  ) : (
                    filtered.map((file, i) => (
                      <tr key={i} className="hover:bg-gray-100 transition">
                        <td className="p-4 border border-gray-300 text-center">
                          <input
                            type="checkbox"
                            checked={selectedFiles.some(
                              (f) => f.name === file.name,
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFiles((prev) => [...prev, file]);
                              } else {
                                setSelectedFiles((prev) =>
                                  prev.filter((f) => f.name !== file.name),
                                );
                              }
                            }}
                            className="size-5 accent-blue-600 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-4 border border-gray-300 text-lg font-medium text-gray-900 whitespace-nowrap">
                          {file.name}
                        </td>
                        <td className="px-4 py-4 border border-gray-300 text-center text-lg font-medium text-gray-900">
                          {file.modified}
                        </td>
                        <td className="px-4 py-4 border border-gray-300 text-center text-lg font-medium text-gray-900">
                          {file.sizeMB} MB
                        </td>
                        <td className="px-4 py-4 border border-gray-300 text-center">
                          <Link to={file.url}>
                            <button className="px-6 py-2  bg-blue-600 text-white rounded-md transition font-medium text-lg cursor-pointer">
                              VIEW
                            </button>
                          </Link>
                        </td>
                        <td className="px-4 py-4 border border-gray-300 text-center">
                          <button
                            onClick={() => handleDownload(file)}
                            className="px-6 py-2 bg-green-600 text-white rounded-md transition text-base font-medium cursor-pointer"
                          >
                            DOWNLOAD
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TableList;
