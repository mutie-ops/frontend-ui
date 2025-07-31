import '../css/dashboard.css';
import React from 'react';
import * as XLSX from 'xlsx';
import templates from '../Template/biometric_template.js';
import SageTemplateTab from '../components/SageTab.jsx';

function Dashboard() {
    const [excelData, setExcelData] = React.useState(()=>
    {
        const stored = localStorage.getItem('excelData');
        return stored ?  JSON.parse(stored) : [];
    });


    const [selectedRows, setSelectedRows] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [columnFilters, setColumnFilters] = React.useState({});
    const [templateInfo, setTemplateInfo] = React.useState(() => {
        const stored = localStorage.getItem('templateInfo');
        return stored ? JSON.parse(stored) : null;
    });


    const [activeTab, setActiveTab] = React.useState(() => {
        return localStorage.getItem('activeTab') || 'import';
    });

    React.useEffect(() => {
        localStorage.setItem('excelData', JSON.stringify(excelData));
    }, [excelData]);

    React.useEffect(() => {
        localStorage.setItem('templateInfo', JSON.stringify(templateInfo));
    }, [templateInfo]);

    React.useEffect(() => {
        localStorage.setItem('activeTab', activeTab);
    }, [activeTab]);


    const fileInputRef = React.useRef(null);
    const editableColumns = templateInfo?.editableColumns || [];
    const filterableColumns = templateInfo?.filterableColumns || [];

    function handleFileUpload(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = function (evt) {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const raw = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const uploadedHeaders = raw[0];

            console.log("Uploaded Headers:", uploadedHeaders);

            const matchedTemplate = Object.entries(templates).find(([key, tmpl]) => (
                tmpl.expectedHeaders.length === uploadedHeaders.length &&
                tmpl.expectedHeaders.every((h, i) => h === uploadedHeaders[i])
            ));

            if (!matchedTemplate) {
                alert("Uploaded Excel does not match any known template.");
                return;
            }

            const [templateKey, template] = matchedTemplate;
            setTemplateInfo(template);

            const dataJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            setExcelData(dataJson);
            setActiveTab('sage'); // auto switch to Sage tab
        };

        reader.readAsArrayBuffer(file);
    }

    function handleCellChange(rowIndex, key, value) {
        const updatedData = [...excelData];
        updatedData[rowIndex][key] = value;
        setExcelData(updatedData);
    }

    function handleImport() {
        fileInputRef.current?.click();
    }

    function handleDeleteSelected() {
        const updatedData = excelData.filter((_, index) => !selectedRows.includes(index));
        setExcelData(updatedData);
        setSelectedRows([]);
    }

    function toggleRowSelection(index) {
        setSelectedRows(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    }

    function toggleSelectAll(e) {
        setSelectedRows(e.target.checked ? excelData.map((_, i) => i) : []);
    }

    function handleColumnFilterChange(column, value) {
        setColumnFilters(prev => ({ ...prev, [column]: value }));
    }

    function getFilteredRows() {
        return excelData.filter(row => {
            const matchesSearch = Object.values(row).some(value =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            );

            const matchesFilters = Object.entries(columnFilters).every(([key, value]) =>
                value === '' || String(row[key]) === value
            );

            return matchesSearch && matchesFilters;
        });
    }

    return (
        <div className="Dashboard-container">
            <h2>{templateInfo?.name || "Upload Template"}</h2>

            <input
                type="file"
                accept=".xlsx, .xls, .csv"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />

            {/* TABS HEADER */}
            <div className="tab-header">
                <div
                    className={`tab-item ${activeTab === 'import' ? 'active' : ''}`}
                    onClick={() => setActiveTab('import')}
                >
                    {templateInfo?.name ? `${templateInfo.name} Template` : ''}
                </div>
                {excelData.length > 0 && (
                    <div
                        className={`tab-item ${activeTab === 'sage' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sage')}
                    >
                        Sage Template
                    </div>
                )}
            </div>

            {/* IMPORT TAB */}
            {activeTab === 'import' && (
                <>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <button onClick={handleImport} className="import-button">Import Excel</button>
                        {selectedRows.length > 0 && (
                            <button
                                onClick={handleDeleteSelected}
                                className="import-button"
                                style={{ backgroundColor: '#ffdddd', color: '#b30000' }}
                            >
                                Remove Selected
                            </button>
                        )}
                    </div>

                    {excelData.length > 0 && (
                        <>
                            <div className='search-filter'>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ padding: '8px', width: '300px' }}
                                />

                                {filterableColumns.map((column) => {
                                    const uniqueValues = [...new Set(excelData.map(row => row[column]))].filter(v => v !== '');

                                    return (
                                        <select
                                            key={column}
                                            value={columnFilters[column] || ''}
                                            onChange={(e) => handleColumnFilterChange(column, e.target.value)}
                                            style={{ padding: '8px', maxWidth: '150px' }}
                                        >
                                            <option value="">{column} (All)</option>
                                            {uniqueValues.map((val, idx) => (
                                                <option key={idx} value={val}>{val}</option>
                                            ))}
                                        </select>
                                    );
                                })}
                            </div>

                            <div className="table-scroll-wrapper">
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.length === excelData.length}
                                                    onChange={toggleSelectAll}
                                                />
                                            </th>
                                            {Object.keys(excelData[0]).map(header => (
                                                <th key={header}>{header}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {getFilteredRows().map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRows.includes(rowIndex)}
                                                        onChange={() => toggleRowSelection(rowIndex)}
                                                    />
                                                </td>
                                                {Object.entries(row).map(([key, value], colIndex) => {
                                                    const editable = editableColumns.includes(key);
                                                    return (
                                                        <td key={colIndex}>
                                                            {editable ? (
                                                                <input
                                                                    type="text"
                                                                    value={value}
                                                                    onChange={(e) => handleCellChange(rowIndex, key, e.target.value)}
                                                                />
                                                            ) : (
                                                                <span>{value}</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* SAGE TEMPLATE TAB */}
            {activeTab === 'sage' && excelData.length > 0 && (
                <SageTemplateTab
                    excelData={excelData}
                    setExcelData={setExcelData}
                    templateInfo={templateInfo}
                />
            )}
        </div>
    );
}

export default Dashboard;
