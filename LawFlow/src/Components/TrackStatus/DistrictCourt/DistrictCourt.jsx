import React, { useState } from "react";

function DistrictCourt() {
  const [field, setField] = useState("");
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formHandler = async (e, endpoint) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const body = JSON.stringify(Object.fromEntries(formData));

    try {
      const response = await fetch(`https://lexgram.onrender.com/district-court/${endpoint}`, {
        method: "POST",
        body: body,
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const resData = await response.json();
      setCaseDetails(resData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="w-full min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">District Court Case Search</h1>
        
        <div className="mb-6 w-full">
          <select 
            onChange={(e) => setField(e.target.value)} 
            className="w-full bg-gray-900 text-white p-4 rounded border border-gray-700 text-lg"
            defaultValue=""
          >
            <option value="" disabled>Select a search method...</option>
            <option value="Case Details">Case Details (CNR Search)</option>
            <option value="Filing Number">Case Details (Filing Number Search)</option>
          </select>
        </div>

        {field === "Case Details" && (
          <div className="w-full bg-gray-900 rounded p-6 mb-6">
            <form onSubmit={(e) => formHandler(e, "case")}>
              <label className="block text-xl mb-2">Enter CNR Number</label>
              <input 
                name="cnr" 
                placeholder="Enter CNR Number..." 
                className="w-full bg-black text-white p-4 rounded border border-gray-700 mb-4"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white p-4 rounded text-lg font-medium"
              >
                Search by CNR
              </button>
            </form>
          </div>
        )}

        {field === "Filing Number" && (
          <div className="w-full bg-gray-900 rounded p-6 mb-6">
            <form onSubmit={(e) => formHandler(e, "filing-number")}>
              <label className="block text-xl mb-2">Enter Filing Number</label>
              <input 
                name="filingNumber" 
                placeholder="Enter Filing Number..." 
                className="w-full bg-black text-white p-4 rounded border border-gray-700 mb-4"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-green-600 text-white p-4 rounded text-lg font-medium"
              >
                Search by Filing Number
              </button>
            </form>
          </div>
        )}

        {loading && (
          <div className="w-full flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            <p className="ml-3">Loading...</p>
          </div>
        )}
        
        {error && (
          <div className="w-full bg-red-900 text-white p-4 rounded mb-6">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {caseDetails && (
          <div className="w-full bg-gray-900 rounded p-6">
            <h2 className="text-2xl font-bold mb-4">{caseDetails.title || "Case Details"}</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Case Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black p-4 rounded">
                  <p className="text-gray-400">CNR Number</p>
                  <p className="font-medium">{caseDetails.cnr || "N/A"}</p>
                </div>
                <div className="bg-black p-4 rounded">
                  <p className="text-gray-400">Status</p>
                  <p className="font-medium">{caseDetails.status?.status || "N/A"}</p>
                </div>
                <div className="bg-black p-4 rounded">
                  <p className="text-gray-400">Current Stage</p>
                  <p className="font-medium">{caseDetails.status?.stage || "N/A"}</p>
                </div>
                <div className="bg-black p-4 rounded">
                  <p className="text-gray-400">Last Listed On</p>
                  <p className="font-medium">{formatDate(caseDetails.status?.lastListedOn)}</p>
                </div>
                <div className="bg-black p-4 rounded">
                  <p className="text-gray-400">Next Hearing Date</p>
                  <p className="font-medium">{formatDate(caseDetails.status?.nextDate)}</p>
                </div>
                <div className="bg-black p-4 rounded">
                  <p className="text-gray-400">Filing Date</p>
                  <p className="font-medium">{formatDate(caseDetails.filingDate)}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Parties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black p-4 rounded">
                  <p className="text-gray-400">Petitioners</p>
                  <p>{caseDetails.parties?.petitioners?.join(", ") || "N/A"}</p>
                </div>
                <div className="bg-black p-4 rounded">
                  <p className="text-gray-400">Respondents</p>
                  <p>{caseDetails.parties?.respondents?.join(", ") || "N/A"}</p>
                </div>
              </div>
            </div>

            {caseDetails.defects?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Defects</h3>
                <div className="space-y-3">
                  {caseDetails.defects.map((defect, index) => (
                    <div key={index} className="bg-black p-4 rounded">
                      <div className="flex justify-between flex-wrap">
                        <span className="font-medium">Defect #{defect.serialNumber}</span>
                        <span className="text-gray-400 text-sm">
                          Notified: {formatDate(defect.notificationDate)}
                        </span>
                      </div>
                      <p className="my-1">{defect.default}</p>
                      <p className="text-gray-400 text-sm">
                        Remarks: {defect.remarks}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Removal date: {formatDate(defect.removalDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {caseDetails.history?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Case History</h3>
                <div className="space-y-3">
                  {caseDetails.history.map((item, index) => (
                    <div key={index} className="bg-black p-4 rounded">
                      <div className="flex justify-between flex-wrap">
                        <div className="font-medium">{formatDate(item.date)}</div>
                        <div className="text-gray-300">{item.stage}</div>
                      </div>
                      <div className="text-gray-400 mt-1">{item.purpose}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {caseDetails.orders?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Orders</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caseDetails.orders.map((order, index) => (
                    <a 
                      key={index}
                      className="bg-blue-900 p-4 rounded text-center"
                      href={order.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Order - {formatDate(order.date)}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DistrictCourt;