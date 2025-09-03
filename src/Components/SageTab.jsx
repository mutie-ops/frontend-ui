import React, { useState } from 'react';
import '../css/Dashboard.css';
import * as XLSX from 'xlsx';
import { getToken } from "../Controllers/Authorization.js";
import payrollTemplate from '../Template/payroll_template.js';

function SageTemplateTab({ excelData, templateKey = 'sage' }) {
    const [serverMessages, setServerMessages] = useState([]);
    const [isPushing, setIsPushing] = useState(false);
    const [pushCounter, setPushCounter] = useState({ done: 0, total: 0 });
    const [pushSuccessMessage, setPushSuccessMessage] = useState("");

    const template = payrollTemplate[templateKey];
    const headers = template.headers;

    const payrollSettings = {
        categories: JSON.parse(localStorage.getItem('selectedCategories') || '{}'),
        definitions: JSON.parse(localStorage.getItem('selectedItems') || '{}'),
    };

    const companyPrefixMap = {
        KN: 'KENTALYASEASONA',
        TA: 'ARABLE-TEMP',
        PA: 'ARABLE-PERM',
        SA: 'ARABLE-SHORT',
        PF: 'FLORI-PERM',
        TR: 'FLORI-TEMP',
    };

    const parseHours = (val) => parseFloat(String(val || '0').replace(':', '.'));

    function transformToSageRow(row) {
        const transformedRows = [];
        const { definitions } = payrollSettings;
        const employeeId = row['Employee ID'] || row['Staff No.'] || row['User ID'] || '';
        const prefix = employeeId.substring(0, 2);
        const companyRule = companyPrefixMap[prefix] || 'KENTALYAPERMANE';

        const workDayOT = parseHours(row['WORKDAY Overtime']);
        const holidayOT = parseHours(row['HOLIDAY Overtime']);
        const restDayOT = parseHours(row['RESTDAY Overtime']);
        const totalAbsent = parseHours(row['Total Absent']);
        const workDayPresent = parseHours(row['WORKDAY Present']);
        const overtime1 = parseHours(row['Overtime Hrs @ 1.5']);
        const overtime2 = parseHours(row['Overtime Hrs @ 2.0']);
        const lostHours = parseHours(row['Lost  Hrs']);

        const addRow = (code, units, lineType = 'EA') => {
            if (units <= 0) return;
            transformedRows.push({
                'Employee Code': employeeId,
                'Employee Display Name': `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim(),
                'Company Rule': companyRule,
                'Pay Run Definition': 'MAIN',
                'Line Type': lineType,
                'Payroll Definition Code': code,
                'Units': units,
                'Date Worked': row['Date Worked'] || '',
            });
        };

        if (definitions?.EA?.OVERTIME_15) addRow('OVERTIME1', workDayOT + overtime1);
        if (definitions?.EA?.OVERTIME_20) addRow('OVERTIME2', holidayOT + restDayOT + overtime2);
        if (definitions?.EA?.BASIC) addRow('BASIC', workDayPresent);
        if (definitions?.DD?.ABSENTEEISM) addRow('ABSENTEEISM', totalAbsent, 'DD');
        if (definitions?.EA?.LOST_HOURS) addRow('LOSTHOURS', -lostHours);

        return transformedRows;
    }

    const handleExportExcel = () => {
        const transformedData = excelData.flatMap(transformToSageRow);
        const worksheet = XLSX.utils.json_to_sheet(transformedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, template.name || 'payrollExport');
        XLSX.writeFile(
            workbook,
            `${template.name?.toLowerCase().replace(/\s+/g, '_') || 'export'}.xlsx`
        );
    };

    const addServerMessage = (text) => {
        const id = Date.now() + Math.random();
        setServerMessages(prev => [...prev, { id, text }]);
    };

    const handlePushToSage = async () => {
        if (!excelData || excelData.length === 0) return;
        setPushSuccessMessage(""); // reset previous success message
        const transformedData = excelData.flatMap(transformToSageRow);
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        setIsPushing(true);
        setServerMessages([]);
        const uniqueEmployees = [...new Set(transformedData.map(r => r['Employee Code']))];
        setPushCounter({ done: 0, total: uniqueEmployees.length });

        // Step 1: Fetch token
        try {
            addServerMessage("🔄 Fetching token...");
            const tokenResponse = await getToken();
            if (!tokenResponse) throw new Error("Token fetch failed or missing access_token");
            addServerMessage("✅ Token fetched successfully");
        } catch (error) {
            addServerMessage(`❌ Token fetch error: ${error.message}`);
            setIsPushing(false);
            return;
        }

        // Step 2: Push employees one by one
        for (let i = 0; i < uniqueEmployees.length; i++) {
            const empCode = uniqueEmployees[i];
            const empRows = transformedData.filter(r => r['Employee Code'] === empCode);
            const payload = {
                unitLineBatchHeaderTemplateID: 2,
                code: "PAYROLL_BATCH",
                shortDescription: "Attendance Units",
                longDescription: "Attendance Units",
                employeeList: [{
                    employeeCode: empCode,
                    fieldList: empRows.map(r => ({
                        companyruleCode: r['Company Rule'],
                        payRunDefCode: r['Pay Run Definition'],
                        LineType: r['Line Type'],
                        payrollDefCode: r['Payroll Definition Code'],
                        dateWorked: formattedDate,
                        Units: r['Units'],
                        inputAmount: "",
                        chargeoutrate: "",
                        jobcostcode: "",
                        note: "N/A",
                        employeerate: ""
                    }))
                }]
            };

            try {
                const response = await fetch("http://localhost:4000/sage/push", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error(`Server error: ${response.status}`);
                await response.json();
                setPushCounter({ done: i + 1, total: uniqueEmployees.length });
                addServerMessage(`🔄 Pushed ${i + 1}/${uniqueEmployees.length}: ${empCode}`);
            } catch (error) {
                setPushCounter({ done: i + 1, total: uniqueEmployees.length });
                addServerMessage(`❌ Push failed ${empCode}: ${error.message}`);
            }
        }

        // Step 3: Final success message
        setPushSuccessMessage(`✅ All data pushed successfully to Sage`);
        addServerMessage(`✅ All ${uniqueEmployees.length}/${uniqueEmployees.length} records pushed successfully`);
        setIsPushing(false);
    };

    const transformedRows = excelData.flatMap(transformToSageRow);

    return (
        <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <button className="import-button" onClick={handleExportExcel}>Export Excel</button>
                <button className="import-button" onClick={handlePushToSage}>Push to Sage</button>
                {pushSuccessMessage && <span style={{ marginLeft: '10px', color: '#2ecc71', fontWeight: 'bold' }}>{pushSuccessMessage}</span>}
            </div>

            <div className="table-scroll-wrapper">
                <table>
                    <thead>
                    <tr>{headers.map((header, idx) => <th key={idx}>{header}</th>)}</tr>
                    </thead>
                    <tbody>
                    {transformedRows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {headers.map((header, colIndex) => (
                                <td key={colIndex}>{row[header] ?? 'N/A'}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isPushing && (
                <>
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 9998
                    }}></div>

                    <div style={{
                        position: 'fixed',
                        top: '20%',
                        right: '50%',
                        transform: 'translateX(50%)',
                        width: '350px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        borderRadius: '8px',
                        padding: '10px',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="loader"></div>
                            <strong>Pushed {pushCounter.done}/{pushCounter.total}</strong>
                        </div>
                        {serverMessages.map(msg => {
                            let color = 'black';
                            if (msg.text.startsWith('🔄')) color = '#3498db';
                            else if (msg.text.startsWith('✅')) color = '#2ecc71';
                            else if (msg.text.startsWith('❌')) color = '#e74c3c';
                            return <div key={msg.id} style={{ color }}>{msg.text}</div>;
                        })}
                    </div>
                </>
            )}

            <style>{`
                .loader {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .table-scroll-wrapper {
                    max-height: 400px;
                    overflow-y: auto;
                }
            `}</style>
        </>
    );
}

export default SageTemplateTab;
