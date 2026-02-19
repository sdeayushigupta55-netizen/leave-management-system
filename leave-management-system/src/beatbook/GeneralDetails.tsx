import React, { useState, useEffect } from "react";
import { useBeatBook } from "../context/BeatBookContext";
import InputField from "../ui/Input";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import Button from "../ui/Button";
import { FileText } from "lucide-react";
import type { BeatBook } from "../type/beatbook";

const initialData = {
  name: "",
  rank: "",
  rankNo: "",
  mobileNo: "",
  policeStation: "",
  coCircle: "",
  beatNo: "",
  villages: "",
  villageLatLong: "",
  beatIncharge: "",
  beatInchargeMobile: "",
  alternateBeatConstableName: "",
  alternateBeatConstableMobile: "",
};

const GeneralDetails: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState<BeatBook>(initialData);
  const [beatBookId, setBeatBookId] = useState<string | null>(null);
  const { beatBooks, addBeatBook, updateBeatBook, loading } = useBeatBook();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    setIsDisabled(false);
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = ["beatNo"];
    for (const field of requiredFields) {
      if (!form[field as keyof typeof form]) {
        setError("Please fill all required fields.");
        setSuccess("");
        return;
      }
    }
    try {
      let result;
      if (beatBookId) {
        result = await updateBeatBook(beatBookId, form);
        setSuccess("Details updated successfully!");
      } else {
        result = await addBeatBook(form);
        setSuccess("Details submitted successfully!");
        if (result && result._id) setBeatBookId(result._id);
      }
      setError("");
      setIsDisabled(true);
    } catch (err) {
      setError("Failed to submit form");
      setSuccess("");
    }
  };

  // Prefill form with user's info
  useEffect(() => {
    if (!user) return;
     if (beatBookId) return; 
    setForm((prev) => ({
      ...prev,
      name: user.name || "",
      rank: user.rank || "",
      rankNo: user.pno || "",
      mobileNo: user.contact || "",
      policeStation: user.policeStation || "",
      coCircle: user.circleOffice || "",
    }));
    setIsDisabled(false);
    setBeatBookId(null);
  }, [user]);

  // Prefill form with user's BeatBook if exists
  useEffect(() => {
    if (!user) return;
    if (!beatBooks || beatBooks.length === 0) return;

    // Find by userId (as string)
let userBeatBook = beatBooks.find((b) => String(b.userId) === String(user._id));

    // If not found, try legacy match
    if (!userBeatBook) {
      userBeatBook = beatBooks.find(
        (b) => b.name === user.name && b.rankNo === user.pno
      );
    }

    if (userBeatBook) {
      setForm((prev) => ({ ...prev, ...userBeatBook }));
      setIsDisabled(true);
      setBeatBookId(userBeatBook._id ?? null);
    } else {
      setBeatBookId(null);
    }
  }, [beatBooks, user]);

  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#e8eaf6] rounded-xl">
            <FileText className="text-[#1a237e]" size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a237e]">General Details</h1>
            <p className="text-sm text-gray-500">Fill out the beat book general details below</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {success && <div className="text-green-600 mb-2">{success}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Name" name="name" value={form.name} onChange={handleChange} className="w-full" disabled={true} />
            <InputField label="Rank" name="rank" value={form.rank} onChange={handleChange} className="w-full" disabled={true} />
            <InputField label="Rank No" name="rankNo" value={form.rankNo} onChange={handleChange} className="w-full" disabled={true} />
            <InputField label="Mobile No" name="mobileNo" value={form.mobileNo} onChange={handleChange} className="w-full" disabled={true} />
            <InputField label="Police Station" name="policeStation" value={form.policeStation} onChange={handleChange} className="w-full" disabled={true} />
            <InputField label="CO Circle" name="coCircle" value={form.coCircle} onChange={handleChange} className="w-full" disabled={true} />
            <InputField label="Beat No" name="beatNo" value={form.beatNo} onChange={handleChange} className="w-full" disabled={isDisabled} />
            <InputField label="Village / Halka" name="villages" value={form.villages} onChange={handleChange} className="w-full" disabled={isDisabled} />
            <InputField label="Village Latitude, Longitude" name="villageLatLong" value={form.villageLatLong} onChange={handleChange} className="w-full" placeholder="e.g. tundla: 27.2,78.3" disabled={isDisabled} />
            <InputField label="Beat Incharge" name="beatIncharge" value={form.beatIncharge} onChange={handleChange} className="w-full" disabled={isDisabled} />
            <InputField label="Beat Incharge Mobile" name="beatInchargeMobile" value={form.beatInchargeMobile} onChange={handleChange} className="w-full" disabled={isDisabled} />
            <InputField label="Alternate Beat Constable/HC Name " name="alternateBeatConstableName" value={form.alternateBeatConstableName} onChange={handleChange} className="w-full" disabled={isDisabled} />
            <InputField label="Alternate Beat Constable/HC Mobile" name="alternateBeatConstableMobile" value={form.alternateBeatConstableMobile} onChange={handleChange} className="w-full" disabled={isDisabled} />
          </div>
          <div className="mt-6 justify-end flex gap-2">
            <Button type="submit" variant="primary" disabled={loading || isDisabled}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
            {isDisabled && (
              <Button type="button" variant="gold" onClick={handleEdit}>
                Edit
              </Button>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
export default GeneralDetails;