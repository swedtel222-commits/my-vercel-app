"use client";

import React, { useState, useRef } from "react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  amount: string;
  status: "Approved" | "Flagged (Duplicate)";
  dateUploaded: string;
  fileName: string;
}

export default function Home() {
  // Existing Database Log
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "1", invoiceNumber: "INV-1024", vendor: "Acme Corp", amount: "$1,250.00", status: "Approved", dateUploaded: "2026-06-20", fileName: "invoice_1024.pdf" },
    { id: "2", invoiceNumber: "INV-2048", vendor: "Globex Ltd", amount: "$3,400.00", status: "Approved", dateUploaded: "2026-06-22", fileName: "snap_shot_2048.jpg" },
  ]);

  // Team Management State
  const [members, setMembers] = useState<string[]>(["Alex Bajwa", "Sarah Connor"]);
  const [newMember, setNewMember] = useState("");
  
  // File Scanning States
  const [isScanning, setIsScanning] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Document Analysis Engine (Heuristically identifies potential invoice numbers)
  const analyzeDocument = (file: File) => {
    const fileNameClean = file.name.split('.').slice(0, -1).join('.');
    const numbersFound = fileNameClean.match(/\d+/g);
    
    let simulatedInvoiceNum = "";
    if (numbersFound) {
      simulatedInvoiceNum = `INV-${numbersFound.join("-")}`;
    } else {
      // Fallback if no numeric characters exist in filename string
      const characterStub = fileNameClean.replace(/[^a-zA-Z]/g, "").substring(0, 4).toUpperCase();
      simulatedInvoiceNum = `INV-${characterStub || "GEN"}-888`;
    }

    const randomVendors = ["Stark Industries", "Wayne Enterprises", "Cyberdyne Systems", "Tyrell Corp", "Nakatomi Trading"];
    const fallbackVendor = randomVendors[Math.floor(Math.random() * randomVendors.length)];
    const simulatedAmount = `$${(Math.random() * 4500 + 150).toFixed(2)}`;

    return {
      invoiceNumber: simulatedInvoiceNum,
      vendor: fallbackVendor,
      amount: simulatedAmount,
    };
  };

  // Document Processor
  const processUploadedFile = (file: File) => {
    setIsScanning(true);
    setCurrentFile(file.name);

    // Simulate standard NotebookLM-style OCR/AI processing window (2 seconds)
    setTimeout(() => {
      const results = analyzeDocument(file);

      // Core Fraud Constraint: Verify duplication threshold
      const isDuplicate = invoices.some(
        (existingInv) => existingInv.invoiceNumber.trim().toUpperCase() === results.invoiceNumber.trim().toUpperCase()
      );

      const auditedInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: results.invoiceNumber,
        vendor: results.vendor,
        amount: results.amount,
        status: isDuplicate ? "Flagged (Duplicate)" : "Approved",
        dateUploaded: new Date().toISOString().split("T")[0],
        fileName: file.name,
      };

      setInvoices((prev) => [auditedInvoice, ...prev]);
      setIsScanning(false);
      setCurrentFile(null);
    }, 2000);
  };

  // File Upload Event Interceptors
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  // Team Operations
  const handleAddMember = () => {
    if (newMember.trim() && !members.includes(newMember.trim())) {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    }
  };

  const handleRemoveMember = (targetName: string) => {
    setMembers(members.filter((m) => m !== targetName));
  };

  // CSV/Excel Generator Module
  const triggerSpreadsheetExport = () => {
    const sheetHeaders = ["Database ID,Invoice Identifier,Vendor Registry,Gross Value,Audit Status,Source File,Timestamp\n"];
    const sheetContent = invoices.map(
      (item) => `${item.id},${item.invoiceNumber},${item.vendor},${item.amount.replace(/[^0-9.-]+/g,"")},${item.status},${item.fileName},${item.dateUploaded}\n`
    );

    const blobData = new Blob([sheetHeaders.concat(sheetContent).join("")], { type: "text/csv;charset=utf-8;" });
    const localUri = URL.createObjectURL(blobData);
    
    const virtualLink = document.createElement("a");
    virtualLink.setAttribute("href", localUri);
    virtualLink.setAttribute("download", "invoice_counterfeit_catcher_report.csv");
    document.body.appendChild(virtualLink);
    virtualLink.click();
    document.body.removeChild(virtualLink);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Upper Navigation Block */}
      <header className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-wider text-emerald-400">
            INVOICE COUNTERFEIT CATCHER
          </h1>
          <p className="text-slate-400 text-xs mt-1">Cross-Reference & Duplicate Detection Hub</p>
        </div>
        <button
          onClick={triggerSpreadsheetExport}
          className="bg-emerald-600 hover:bg-emerald-500 text-slate-50 font-semibold py-2 px-5 rounded-lg transition duration-150 text-sm flex items-center gap-2 shadow-lg"
        >
          📊 Export Final Audit to Excel
        </button>
      </header>

      {/* Primary Container Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Operational Section */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Document Upload Interface Dropzone */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              📸 Document & Snap Uploader
            </h2>
            <p className="text-slate-400 text-xs mb-4">
              Drop an invoice image or document here. The system parses structural strings to identify duplicate records.
            </p>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isScanning && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition text-center ${
                isScanning ? "border-slate-800 bg-slate-950/40 cursor-not-allowed" :
                isDragging ? "border-emerald-400 bg-emerald-500/10" : "border-slate-700 hover:border-slate-500 bg-slate-950/20"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/*,.pdf,.txt,.doc,.docx"
                className="hidden"
                disabled={isScanning}
              />

              {isScanning ? (
                <div className="space-y-4">
                  {/* Processing Spinner */}
                  <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="space-y-1">
                    <p className="text-emerald-400 font-medium text-sm animate-pulse">Analyzing {currentFile}...</p>
                    <p className="text-xs text-slate-500">Checking document layout against database parameters</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-4xl text-slate-400">📤</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-300">
                      Drag & drop invoice images here, or <span className="text-emerald-400 underline">browse locally</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Accepts document snaps, invoices, receipts, and structural PDFs</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Audit Ledger Logs */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">🔍 Real-Time Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-xs">
                    <th className="py-3 px-2">Invoice Index</th>
                    <th className="py-3 px-2">Origin File</th>
                    <th className="py-3 px-2">Vendor</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {invoices.map((dataItem) => (
                    <tr key={dataItem.id} className="hover:bg-slate-800/20 transition duration-100">
                      <td className="py-3 px-2 font-mono font-bold text-slate-200">{dataItem.invoiceNumber}</td>
                      <td className="py-3 px-2 text-slate-400 text-xs max-w-[140px] truncate">{dataItem.fileName}</td>
                      <td className="py-3 px-2 text-slate-300">{dataItem.vendor}</td>
                      <td className="py-3 px-2 text-slate-300">{dataItem.amount}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                            dataItem.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                          }`}
                        >
                          {dataItem.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Operations Pane: Team Management */}
        <div className="space-y-8">
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              👥 Audit Stakeholders
            </h3>
            
            {/* Insertion Form Elements */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Name input..."
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-md p-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleAddMember}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium py-2 px-4 rounded-md text-sm transition"
              >
                Add
              </button>
            </div>

            {/* List Components */}
            <ul className="space-y-2">
              {members.map((person) => (
                <li
                  key={person}
                  className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm"
                >
                  <span className="text-slate-300 font-semibold">{person}</span>
                  <button
                    onClick={() => handleRemoveMember(person)}
                    className="text-rose-400 hover:text-rose-300 text-xs font-semibold px-2 py-1 rounded hover:bg-rose-500/20 transition duration-150"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

      </div>
    </main>
  );
}