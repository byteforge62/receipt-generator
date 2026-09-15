import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import vsaLogo from "../assets/vsa-logo.png";
import academy2Logo from "../assets/dbfa-logo.png";
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
      size: tabloid portrait;
      margin: 10mm;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .print-container {
        width: 100%;
        max-width: 100%;
        box-shadow: none;
        margin: 0;
        padding: 10mm;
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
        className="print-container bg-white text-black rounded-xl shadow-xl p-2 md:p-8 mt-6 max-w-4xl mx-auto"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b pb-4 gap-4">
          <div className="flex items-center gap-4">
            <img
              src={selectedAcademy.logo}
              alt="logo"
              className="w-22 md:w-24"
            />
            <h1 className="text-xl md:text-2xl font-bold">
              {selectedAcademy.name}
            </h1>
          </div>

          <div className="text-base text-gray-700 text-right">
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
        <div className="mt-4 text-base">
          <p className="font-bold">
            Billed To:
            <span className="text-gray-700 font-medium"> {data.billedTo}</span>
          </p>

          <p className="font-bold mt-1">
            Address:
            <span className="text-gray-700 font-medium"> {data.address}</span>
          </p>
          <p className="font-bold mt-1">
            Branch:
            <span className="text-gray-700 font-medium"> {data.branch}</span>
          </p>
        </div>

        {/* TABLE */}
        <div className="mt-6">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr className="text-base">
                <th className="p-2 text-left">Month</th>
                <th className="p-2 text-left">Registration Fees</th>
                <th className="p-2 text-left">Regular Fees</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t text-base">
                <td className="p-2">{data.month}</td>
                <td className="p-2">{data.registrationFees}</td>
                <td className="p-2">{data.regularFees}</td>
                <td className="p-2 text-right font-semibold">{data.total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between mt-6 gap-6">
          <div className="space-y-1 text-base">
            <p>
              <b>Payment Method:</b> {data.paymentMethod}
            </p>

            <p>
              <b>Transaction ID:</b> {data.transactionId}
            </p>

            <p>
              <b>Student Name:</b> {data.studentName}
            </p>

            {/* NEW PAYMENT STATUS */}
            <p>
              <b>Status:</b>{" "}
              {data.paymentStatus === "pending" ? (
                <span className="text-red-600 font-semibold">Pending</span>
              ) : (
                <span className="text-green-600 font-semibold">Completed</span>
              )}
            </p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 w-full md:w-72">
            <div className="flex justify-between text-base mb-1">
              <span>Sub Total</span>
              <span>{data.subTotal}</span>
            </div>

            <div className="flex justify-between text-base mb-1">
              <span>Discount</span>
              <span>{data.discount}</span>
            </div>

            <div className="flex justify-between text-base font-bold border-t pt-1">
              <span>Total</span>
              <span>{data.finalTotal}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 border-t pt-4 text-base text-gray-600">
          <h4>{selectedAcademy.name}</h4>
          <h4>
            Fees once paid are non-refundable. Please keep this receipt for
            future reference.
          </h4>
          <h4>Instagram: {selectedAcademy.instagram}</h4>
          <p>This is a computer-generated receipt.</p>

          <div className="text-right mt-6">
            <img src={signature} alt="signature" className="w-44 ml-auto" />
            <p className="font-semibold mt-1">{selectedAcademy.manager}</p>
            <p>Manager</p>
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
