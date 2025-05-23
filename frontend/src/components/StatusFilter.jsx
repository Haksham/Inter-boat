function StatusFilter({ filter, setFilter, className = "" }) {
  const statuses = [
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "pending", label: "Pending" },
    { value: "all", label: "All" },
  ];

  return (
    <div className={className}>
      {/* Mobile Dropdown */}
      <div className="block sm:hidden">
        <select
          className="px-3 py-1 rounded border"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          {statuses.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      {/* Desktop Buttons */}
      <div className="hidden sm:flex space-x-2">
        {statuses.map(s => (
          <button
            key={s.value}
            className={`px-3 py-1 rounded ${filter === s.value ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setFilter(s.value)}
            type="button"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StatusFilter;