import React, { useState, useRef } from "react";
import Papa from "papaparse";

const Jsonit = () => {
  const [resultMessage, setResultMessage] = useState("");
  const [jsonUrl, setJsonUrl] = useState("");

  /** @type {React.MutableRefObject<HTMLInputElement|null>} */
  const fileInputRef = useRef(null);

  const sampleCsv = `product_category,title,variation_name,sku_code,made_in,features,filters,regular_price,offer_price,product_details,product_info,variation_value,image_url
13,Product A,Size Small,SKU001,USA,CFM:50|MANUFACTURER:Arrow Pneumatics|HP:10HP|CSU:90 micron,CATEGORY:Fan|TYPE:Industrial,20,15,Cotton Blend,Care: Washable,Small,http://image1.com
13,Product A,Size Medium,SKU002,USA,CFM:50|MANUFACTURER:Arrow Pneumatics,SIZE:Medium|COLOR:Blue,22,16,Cotton Blend,Care: Washable,Medium,http://image2.com
13,Product A,Color Red,SKU003,USA,COLOR:Red|BRAND:Generic,TAG:Hot|SEASON:Summer,21,15.5,Cotton Blend,Care: Washable,Red,http://image3.com
14,Product B,Size Large,SKU004,China,WEIGHT:Light,USAGE:Outdoor|GRADE:Premium,30,25,Polyester,Care: Dry Clean,Large,http://image4.com`;

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sample_structure.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---------- helpers ----------
  const parseFeatures = (featuresStr) => {
    if (!featuresStr || typeof featuresStr !== "string") return [];
    const trimmed = featuresStr.trim();

    // JSON array support
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((f) => ({
            feature_name: f.feature_name ?? f.name ?? "",
            feature_value: f.feature_value ?? f.value ?? "",
          }));
        }
      } catch {
        // fall back
      }
    }

    // Pipe format: KEY:VAL|KEY:VAL
    return trimmed
      .split("|")
      .map((pair) => {
        const idx = pair.indexOf(":");
        if (idx === -1) return null;
        const name = pair.slice(0, idx).trim();
        const value = pair.slice(idx + 1).trim();
        if (!name) return null;
        return { feature_name: name, feature_value: value || "" };
      })
      .filter(Boolean);
  };

  const parseFilters = (filtersStr) => {
    if (!filtersStr || typeof filtersStr !== "string") return [];
    const trimmed = filtersStr.trim();

    // JSON array support
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((f) => ({
            key: f.key ?? f.name ?? "",
            value: f.value ?? "",
          }));
        }
      } catch {
        // fall back
      }
    }

    // Pipe format: KEY:VAL|KEY:VAL
    return trimmed
      .split("|")
      .map((pair) => {
        const idx = pair.indexOf(":");
        if (idx === -1) return null;
        const key = pair.slice(0, idx).trim();
        const value = pair.slice(idx + 1).trim();
        if (!key) return null;
        return { key, value: value || "" };
      })
      .filter(Boolean);
  };

  const toNumberOrZero = (v) => {
    if (v === null || v === undefined) return 0;
    const s = String(v).trim();
    if (!s) return 0;
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  const convertCSVtoJSON = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setResultMessage("Please select a CSV file.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      // This handles quoted fields with commas/newlines properly
      newline: "",
      complete: (results) => {
        const rows = Array.isArray(results.data) ? results.data : [];

        if (!rows.length) {
          setResultMessage("CSV file is empty or has no data rows.");
          return;
        }

        const normalizedData = rows.map((row) => {
          const normalized = { ...row };

          // If title missing, derive from variation_name (optional)
          if (!normalized.title && normalized.variation_name) {
            normalized.title = String(normalized.variation_name).replace(
              /,\s*QTY[-\s]*\d+.*/i,
              ""
            );
          }

          normalized.features = parseFeatures(normalized.features);
          normalized.filters = parseFilters(normalized.filters);

          normalized.regular_price = toNumberOrZero(normalized.regular_price);
          normalized.offer_price = toNumberOrZero(normalized.offer_price);

          if (
            normalized.image_url &&
            String(normalized.image_url).toUpperCase() === "NULL"
          ) {
            normalized.image_url = "";
          }

          // Keep extra fields if present
          if (normalized.stock !== undefined) {
            const st = String(normalized.stock).trim();
            normalized.stock = st === "" ? "" : toNumberOrZero(st);
          }

          return normalized;
        });

        // Group by product_category + title
        const grouped = {};
        normalizedData.forEach((row) => {
          const key = `${row.product_category || ""}__${row.title || ""}`;

          if (!grouped[key]) {
            grouped[key] = {
              product_category: row.product_category || "",
              title: row.title || "",
              variation: [],
            };
          }

          grouped[key].variation.push({
            variation_name: row.variation_name ?? "",
            variation_value: row.variation_value ?? "",
            sku_code: row.sku_code ?? "",
            made_in: row.made_in ?? "",
            features: row.features ?? [],
            filters: row.filters ?? [],
            regular_price: row.regular_price ?? 0,
            offer_price: row.offer_price ?? 0,
            stock: row.stock ?? "",
            product_details: row.product_details ?? "",
            product_info: row.product_info ?? "",
            image_url: row.image_url ?? "",
            rating: row.rating ?? "",
            total_ratings: row.total_ratings ?? "",
            shipping_days: row.shipping_days ?? "",
            id: row.id ?? "",
          });
        });

        const result = Object.values(grouped);
        const jsonString = JSON.stringify(result, null, 2);

        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        // Clean previous url if user re-runs
        setJsonUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });

        setResultMessage(
          "Conversion successful. Click the button below to download the JSON file."
        );
      },
      error: () => {
        setResultMessage("Error parsing the CSV file.");
      },
    });
  };

  const handleDownload = () => {
    if (!jsonUrl) return;
    const link = document.createElement("a");
    link.href = jsonUrl;
    link.download = "products.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="jsonit min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          CSV to Nested JSON Converter
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          Upload your CSV file to convert it into a nested JSON format.
        </p>

        <div className="input-group mb-4">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={convertCSVtoJSON}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200 mb-4"
        >
          Convert to JSON
        </button>

        {resultMessage && (
          <div className="text-center">
            <p
              className={`text-sm ${
                resultMessage.toLowerCase().includes("successful")
                  ? "text-green-600"
                  : "text-red-600"
              } mb-2`}
            >
              {resultMessage}
            </p>

            {jsonUrl && (
              <button
                onClick={handleDownload}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
              >
                Download JSON
              </button>
            )}
          </div>
        )}

        {/* Sample CSV Table preview */}
        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              📄 Sample CSV Format
            </h2>
            <button
              onClick={downloadSampleCSV}
              className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Download CSV Format
            </button>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm text-left text-gray-700 border border-gray-300 rounded">
              <thead className="bg-gray-200">
                <tr>
                  {[
                    "product_category",
                    "title",
                    "variation_name",
                    "sku_code",
                    "made_in",
                    "features",
                    "filters",
                    "regular_price",
                    "offer_price",
                    "product_details",
                    "product_info",
                    "variation_value",
                    "image_url",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-2 py-1 border border-gray-300"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleCsv
                  .split("\n")
                  .slice(1)
                  .map((row, index) => (
                    <tr key={index} className="bg-white border-t">
                      {row.split(",").map((cell, idx) => (
                        <td
                          key={idx}
                          className="px-2 py-1 border border-gray-200"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jsonit;
