import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Kits() {
  const [kits, setKits] = useState([]);
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const response = await fetch("http://localhost:5000/kits");
        const data = await response.json();
        setKits(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchKits();
  }, []);

  const handleChange = (e) => setQuery(e.target.value);

  const toggleGrade = (grade) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const toggleSeries = (series) => {
    setSelectedSeries((prev) =>
      prev.includes(series)
        ? prev.filter((s) => s !== series)
        : [...prev, series]
    );
  };

  const filteredCards = kits.filter((card) => {
    const matchesQuery = card.name?.toLowerCase().includes(query.toLowerCase());

    const matchesGrade =
      selectedGrades.length === 0 ||
      selectedGrades.some((grade) => {
        if (grade === "SD") return card.grade?.toUpperCase().includes("SD");
        if (grade === "FM") return card.grade === "FULL MECHANICS";
        return card.grade === grade;
      });

    const matchesSeries =
      selectedSeries.length === 0 ||
      selectedSeries.some((series) => {
        if (series === "Seed") return card.series === "SEED";
        if (series === "IBO") return card.series === "Iron-Blooded Orphans";
        if (series === "WFM") return card.series === "The Witch from Mercury";
        if (series === "GQux") return card.series === "Gundam GQuuuuuuX";
        if (series === "00") return card.series === "Gundam 00";
        if (series == "Fighter") return card.series === "Fighter G";
        if (series === "UC")
          return card.series?.toLowerCase().includes("gundam");
        if (series === "Build")
          return card.series?.toLowerCase().includes("build");
        return card.series === series;
      });

    return matchesQuery && matchesGrade && matchesSeries;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedGrades, selectedSeries])

  const totalPages = Math.ceil(filteredCards.length / pageSize);

  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="font-bold">
      <h1 className="text-center text-4xl p-4 font-serif pb-8">Kits</h1>

      {/* Query */}
      <form>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          className="block mx-auto w-1/4 border-3 bg-gray-300 rounded-xl p-2"
        />
      </form>

      {/* Filter */}
      <div id="content" className="flex pt-6">
        <div className="pl-4 mr-3">
          <button
            type="button"
            className="text-xl bg-gray-400 border-3 rounded-xl p-2 hover:brightness-50 whitespace-nowrap"
            onClick={() => setShowFilter(!showFilter)}
          >
            Filter by:
          </button>

          {showFilter && (
            <div id="filterBar" className="p-2 rounded-xl space-y-4 w-auto">
              <div className="border-3 rounded-xl p-2 bg-gray-400">
                <h2 className="text-lg">Grade:</h2>
                {[
                  "HG",
                  "RG",
                  "MG",
                  "PG",
                  "SD",
                  "MGSD",
                  "FM",
                  "RE/100",
                  "Mega",
                  "Other",
                ].map((grade) => (
                  <label key={grade} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={grade}
                      checked={selectedGrades.includes(grade)}
                      onChange={() => toggleGrade(grade)}
                    />
                    <span>{grade}</span>
                  </label>
                ))}
              </div>

              <div className="border-3 rounded-xl p-2 bg-gray-400">
                <h2 className="text-lg">Series:</h2>
                {[
                  "UC",
                  "Seed",
                  "00",
                  "IBO",
                  "WFM",
                  "GQux",
                  "Wing",
                  "Fighter",
                  "Build",
                  "Other",
                ].map((series) => (
                  <label key={series} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={series}
                      checked={selectedSeries.includes(series)}
                      onChange={() => toggleSeries(series)}
                    />
                    <span>{series}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Kit Boxes */}
        <div className="grid grid-cols-4 gap-4">
          {paginatedCards
            .filter((card) => card._id)
            .map((card) => (
              <Link to={`/kits/${card._id}`} key={card._id}>
                <div className="bg-gray-400 border-3 rounded-xl flex flex-col hover:bg-gray-800 text-xl transition duration-300 h-135 group">
                  <img
                    src={card.imageUrl}
                    className="w-[95%] mx-auto pt-2 transition duration-300 group-hover:brightness-50 rounded-xl"
                    alt={card.name}
                  />
                  <h2 className="text-center mt-auto pb-6">{card.name}</h2>
                </div>
              </Link>
            ))}
        </div>

        {/* Pages */}
        <div className="justify-center mr-4 w-auto whitespace-nowrap pr-4 ml-4">
          <span className="text-xl block pb-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="bg-gray-400 p-1 rounded-xl disabled:opacity-40 hover:brightness-50 border-3 mr-8"
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="bg-gray-400 p-1 rounded-xl disabled:opacity-40 hover:brightness-50 border-3"
          >
            Next
          </button>
        </div>
        {/* End */}

      </div>
    </div>
  );
}

export default Kits;
