import React, { useState, useEffect } from 'react';

const App = () => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage] = useState(6);

  useEffect(() => {
    // Fetch data from the new API endpoint
    fetch('https://myfakeapi.com/api/football/teams')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTeams(data.Teams);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when performing a search
  };

  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  // const currentTeams = teams.slice(indexOfFirstTeam, indexOfLastTeam);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFilteredTeam = currentPage * teamsPerPage;
  const indexOfFirstFilteredTeam = indexOfLastFilteredTeam - teamsPerPage;
  const currentFilteredTeams = filteredTeams.slice(
    indexOfFirstFilteredTeam,
    indexOfLastFilteredTeam
  );

  return (
    <div className="container mt-4 py-5">
      <h2 className='text-center'>Search Football Teams</h2>
      <div className="row py-5">
        <div className="col-md-12 mb-3 text-center">
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-control w-50 mx-auto"
          />
        </div>
      </div>
      <div className="row">
        {currentFilteredTeams.map(team => (
          <div key={team.id} className="col-md-4 mb-3">
            <div className="card h-100 p-3">
              <img
                src={team.flag}
                className="card-img-top img-fluid"
                alt={team.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{team.name}</h5>
                {/* You can display more details here if needed */}
              </div>
            </div>
          </div>
        ))}
      </div>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
          </li>
          {Array.from({ length: Math.ceil(filteredTeams.length / teamsPerPage) }, (_, i) => (
            <li key={i} className="page-item">
              <button className="page-link" onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentFilteredTeams.length < teamsPerPage ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentFilteredTeams.length < teamsPerPage}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default App;
