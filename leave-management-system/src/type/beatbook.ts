
// धर्म का interface
export interface Religion {
  _id?: string;       // MongoDB ObjectId
  name: string;       // हिन्दू, मुस्लिम, अन्य
}

// उपजाति का interface
export interface SubCaste {
  _id?: string;
  religionId: string; // Reference to Religion._id
  name: string;       // उपजाति का नाम
}

// Village में subcaste population
export interface VillageSubCastePopulation {
  religionId: string;    // Reference to Religion._id
  subCasteId: string;    // Reference to SubCaste._id
  population: number;    // उस उपजाति की population
}

// Village interface
export interface Village {
  _id?: string;
  name: string;
  latitude?: string;
  longitude?: string;
  casteData: VillageSubCastePopulation[]; // हर उपजाति की population
}

// BeatBook interface
export interface BeatBook {
  _id?: string;
  userId: string;            // BeatBook बनाया किसने (User._id)
  beatNo?: string;
  villages: Village[];       // Embedded village objects
  beatIncharge?: string;
  beatInchargeMobile?: string;
  alternateBeatConstableName?: string;
  alternateBeatConstableMobile?: string;
}

// --------------------
// Population Summary Interface

export interface PopulationDetailsVillage {
  _id?: string;
   beatId: string;
  villageName: string;
  religions: {
    religionId: string;
    subCastes: {
      subCasteId: string;
      population: number;
    }[];
  }[];
  totalPopulation: number;
}

export type PopulationDetailsType = {
  _id?: string;
   beatId: string;
  villageName: string;
  religions: {
    religionId: string;
    subCastes: {
      subCasteId: string;
      population: number;
    }[];
  }[];
  totalPopulation: number;
};
