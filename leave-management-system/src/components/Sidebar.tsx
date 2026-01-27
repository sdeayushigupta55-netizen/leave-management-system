
import { Link } from "react-router-dom";

const Sidebar = () => (
  <aside className="bg-secondary w-64 min-h-screen p-6 hidden md:block">
    <nav className="flex flex-col gap-4">
      <Link to="/dashboard" className="font-medium">Dashboard</Link>
      <Link to="/leave-requests" className="font-medium">Leave Requests</Link>
      <Link to="/profile" className="font-medium">Profile</Link>
    </nav>
  </aside>
);

export default Sidebar;