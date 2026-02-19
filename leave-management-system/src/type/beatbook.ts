export interface BeatBook {
  _id?: string;
  beatNo?: string;
  villages?: string;
  villageLatLong?: string;
  beatIncharge?: string;
  beatInchargeMobile?: string;
  alternateBeatConstableName?: string;
  alternateBeatConstableMobile?: string;
  [key: string]: string | undefined;
  // Add more fields as needed
}
export interface PopulationDetailsType {
  _id?: string;
  beatId: string; // required
  villageName: string;
  totalPopulation: number;
  male: number;
  female: number;
  category: "Sensitive" | "Normal";
}