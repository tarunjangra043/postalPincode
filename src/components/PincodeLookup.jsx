import React, { useState, useEffect } from "react";
import "../PincodeLookup.css";

const PincodeLookup = () => {
  const [pincode, setPincode] = useState("");
  const [postOffices, setPostOffices] = useState([]);
  const [filteredPostOffices, setFilteredPostOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const fetchPincodeData = async () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError("Pincode must be a 6-digit number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0].Status === "Error") {
        setError("Invalid pincode or no data found.");
        setPostOffices([]);
      } else {
        setPostOffices(data[0].PostOffice);
        setFilteredPostOffices(data[0].PostOffice);
      }
    } catch (err) {
      setError("Failed to fetch pincode data.");
    }

    setLoading(false);
  };

  // Filter post offices by name
  useEffect(() => {
    if (filter) {
      const filtered = postOffices.filter((office) =>
        office.Name.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredPostOffices(filtered);
    } else {
      setFilteredPostOffices(postOffices);
    }
  }, [filter, postOffices]);

  return (
    <div className="pincode-lookup">
      {postOffices.length === 0 && (
        <>
          <h2>Enter Pincode</h2>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Pincode"
            className="pincode-input"
          />
          <button onClick={fetchPincodeData} className="lookup-button">
            Lookup
          </button>
        </>
      )}

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="result-section">
          {postOffices.length > 0 && (
            <>
              <h3>Pincode: {pincode}</h3>
              <p>Message: Number of post offices found!</p>
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter"
                className="filter-input"
              />
              <div className="post-office-grid">
                {filteredPostOffices.length > 0 ? (
                  filteredPostOffices.map((office, index) => (
                    <div key={index} className="post-office-card">
                      <h4>{office.Name}</h4>
                      <p>Branch Type: {office.BranchType}</p>
                      <p>Delivery Status: {office.DeliveryStatus}</p>
                      <p>District: {office.District}</p>
                      <p>State: {office.State}</p>
                    </div>
                  ))
                ) : (
                  <p>Couldn’t find the postal data you’re looking for…</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PincodeLookup;
