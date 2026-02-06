import { useTranslation } from "react-i18next";

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
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#1a237e] mb-6 text-center">{t("seniorOfficers")}</h2>

      <div className="flex flex-col items-center gap-3">
        {officers.map((officer, index) => (
          <div key={officer.rank} className="flex flex-col items-center w-full">
            <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-white w-full max-w-2xl hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div className="flex-shrink-0">
                  <span className="inline-block bg-gradient-to-r from-[#1a237e] to-[#303f9f] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
                    {officer.rank}
                  </span>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-1 sm:flex-wrap gap-3 sm:gap-x-6 sm:gap-y-2">
                  <div className="min-w-[120px]">
                    <p className="text-xs text-gray-500 mb-1">{t("name")}</p>
                    <p className="font-bold text-[#1a237e] text-sm sm:text-base">{officer.name}</p>
                  </div>
                  <div className="min-w-[100px]">
                    <p className="text-xs text-gray-500 mb-1">{t("contact")}</p>
                    <p className="text-xs sm:text-sm text-gray-700">📞 {officer.contact}</p>
                  </div>
                  <div className="min-w-[100px]">
                    <p className="text-xs text-gray-500 mb-1">{t("unoNumber")}</p>
                    <p className="text-xs sm:text-sm text-gray-700">🆔 {officer.uno}</p>
                  </div>
                </div>
              </div>
            </div>

            {index < officers.length - 1 && (
              <div className="text-2xl sm:text-3xl text-[#c5a200] my-2 sm:my-3">⬇</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SeniorOfficersCard;