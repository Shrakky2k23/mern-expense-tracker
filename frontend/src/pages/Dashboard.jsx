import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [txns, setTxns] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", type: "expense" });
  const [loading, setLoading] = useState(false);

  // ✅ Added currency state
  const [currency, setCurrency] = useState("₹");

  const load = async () => {
    const { data } = await api.get("/transactions/all");
    setTxns(data);
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    setLoading(true);
    try {
      await api.post("/transactions/add", form);
      setForm({ title: "", amount: "", type: "expense" });
      await load();
    } finally { setLoading(false); }
  };

  const remove = async (id) => {
    await api.delete(`/transactions/delete/${id}`);
    setTxns((t) => t.filter((x) => x._id !== id));
  };

  const { income, expense, balance } = useMemo(() => {
    const income = txns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = txns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [txns]);

  const chartData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];
  const COLORS = ["var(--income)", "var(--expense)"];

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h2>Expense Tracker</h2>
          <p className="muted small">Hi, {user?.name}</p>
        </div>
        <div className="topbar-actions">
          <ThemeSwitcher />

          {/* ✅ Currency Dropdown Added */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="btn"
          >
            <option value="₹">INR (₹)</option>
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
          </select>

          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="grid grid-3">
        <div className="card stat">
          <p className="muted">Balance</p>
          <h2 className={balance >= 0 ? "pos" : "neg"}>
            {currency}{balance.toFixed(2)}
          </h2>
        </div>
        <div className="card stat">
          <p className="muted">Income</p>
          <h2 className="pos">
            {currency}{income.toFixed(2)}
          </h2>
        </div>
        <div className="card stat">
          <p className="muted">Expense</p>
          <h2 className="neg">
            {currency}{expense.toFixed(2)}
          </h2>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="card">
          <h3>Add transaction</h3>
          <form onSubmit={add} className="form">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Income vs Expense</h3>
          {income === 0 && expense === 0 ? (
            <p className="muted">No data yet</p>
          ) : (
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      <section className="card">
        <h3>Transactions</h3>
        {txns.length === 0 ? (
          <p className="muted">No transactions yet.</p>
        ) : (
          <ul className="txn-list">
            {txns.map((t) => (
              <li key={t._id} className={`txn ${t.type}`}>
                <div>
                  <strong>{t.title}</strong>
                  <span className="muted small"> · {new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="txn-right">
                  <span className={t.type === "income" ? "pos" : "neg"}>
                    {t.type === "income" ? "+" : "-"}
                    {currency}{t.amount.toFixed(2)}
                  </span>
                  <button className="btn-icon" onClick={() => remove(t._id)} aria-label="Delete">✕</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}