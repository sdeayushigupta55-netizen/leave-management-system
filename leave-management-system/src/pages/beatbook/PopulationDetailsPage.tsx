import React, { useState } from "react";

import { FaFileAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import type { PopulationDetailsType } from "../../type/beatbook";
import { usePopulationDetails } from "../../context/PopulationDetailsContext";
import Button from "../../ui/Button";
import Table from "../../ui/Table";

type PopulationDetailsPageProps = {
  showAddButton?: boolean; // Add a prop to control the visibility of the Add button
};

// You must get beatId from context, props, or user selection
const defaultBeatId = ""; // Set this to a valid BeatBook ObjectId

const PopulationDetailsPage: React.FC<PopulationDetailsPageProps> = ({ showAddButton = true }) => {
	const { populationDetails, addPopulationDetails } = usePopulationDetails();
	const [selected, setSelected] = useState<string | null>(null);
	const [page, setPage] = useState<number>(1);
	const [pageSize] = useState<number>(10);
	const [showAddModal, setShowAddModal] = useState(false);
	const [error, setError] = useState<string>(""); // Add error state for form submission
	const [form, setForm] = useState<Partial<PopulationDetailsType>>({
		beatId: defaultBeatId,
		category: undefined,
	});
	const { user } = useAuth();

	const columns = [
		{ header: "Village", accessor: "villageName" as keyof PopulationDetailsType },
		{ header: "Total", accessor: "totalPopulation" as keyof PopulationDetailsType },
		{ header: "Male", accessor: "male" as keyof PopulationDetailsType },
		{ header: "Female", accessor: "female" as keyof PopulationDetailsType },
		{ header: "Category", accessor: "category" as keyof PopulationDetailsType },

	];

	const handleAdd = async () => {
		console.log("Form submit triggered");
		console.log("user.beatId:", user?.beatId); // Add this line to check beatId
		if (!user?.beatId) {
			setError("BeatBook not assigned to user. Cannot submit population details.");
			return;
		}
		const payload = {
			...form,
			userId: user._id,
			beatId: user.beatId,
		} as PopulationDetailsType;
		console.log("Adding population details with form data:", payload);
		await addPopulationDetails(payload);
		setShowAddModal(false);
		setForm({ category: undefined });
	};

	return (
		<div className="p-4">
			<div className="flex items-center gap-3 mb-6">
				<div className="p-2 bg-[#e8eaf6] rounded-xl">
					<FaFileAlt className="text-[#1a237e]" size={24} />
				</div>
				<div className="flex-1">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h1 className="text-xl sm:text-2xl font-bold text-[#1a237e]">Population Details</h1>
						{showAddButton && <p className="text-sm text-gray-500">Add Population Details</p>}
						</div>
                        {showAddButton && <Button onClick={() => setShowAddModal(true)} className="mb-0">Add Details</Button>}
					</div>
				</div>
			</div>

			{error && <div className="text-red-500 mb-2">{error}</div>}
			<Table
				columns={columns}
				data={populationDetails}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
			/>
			{/* Details Modal */}
			{selected && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
						<h2 className="text-lg font-bold mb-2">Population Details</h2>
						<pre className="text-xs bg-gray-100 p-2 rounded mb-4 overflow-x-auto">
							{JSON.stringify(populationDetails.find((p) => p._id === selected), null, 2)}
						</pre>
						<Button onClick={() => setSelected(null)}>Close</Button>
					</div>
				</div>
			)}
			{/* Add Details Modal */}
			{showAddModal && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
						<h2 className="text-lg font-bold mb-2">Add Population Details</h2>
						<form
							onSubmit={e => {
								e.preventDefault();
								handleAdd();
							}}
						>
							<input
								type="text"
								placeholder="Village Name"
								value={form.villageName ?? ""}
								onChange={e => setForm({ ...form, villageName: e.target.value })}
								className="mb-2 w-full p-2 border rounded"
								required
							/>
							<input
								type="number"
								placeholder="Total Population"
								value={form.totalPopulation ?? ""}
								onChange={e => setForm({ ...form, totalPopulation: Number(e.target.value) })}
								className="mb-2 w-full p-2 border rounded"
								required
							/>
							<input
								type="number"
								placeholder="Male"
								value={form.male ?? ""}
								onChange={e => setForm({ ...form, male: Number(e.target.value) })}
								className="mb-2 w-full p-2 border rounded"
								required
							/>
							<input
								type="number"
								placeholder="Female"
								value={form.female ?? ""}
								onChange={e => setForm({ ...form, female: Number(e.target.value) })}
								className="mb-2 w-full p-2 border rounded"
								required
							/>
							<select
								value={form.category ?? ""}
								onChange={e => setForm({ ...form, category: e.target.value as "Sensitive" | "Normal" })}
								className="mb-2 w-full p-2 border rounded"
								required
							>
								<option value="">Select Category</option>
								<option value="Sensitive">Sensitive</option>
								<option value="Normal">Normal</option>
							</select>

							<div className="flex gap-2 mt-4">
								<Button type="submit">Submit</Button>
								<Button onClick={() => setShowAddModal(false)} type="button">Cancel</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};
export default PopulationDetailsPage;