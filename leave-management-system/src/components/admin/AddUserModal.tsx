import { useEffect, useState } from "react";
import { POLICE_RANKS, USER_ROLES } from "../../constants/roles";
import type { PoliceRank, User, UserRole } from "../../type/user";
import { POLICE_HIERARCHY } from "../../type/user";
import { useUsers } from "../../context/UserContext";
import { InputField } from "../../ui/Input";
import Button from "../../ui/Button";
import Select from "../../ui/Select";
import { X } from "lucide-react";

type AddUserModalProps = {
  onClose: () => void;
  user?: User;
};

const AddUserModal = ({ onClose, user }: AddUserModalProps) => {
  const { addUser, updateUser } = useUsers();

  const [form, setForm] = useState<{
    name: string;
    pno: string;
    contact: string;
    role?: UserRole;
    rank?: PoliceRank;
    area?: "SP-CITY" | "SP-RURAL";
    circleOffice?: string;
    policeStation?: string;
    profilPic?: string;
    gender?: "Male" | "Female" | "OTHER";
    
  }>({
    name: "",
    pno: "",
    contact: "",
    role: undefined,
    rank: undefined,
    area: undefined,
    circleOffice: undefined,
    policeStation: undefined,
    profilPic: undefined,
    gender: undefined,
 
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        pno: user.pno,
        contact: user.contact,
        role: user.role,
        rank: user.rank,
        area: user.area,
        circleOffice: user.circleOffice,
        policeStation: user.policeStation,
        profilPic: user.profilPic,
        gender: user.gender,
      
      });
    }
  }, [user]);

  // Hierarchy logic by rank
  const showFullHierarchy =
    form.role === "POLICE" &&
    ["CONSTABLE", "HEADCONSTABLE", "INSPECTOR", "SHO/SO", "SI"].includes(form.rank as PoliceRank);

  const showCircleAndAreaOnly =
    form.role === "POLICE" && form.rank === "CO";

  const showAreaOnly =
    form.role === "POLICE" && form.rank === "SP";

  
  // SSP shows nothing extra
  

  useEffect(() => {
    if (
      user &&
      form.role === "POLICE" &&
      form.area &&
      form.circleOffice &&
      user.policeStation &&
      !form.policeStation
    ) {
      setForm(f => ({ ...f, policeStation: user.policeStation! }));
    }
  }, [form.role, form.area, form.circleOffice, user]);

const submit = () => {
  if (!form.role) return;

  const payload = {
   name: form.name,
    pno: form.pno,
    contact: form.contact,
    role: form.role,
    rank: form.role === "ADMIN" ? "SSP" : form.rank, // Always send a rank
    area: form.area,
    circleOffice: form.circleOffice,
    policeStation: form.policeStation,
    profilPic: form.profilPic,
    gender: form.gender,
  };

  if (user && user._id) {
    updateUser(user._id, payload); 
  } else {
    // Generate a unique id for new users
    const newUser = { ...payload, id: `user-${Date.now()}` };
    addUser(newUser as any);
  }

  onClose();
};

  const isDisabled =
    !form.name ||
    !form.pno ||
    !form.role ||
    (form.role === "POLICE" &&
      (
        !form.rank ||
        (showFullHierarchy && (!form.area || !form.circleOffice || !form.policeStation)) ||
        (showCircleAndAreaOnly && (!form.area || !form.circleOffice)) ||
        (showAreaOnly && !form.area)
      )
    );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a237e] to-[#303f9f] px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">
              {user ? "Update User" : "Add New User"}
            </h2>
            <p className="text-xs text-blue-100">
              Police Leave Management System
            </p>
          </div>
          <Button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg"
          >
            <X size={16} className="text-white" />
          </Button>
        </div>

        {/* Form */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Full Name"
            required
            value={form.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter full name"
          />

          <InputField
            label="PNO"
            required
            value={form.pno}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, pno: e.target.value })}
            placeholder="Enter PNO Number"
          />
          <InputField
            label="Contact"
            required
            value={form.contact}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              let value = e.target.value.replace(/\D/g, "");
              if (value.length > 10) value = value.slice(0, 10);
              setForm({ ...form, contact: value });
            }}
            placeholder="Enter 10-digit contact number"
            maxLength={10}
            inputMode="numeric"
            pattern="\d{10}"
          />
          <Select
          label="Gender"
            required
            value={form.gender ?? ""}
            onChange={e =>
              setForm({
                ...form,
                gender: e.target.value === "Male"
                  ? "Male"
                  : e.target.value === "Female"
                  ? "Female"
                  : e.target.value === "Other"
                  ? "OTHER"
                  : undefined,
              })
            }
          >
            <option value="" disabled>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
          <Select
            label="User Role"
            required
            value={form.role ?? ""}
            onChange={e => {
              const newRole = e.target.value as UserRole;
              setForm({
                ...form,
                role: newRole,
                rank: newRole === "ADMIN" ? "SSP" : undefined,
                area: undefined,
                circleOffice: undefined,
                policeStation: undefined,
              })
            }}
          >
            <option value="" disabled>Select Role</option>
            {USER_ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </Select>
          {form.role === "POLICE" && (
            <Select
              label="Police Rank"
              required
              value={form.rank ?? ""}
              onChange={e =>
                setForm({
                  ...form,
                  rank: e.target.value as PoliceRank,
                  area: undefined,
                  circleOffice: undefined,
                  policeStation: undefined,
                })
              }
            >
              <option value="" disabled>Select Rank</option>
              {POLICE_RANKS.map(rank => (
                <option key={rank} value={rank}>{rank}</option>
              ))}
            </Select>
          )}
          {(showFullHierarchy || showCircleAndAreaOnly || showAreaOnly) && (
            <Select
              label="Area"
              required
              value={form.area ?? ""}
              onChange={e =>
                setForm({
                  ...form,
                  area: e.target.value as "SP-CITY" | "SP-RURAL",
                  circleOffice: undefined,
                  policeStation: undefined,
                })
              }
            >
              <option value="" disabled>Select Area</option>
              <option value="SP-CITY">SP-CITY</option>
              <option value="SP-RURAL">SP-RURAL</option>
              {/* <option value="SSP OFFICE">SSP OFFICE</option>
              <option value="CAMP OFFICE">CAMP OFFICE</option>
              <option value="TRAFFIC OFFICE">TRAFFIC OFFICE</option> */}

            </Select>
          )}
          {/* Circle Office: show for full hierarchy and CO */}
          {(showFullHierarchy || showCircleAndAreaOnly) && form.area && (
            <Select
              label="Circle Office"
              required
              value={form.circleOffice ?? ""}
              onChange={e =>
                setForm({
                  ...form,
                  circleOffice: e.target.value,
                  policeStation: undefined,
                })
              }
            >
              <option value="" disabled>Select Circle</option>
              {Object.keys(POLICE_HIERARCHY[form.area]).map(circle => (
                <option key={circle} value={circle}>{circle}</option>
              ))}
            </Select>
          )}
          {/* Police Station: show for full hierarchy only */}
          {showFullHierarchy && form.area && form.circleOffice && (
            <Select
              label="Police Station"
              required
              value={form.policeStation ?? ""}
              onChange={e =>
                setForm({ ...form, policeStation: e.target.value })
              }
            >
              <option value="" disabled>Select Police Station</option>
              {(() => {
                const stations =
                  POLICE_HIERARCHY[form.area] &&
                  Object.prototype.hasOwnProperty.call(POLICE_HIERARCHY[form.area], form.circleOffice!) &&
                  Array.isArray((POLICE_HIERARCHY[form.area] as Record<string, string[]>)[form.circleOffice!])
                    ? (POLICE_HIERARCHY[form.area] as Record<string, string[]>)[form.circleOffice!]
                    : [];
                // If editing and the user's policeStation is not in the list, add it as a fallback option
                const showFallback =
                  form.policeStation && stations.indexOf(form.policeStation) === -1;
                return [
                  ...stations.map((ps: string) => (
                    <option key={ps} value={ps}>{ps}</option>
                  )),
                  showFallback ? (
                    <option key={form.policeStation} value={form.policeStation}>{form.policeStation}</option>
                  ) : null
                ];
              })()}
            </Select>
          )}
        
       
       
          {/* (removed needsHierarchy duplicate rendering) */}
        </div>
        <div className="px-6">
          <InputField
          label="Profile Picture"
         type="file"
         accept="image/*"
         className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
         onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
           const file = e.target.files && e.target.files[0];
           if (file) {
             const reader = new FileReader();
             reader.onloadend = () => {
               setForm(f => ({ ...f, profilPic: reader.result as string }));
             };
             reader.readAsDataURL(file);
           }
         }}
       />
        </div>
    
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <Button
            onClick={submit}
            variant="primary"
            disabled={isDisabled}
          >
            {user ? "Update User" : "Add User"}
          </Button>
        </div>
      </div>
    </div>
  );
}
export default AddUserModal;
