import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ReceiptForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    academy: "vsa",
    branch: "", // NEW
    receiptNo: "",
    billedTo: "",
    address: "",
    arrive: "",
    depart: "",
    month: "",
    registrationFees: "",
    regularFees: "",
    total: "",
    paymentMethod: "",
    transactionId: "",
    studentName: "",
    subTotal: "",
    discount: "",
    finalTotal: "",
    paymentStatus: "completed",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "academy") {
      setForm({
        ...form,
        academy: value,
        branch: "", // reset branch when academy changes
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // AUTO CALCULATIONS
  useEffect(() => {
    const reg = Number(form.registrationFees) || 0;
    const regu = Number(form.regularFees) || 0;
    const discount = Number(form.discount) || 0;

    const total = reg + regu;
    const finalTotal = total - discount;

    let monthText = "";
    if (form.arrive && form.depart) {
      const start = new Date(form.arrive);
      const end = new Date(form.depart);

      const options = { day: "2-digit", month: "long", year: "numeric" };

      monthText =
        start.toLocaleDateString("en-GB", options).toUpperCase() +
        " - " +
        end.toLocaleDateString("en-GB", options).toUpperCase();
    }

    setForm((prev) => ({
      ...prev,
      month: monthText,
      total,
      subTotal: total,
      finalTotal,
    }));
  }, [
    form.registrationFees,
    form.regularFees,
    form.discount,
    form.arrive,
    form.depart,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/receipt", { state: form });
  };
  const branchesByAcademy = {
    vsa: [
      "VSA TARSAALI",
      "VSA NIZAMPURA",
      "VSA BHAYLI",
      "VSA NYSA",
      "VSA RANG ANGEL",
      "VSA CHAMP KID",
      "VSA ATLADARA",
    ],
    dbfa: ["DBSC APS TARSAALI", "DBSC RANG ANGEL ATLADRA",  "DBSC FC"],
  };
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Generate Receipt</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {/* Academy */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Select Academy
          </label>
          <select
            name="academy"
            value={form.academy}
            onChange={handleChange}
            className="input"
          >
            <option value="vsa">Vadodara Sports Academia</option>
            <option value="dbfa">Dwivedi Brother Football Academy</option>
          </select>
        </div>
        {/* Branch */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Select Branch
          </label>

          <select
            name="branch"
            value={form.branch}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Branch</option>

            {branchesByAcademy[form.academy]?.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        {/* Receipt No */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Receipt Number
          </label>
          <input
            name="receiptNo"
            value={form.receiptNo}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Billed To */}
        <div>
          <label className="block text-sm font-medium mb-1">Billed To</label>
          <input
            name="billedTo"
            value={form.billedTo}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Dates */}
        <div>
          <label className="block text-sm font-medium mb-1">Arrive Date</label>
          <input
            type="date"
            name="arrive"
            value={form.arrive}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Depart Date</label>
          <input
            type="date"
            name="depart"
            value={form.depart}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Month */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Month Period</label>
          <input value={form.month} readOnly className="input bg-gray-100" />
        </div>

        {/* Fees */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Registration Fees
          </label>
          <input
            type="number"
            name="registrationFees"
            value={form.registrationFees}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Regular Fees</label>
          <input
            type="number"
            name="regularFees"
            value={form.regularFees}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Totals */}
        <div>
          <label className="block text-sm font-medium mb-1">Total</label>
          <input value={form.total} readOnly className="input bg-gray-100" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Discount</label>
          <input
            type="number"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sub Total</label>
          <input value={form.subTotal} readOnly className="input bg-gray-100" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Final Total</label>
          <input
            value={form.finalTotal}
            readOnly
            className="input bg-gray-100"
          />
        </div>

        {/* NEW PAYMENT STATUS */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Status
          </label>
          <select
            name="paymentStatus"
            value={form.paymentStatus}
            onChange={handleChange}
            className="input"
          >
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Payment Details */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Method
          </label>
          <input
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Transaction ID
          </label>
          <input
            name="transactionId"
            value={form.transactionId}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Student Name</label>
          <input
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            className="input"
          />
        </div>

        <button
          type="submit"
          className="sm:col-span-2 mt-4 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
        >
          Generate Receipt
        </button>
      </form>
    </div>
  );
}
