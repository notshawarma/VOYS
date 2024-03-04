import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Banner = ({ programs }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          {/* ***** Most Popular Start ***** */}
          <div className="most-popular">
            <div className="row">
              <div className="col-lg-12">
                <div className="heading-section">
                  <h4>
                    MTICS RECENT PROGRAMS
                  </h4>
                </div>
                <div className="row">
                  {programs.map((program) => (
                    <div className="col-lg-3 col-sm-6" key={program._id}>
                      <div className="item" style={{ marginBottom: '20px' }}>
                        {program.images && program.images.length > 0 && !imageError ? (
                          <img src={program.images[0].url} alt={program.name} onError={handleImageError} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        ) : (
                          <div className="prog-placeholder-image" style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            No Image Available
                          </div>
                        )}
                        <h4>
                        <Link to={`/single-programs/${program._id}`} className="prog-custom-button">
                          {program.name /* Adjust if different in your data */}
                        </Link>
                        </h4>
                         
                          <br />
                          <span>{program.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* ***** Most Popular End ***** */}
        </div>
      </div>
    </div>
  );
};

export default Banner;
