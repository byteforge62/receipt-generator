import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import vsaLogo from "../assets/vsa-logo.png";
import academy2Logo from "../assets/dbsc-logo.png";
import signature from "../assets/signature.png";

export default function Receipt({ data }) {
  const receiptRef = useRef(null);

  const academyConfig = {
    vsa: {
      name: "Vadodara Sports Academia",
      instagram: "@vadodarasportsacademia",
      manager: "Anoop Sunil",
      logo: vsaLogo,
    },
    dbfa: {
      name: "Dwivedi Brother Football Academy",
      instagram: "@dwivedibrothers.sc",
      manager: "Anoop Sunil",
      logo: academy2Logo,
    },
  };

  const selectedAcademy = academyConfig[data?.academy] || academyConfig["vsa"];

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `receipt-${data?.receiptNo || "file"}`,

    pageStyle: `
    @page {
      size: A4 portrait;
      margin: 8mm;
    }

    @media print {
      html, body {
        height: 100%;
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .print-container {
        width: 100% !important;
        max-width: 100% !important;
        box-shadow: none !important;
        margin: 0 !important;
        padding: 4mm 6mm !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      .no-print {
        display: none !important;
      }
    }
  `,
  });

  return (
    <>
      <div
        ref={receiptRef}
        className="print-container bg-white text-black rounded-xl shadow-xl p-4 sm:p-6 md:p-8 mt-4 max-w-4xl mx-auto"
      >
        {/* HEADER */}
        <div className="flex flex-row items-center justify-between border-b pb-3 gap-2">
          <div className="flex items-center gap-3">
            <img
              src={selectedAcademy.logo}
              alt="logo"
              className="w-16 sm:w-20 md:w-24 object-contain"
            />
            <h1 className="text-base sm:text-xl md:text-2xl font-bold leading-tight">
              {selectedAcademy.name}
            </h1>
          </div>

          <div className="text-xs sm:text-sm md:text-base text-gray-700 text-right whitespace-nowrap">
            <p>
              <b>Receipt No:</b> {data.receiptNo}
            </p>
            <p>
              <b>Arrive:</b> {data.arrive}
            </p>
            <p>
              <b>Depart:</b> {data.depart}
            </p>
          </div>
        </div>

        {/* BILLING */}
        <div className="mt-3 text-xs sm:text-base">
          <p className="font-bold">
            Billed To:
            <span className="text-gray-700 font-medium"> {data.billedTo}</span>
          </p>

          <p className="font-bold mt-0.5">
            Address:
            <span className="text-gray-700 font-medium"> {data.address}</span>
          </p>
          <p className="font-bold mt-0.5">
            Branch:
            <span className="text-gray-700 font-medium"> {data.branch}</span>
          </p>
        </div>

        {/* TABLE */}
        <div className="mt-4">
          <table className="w-full text-xs sm:text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr className="text-xs sm:text-base">
                <th className="p-2 text-left">Month</th>
                <th className="p-2 text-left">Registration Fees</th>
                <th className="p-2 text-left">Regular Fees</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t text-xs sm:text-base">
                <td className="p-2">{data.month}</td>
                <td className="p-2">{data.registrationFees}</td>
                <td className="p-2">{data.regularFees}</td>
                <td className="p-2 text-right font-semibold">{data.total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-row justify-between items-start mt-4 gap-4">
          <div className="space-y-1 text-xs sm:text-sm md:text-base">
            <p>
              <b>Payment Method:</b> {data.paymentMethod}
            </p>

            <p>
              <b>Transaction ID:</b> {data.transactionId}
            </p>

            <p>
              <b>Student Name:</b> {data.studentName}
            </p>

            {/* PAYMENT STATUS */}
            <p>
              <b>Status:</b>{" "}
              {data.paymentStatus === "pending" ? (
                <span className="text-red-600 font-semibold">Pending</span>
              ) : (
                <span className="text-green-600 font-semibold">Completed</span>
              )}
            </p>

            {data.statusNote && (
              <p>
                <b>Note:</b> <span className="text-gray-700">{data.statusNote}</span>
              </p>
            )}
          </div>

          <div className="bg-gray-100 rounded-lg p-3 sm:p-4 w-44 sm:w-64 md:w-72 shrink-0">
            <div className="flex justify-between text-xs sm:text-base mb-1">
              <span>Sub Total</span>
              <span>{data.subTotal}</span>
            </div>

            <div className="flex justify-between text-xs sm:text-base mb-1">
              <span>Discount</span>
              <span>{data.discount}</span>
            </div>

            <div className="flex justify-between text-xs sm:text-base font-bold border-t pt-1">
              <span>Total</span>
              <span>{data.finalTotal}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-4 sm:mt-6 border-t pt-3 text-xs sm:text-sm md:text-base text-gray-600">
          <div className="flex flex-row justify-between items-end gap-2">
            <div className="space-y-0.5 max-w-[65%]">
              <h4 className="font-semibold text-gray-800">{selectedAcademy.name}</h4>
              <p>
                Fees once paid are non-refundable. Please keep this receipt for
                future reference.
              </p>
              <p>Instagram: {selectedAcademy.instagram}</p>
              <p className="text-gray-400 text-xs">This is a computer-generated receipt.</p>
            </div>

            <div className="text-right shrink-0">
              <img src={signature} alt="signature" className="w-24 sm:w-36 md:w-44 ml-auto" />
              <p className="font-semibold mt-1">{selectedAcademy.manager}</p>
              <p className="text-xs sm:text-sm">Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* PDF BUTTON */}
      <div className="flex justify-end mt-6 no-print">
        <button
          onClick={handlePrint}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
        >
          Download PDF
        </button>
      </div>
    </>
  );
}
