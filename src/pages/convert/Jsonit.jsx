import React, { useState, useRef } from 'react';

const Jsonit = () => {
  const [resultMessage, setResultMessage] = useState('');
  const [jsonUrl, setJsonUrl] = useState('');
  const fileInputRef = useRef(null);

  const sampleCsv = `product_category,title,variation_name,sku_code,made_in,features,regular_price,offer_price,product_details,product_info,variation_value,image_url
13,Product A,Size Small,SKU001,USA,CFM:50|MANUFACTURER:Arrow Pneumatics|HP:10HP|CSU:90 miron,20,15,Cotton Blend,Care: Washable,Small,http://image1.com
13,Product A,Size Medium,SKU002,USA,CFM:50|MANUFACTURER:Arrow Pneumatics,22,16,Cotton Blend,Care: Washable,Medium,http://image2.com
13,Product A,Color Red,SKU003,USA,COLOR:Red|BRAND:Generic,21,15.5,Cotton Blend,Care: Washable,Red,http://image3.com
14,Product B,Size Large,SKU004,China,WEIGHT:Light,30,25,Polyester,Care: Dry Clean,Large,http://image4.com`;

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sample_structure.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertCSVtoJSON = () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      setResultMessage('Please select a CSV file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').filter(row => row.trim() !== '');
      const headers = rows[0].split(',').map(header => header.trim());
      const data = rows.slice(1).map(row => {
        const values = row.split(',').map(value => value.trim());
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index];
        });
        return obj;
      });

      const parseFeatures = (featuresStr) => {
        if (!featuresStr || typeof featuresStr !== 'string') return [];
        const features = [];
        const featurePairs = featuresStr.split('|');
        for (let pair of featurePairs) {
          if (pair.includes(':')) {
            const [name, value] = pair.split(':', 2).map(item => item.trim());
            features.push({ feature_name: name, feature_value: value });
          }
        }
        return features;
      };

      data.forEach(row => {
        row.features = parseFeatures(row.features);
        row.regular_price = parseFloat(row.regular_price) || 0;
        row.offer_price = parseFloat(row.offer_price) || 0;
      });

      const grouped = {};
      data.forEach(row => {
        const key = `${row.product_category}-${row.title}`;
        if (!grouped[key]) {
          grouped[key] = { product_category: row.product_category, title: row.title, variation: [] };
        }
        grouped[key].variation.push({
          variation_name: row.variation_name,
          sku_code: row.sku_code,
          made_in: row.made_in,
          features: row.features,
          regular_price: row.regular_price,
          offer_price: row.offer_price,
          product_details: row.product_details,
          product_info: row.product_info,
          variation_value: row.variation_value,
          image_url: row.image_url
        });
      });

      const result = Object.values(grouped);
      const jsonString = JSON.stringify(result, null, 2);

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      setJsonUrl(url);
      setResultMessage('Conversion successful! Click the button below to download the JSON file.');
    };

    reader.onerror = () => {
      setResultMessage('Error reading the file.');
    };

    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (jsonUrl) {
      const link = document.createElement('a');
      link.href = jsonUrl;
      link.download = 'products.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(jsonUrl);
      setJsonUrl('');
    }
  };

  return (
    <div className="jsonit min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">CSV to Nested JSON Converter</h1>
        <p className="text-gray-600 mb-4 text-center">Upload your CSV file to convert it into a nested JSON format for Directus.</p>

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
            <p className={`text-sm ${resultMessage.includes('successful') ? 'text-green-600' : 'text-red-600'} mb-2`}>
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

        {/* CSV Table */}
        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">📄 Sample CSV Format</h2>
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
                    "product_category", "title", "variation_name", "sku_code", "made_in", "features",
                    "regular_price", "offer_price", "product_details", "product_info", "variation_value", "image_url"
                  ].map(header => (
                    <th key={header} className="px-2 py-1 border border-gray-300">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleCsv.split('\n').slice(1).map((row, index) => (
                  <tr key={index} className="bg-white border-t">
                    {row.split(',').map((cell, idx) => (
                      <td key={idx} className="px-2 py-1 border border-gray-200">{cell}</td>
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
