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
    
  }>({
    name: "",
    pno: "",
    contact: "",
    role: undefined,
    rank: undefined,
    area: undefined,
    circleOffice: undefined,
    policeStation: undefined,
 
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
      
      });
    }
  }, [user]);

  // Only these ranks need full hierarchy (area, circle, police station)
  const needsHierarchy =
    form.role === "POLICE" &&
    ["CONSTABLE", "HEADCONSTABLE", "INSPECTOR", "SHO/SO", "SI"].includes(
      form.rank as PoliceRank
    );

  // Only SP rank should show Area (SP-CITY/SP-RURAL)
  const showAreaForSP = form.role === "POLICE" && form.rank === "SP";

  const submit = () => {
    if (!form.role) return;

    const payload = {
      name: form.name,
      pno: form.pno,
      contact: form.contact,
      role: form.role,
      rank: form.role === "POLICE" ? form.rank : undefined,
      area: form.area,
      circleOffice: form.circleOffice,
      policeStation: form.policeStation,

    };

    if (user) {
      updateUser(user.id, payload);
    } else {
      addUser(payload as any);
    }

    onClose();
  };

  const isDisabled =
    !form.name ||
    !form.pno ||
    !form.role ||
   
    (form.role === "POLICE" &&
      (!form.rank ||
        (needsHierarchy &&
          (!form.area || !form.circleOffice || !form.policeStation))));

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
            placeholder="Enter PNO (e.g., PNO045) Number only"
          />
          <InputField
            label="Contact"
            required
            value={form.contact}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 9);
              setForm({ ...form, contact: value });
            }}
            placeholder="Enter contact number"
            maxLength={9}
            inputMode="numeric"
            pattern="\d*"
          />
          <Select
            label="User Role"
            required
            value={form.role ?? ""}
            onChange={e =>
              setForm({
                ...form,
                role: e.target.value as UserRole,
                rank: undefined,
                area: undefined,
                circleOffice: undefined,
                policeStation: undefined,
              })
            }
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
          {(showAreaForSP || needsHierarchy) && (
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
            </Select>
          )}
          {needsHierarchy && form.area && (
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
          {needsHierarchy && form.area && form.circleOffice && (
            <Select
              label="Police Station"
              required
              value={form.policeStation ?? ""}
              onChange={e =>
                setForm({ ...form, policeStation: e.target.value })
              }
            >
              <option value="" disabled>Select Police Station</option>
              {(
                POLICE_HIERARCHY[form.area] &&
                Object.prototype.hasOwnProperty.call(POLICE_HIERARCHY[form.area], form.circleOffice!) &&
                Array.isArray((POLICE_HIERARCHY[form.area] as Record<string, string[]>)[form.circleOffice!])
              )
                ? (POLICE_HIERARCHY[form.area] as Record<string, string[]>)[form.circleOffice!].map((ps: string) => (
                    <option key={ps} value={ps}>{ps}</option>
                  ))
                : null}
            </Select>
          )}
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
