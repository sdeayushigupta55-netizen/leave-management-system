import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useBeatBook } from "../context/BeatBookContext";
import { FaUserShield } from "react-icons/fa";

import PopulationDetailsPage from "../pages/beatbook/PopulationDetailsPage";

export function BeatBook() {
  const { user } = useAuth();
  const { beatBooks } = useBeatBook();

const userBeatBook = beatBooks.find(b => String(b.userId) === String(user?._id));
  return (
    
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Beat Book</h1>
        {/* General Details Card */}
        {beatBooks && user && (
       
          <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
            <div className="flex items-center mb-2">
              <FaUserShield className="text-blue-700 mr-2" />
              <span className="font-semibold text-lg">General Details</span>
            </div>
            <div className="text-sm text-gray-700">
             
              <div><b>Police Station:</b> {user.policeStation || "N/A"}</div>
             
              <div><b>Circle Office:</b> {user.circleOffice || "N/A"}</div>
<div><b>Beat No:</b> {userBeatBook?.beatNo || "N/A"}</div>
               <div><b>Beat Incharge Name:</b> {userBeatBook?.beatIncharge || "N/A"}</div>
          
             
              <div><b>Contact:</b> {userBeatBook?.beatInchargeMobile || "N/A"}</div>
                  <div><b>Villages:</b> {userBeatBook?.villages || "N/A"}</div>
                  <div><b>Village LatLong:</b> {userBeatBook?.villageLatLong || "N/A"}</div>
                
              {/* Add more fields as needed */}
            </div>
          </div>
        )}

        {/* Population Details Table and Modal */}
    <PopulationDetailsPage showAddButton={false} />
      </div>
    </DashboardLayout>
  );
}

export default BeatBook;