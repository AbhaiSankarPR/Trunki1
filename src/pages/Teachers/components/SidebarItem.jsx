const SidebarItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors
      ${active ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-gray-100"}`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

export default SidebarItem;