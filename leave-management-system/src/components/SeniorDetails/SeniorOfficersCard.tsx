import { useTranslation } from "react-i18next";
import { Phone, IdCard, User } from "lucide-react";

type Officer = {
  rank: string;
  name: string;
  contact: string;
  uno: string;
  maxDays: number | null;
  label: string;
};

type SeniorOfficersCardProps = {
  officers: Officer[];
};

const SeniorOfficersCard = ({ officers }: SeniorOfficersCardProps) => {
  const { t } = useTranslation();

  if (officers.length === 0) return null;

  return (
    <section className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#1a237e] mb-4 md:mb-6 text-center">
        {t("approvalHierarchy") || "Approval Hierarchy"}
      </h2>

      <div className="flex flex-col items-center gap-2 md:gap-3">
        {officers.map((officer, index) => (
          <div key={officer.rank} className="flex flex-col items-center w-full">
            {/* Officer Card */}
            <div className="border border-gray-200 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 bg-gradient-to-r from-gray-50 to-white w-full max-w-2xl hover:shadow-md transition-shadow">
              {/* Mobile Layout */}
              <div className="flex flex-col gap-3 items-center">
                {/* Rank Badge & Name */}
                <div className="flex flex-col items-center gap-2">
                  <span className="inline-block bg-gradient-to-r from-[#1a237e] to-[#303f9f] text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                    {officer.rank}
                  </span>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-[#1a237e] flex-shrink-0" />
                    <p className="font-bold text-[#1a237e] text-sm sm:text-base">{officer.name}</p>
                  </div>
                </div>

                {/* Contact Details - Centered */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                    <Phone size={14} className="text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{officer.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                    <IdCard size={14} className="text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{officer.uno}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow between cards */}
            {index < officers.length - 1 && (
              <div className="text-xl sm:text-2xl md:text-3xl text-[#c5a200] my-1.5 sm:my-2 md:my-3">⬇</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SeniorOfficersCard;