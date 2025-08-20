import React, { useState, useEffect } from 'react';
import '../css/utilities.css';

function Utilities() {
    const payrollDefinitions = {
        EA: {
            name: 'Earnings',
            definitions: ['OVERTIME_15', 'OVERTIME_20', 'ROLLCALLOT1', 'ROLLCALLOT2','LOST_HOURS']
        },
        DD: {
            name: 'Deductions',
            definitions: ['ABSENTEEISM']
        }
    };

    const [selectedCategories, setSelectedCategories] = useState({});
    const [selectedItems, setSelectedItems] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [config, setConfig] = useState({
        url: '',
        db: '',
        apiKey: ''
    });

    // Load from localStorage on mount
    useEffect(() => {
        const savedCategories = localStorage.getItem('selectedCategories');
        const savedItems = localStorage.getItem('selectedItems');
        const savedConfig = localStorage.getItem('apiConfig');

        if (savedCategories) setSelectedCategories(JSON.parse(savedCategories));
        if (savedItems) setSelectedItems(JSON.parse(savedItems));
        if (savedConfig) setConfig(JSON.parse(savedConfig));
    }, []);

    function handleCategoryToggle(code) {
        setSelectedCategories(prev => ({
            ...prev,
            [code]: !prev[code]
        }));
    }

    function handleDefinitionToggle(categoryCode, definition) {
        setSelectedItems(prev => ({
            ...prev,
            [categoryCode]: {
                ...prev[categoryCode],
                [definition]: !prev?.[categoryCode]?.[definition]
            }
        }));
    }

    function handleInputChange(field, value) {
        setConfig(prev => ({ ...prev, [field]: value }));
    }

    function saveConfigToStorage() {
        localStorage.setItem('apiConfig', JSON.stringify(config));
        setIsEditing(false);
    }

    function savePayrollSettings() {
        localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
        alert('Payroll parameters saved');
    }

    return (
        <div className="Dashboard-container">
            <h2>Sage 300 People Parameters</h2>

            {/* ========== DATABASE SETTINGS ========== */}
            {/*<div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '25px', borderRadius: '5px' }}>*/}
            {/*    <h3>Connection Settings</h3>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        placeholder="URL"*/}
            {/*        value={config.url}*/}
            {/*        onChange={(e) => handleInputChange('url', e.target.value)}*/}
            {/*        style={{ margin: '5px', padding: '5px 10px' }}*/}
            {/*        disabled={!isEditing}*/}
            {/*    />*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        placeholder="Database Name"*/}
            {/*        value={config.db}*/}
            {/*        onChange={(e) => handleInputChange('db', e.target.value)}*/}
            {/*        style={{ margin: '5px', padding: '5px 10px' }}*/}
            {/*        disabled={!isEditing}*/}
            {/*    />*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        placeholder="API Key"*/}
            {/*        value={config.apiKey}*/}
            {/*        onChange={(e) => handleInputChange('apiKey', e.target.value)}*/}
            {/*        style={{ margin: '5px', padding: '5px 10px' }}*/}
            {/*        disabled={!isEditing}*/}
            {/*    />*/}

            {/*    <div className="save-buttons" style={{ marginTop: '10px' }}>*/}
            {/*        {isEditing ? (*/}
            {/*            <button onClick={saveConfigToStorage}>Save</button>*/}
            {/*        ) : (*/}
            {/*            <button onClick={() => setIsEditing(true)}>Edit</button>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* ========== PAYROLL DEFINITIONS ========== */}
            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' , overflowY: 'auto', }}>
                <h3>Payroll Definitions</h3>

                {Object.entries(payrollDefinitions).map(([code, { name, definitions }]) => (
                    <div key={code} style={{ marginBottom: '15px' }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={!!selectedCategories[code]}
                                onChange={() => handleCategoryToggle(code)}
                            />{' '}
                            {name}
                        </label>

                        {selectedCategories[code] && (
                            <div
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                    marginTop: '10px',
                                    backgroundColor: '#f1f1f1'
                                }}
                            >
                                <strong>Select {name}:</strong>
                                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                                    {definitions.map((item) => (
                                        <li key={item}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems?.[code]?.[item] || false}
                                                    onChange={() => handleDefinitionToggle(code, item)}
                                                />{' '}
                                                {item}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}

                <div className="save-buttons" style={{ marginTop: '15px' }}>
                    <button style={{width:'150px'}} onClick={savePayrollSettings}>Save Payroll Parameters</button>
                </div>
            </div>
        </div>
    );
}

export default Utilities;
