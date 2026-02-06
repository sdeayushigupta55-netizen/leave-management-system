import { useEffect, useState } from "react";
import { POLICE_RANKS, USER_ROLES } from "../../constants/roles";
import type { PoliceRank, User, UserRole } from "../../type/user";
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
        contact: any;
        name: string;
        uno: string;
        role?: UserRole;
        rank?: PoliceRank;
        policeStation: string;
        password: string;
    }>({
        name: "",
        uno: "",
        role: undefined,
        rank: undefined,
        policeStation: "",
        password: "",
        contact: "",
    });

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name,
                uno: user.uno,
                contact: user.contact,
                role: user.role,
                rank: user.rank,
                policeStation: user.policeStation ?? "",
                password: "", // Don't prefill password for security
            });
        }
    }, [user]);

    const submit = () => {
        if (!form.role) return;
        if (form.role === "POLICE" && !form.rank) return;

        if (user) {
            // For update, you may need to handle types similarly if updateUser is typed strictly
            const userData = {
                name: form.name,
                uno: form.uno,
                role: form.role,
                rank: form.role === "POLICE" ? form.rank : undefined,
                policeStation: form.policeStation,
                password: form.password,
                contact: form.contact,
            };
            updateUser(user.id, userData);
        } else {
            if (form.role === "POLICE") {
                addUser({
                    name: form.name,
                    uno: form.uno,
                    contact: form.contact,
                    role: "POLICE",
                    rank: form.rank!,
                    policeStation: form.policeStation,
                    password: form.password,
                });
            } else if (form.role === "ADMIN") {
                addUser({
                    name: form.name,
                    uno: form.uno,
                    contact: form.contact,
                    role: "ADMIN",
                    policeStation: form.policeStation,
                    password: form.password,
                });
            }
        }

        onClose();
    };

    const isDisabled =
        !form.name ||
        !form.uno ||
        !form.role ||
        !form.policeStation ||
        (!user && !form.password) ||
        (form.role === "POLICE" && !form.rank);

    const handleInputChange =
        (key: keyof typeof form) =>
            (
                e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
            ) => {
                setForm(prev => ({ ...prev, [key]: e.target.value }));
            };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#1a237e] to-[#303f9f] px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-white">{user ? "Update User" : "Add New User"}</h2>
                        <p className="text-xs text-blue-100">
                            Police Leave Management System
                        </p>
                    </div>
                    <Button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={16} className="text-white" />
                    </Button>

                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                    <div>
                        <InputField
                            label="Full Name"
                            placeholder="Enter full name"
                            required
                            value={form.name}
                            onChange={handleInputChange("name")}

                        />
                    </div>

                    <div>

                        <InputField
                            label="UNO"
                            placeholder="Enter UNO"
                            onChange={handleInputChange("uno")}
                            required
                            value={form.uno}
                        />

                    </div>

                    <div>

                        <Select
                            id="role"
                            label="User Role"
                            required
                            value={form.role ?? ""}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    role: e.target.value as UserRole,
                                    rank: undefined,
                                })
                            }
                        >
                            <option value="" disabled>
                                Select role
                            </option>
                            {USER_ROLES.map(role => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </Select>

                    </div>

                    {form.role === "POLICE" && (
                        <Select
                            id="rank"
                            label="Police Rank"
                            required
                            value={form.rank ?? ""}
                            onChange={e =>
                                setForm({ ...form, rank: e.target.value as PoliceRank })
                            }
                        >
                            <option value="" disabled>
                                Select rank
                            </option>
                            {POLICE_RANKS.map(rank => (
                                <option key={rank} value={rank}>
                                    {rank}
                                </option>
                            ))}
                        </Select>
                    )}

                     <div>

                        <InputField
                            label="Enter Police Station"
                            placeholder="Ayodhya Police Station"
                            onChange={handleInputChange("policeStation")}
                            value={form.policeStation}
                        />
                    </div>

                    <div>

                        {!user && (
                            <InputField
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                onChange={handleInputChange("password")}
                                value={form.password}
                            />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <Button
                        onClick={onClose}
                        variant="danger"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={submit}
                        disabled={isDisabled}
                        variant="primary"
                    >
                        {user ? "Update User" : "Create User"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;
