import React from 'react'

const About = () => {
  return (
    <div className="container">
  <div className="row">
    <div className="col-lg-12">
      <div className="page-content">
        {/* ***** Banner Start ***** */}
        <div className="row">
          <div className="col-lg-12">
            <div className="main-profile ">
              <div className="row">
              <div className="col-lg-4">
                <img
                    src="assets/images/group.jpg"
                    alt=""
                    style={{ borderRadius: 23, maxWidth: "100%", height: "auto" }}
                />
                </div>
                <div className="col-lg-4">
                <div className="main-info header-text" style={{ width: "100%" }}>
                    <h4>A Text-Based Sentiment Analysis of Member Opinions on MTICS Programs at Technological University of the Philippines – Taguig Campus</h4>
                    <p>
                    We are students from the Technological University of the Philippines who aim to gather sentiments from students within the Information Technology Department regarding their views on the organization. These sentiments will provide valuable insights to help the organization improve further.
                    </p>
                </div>
                </div>

              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="clips">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="heading-section">
                          <h4>
                             TEAM MEMBERS
                          </h4>
                        </div>
                      </div>
                      <div className="row">
                    <div className="col-lg-3 col-sm-6">
                        <div className="item">
                        <div className="thumb">
                            <img
                            src="assets/images/ej.jpg"
                            alt=""
                            style={{ borderRadius: 23, width: "100%", height: "auto" }}
                            />
                        </div>
                        <div className="down-content">
                            <h4>Ej Cezar Falogme</h4>
                            <span>Team Leader</span>
                        </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                        <div className="item">
                        <div className="thumb">
                            <img
                            src="assets/images/twinks.jpg"
                            alt=""
                            style={{ borderRadius: 23, width: "100%", height: "auto" }}
                            />
                        </div>
                        <div className="down-content">
                            <h4>Twinkle D. Ascano</h4>
                            <span>Documentation</span>
                        </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                        <div className="item">
                        <div className="thumb">
                            <img
                            src="assets/images/me.jpg"
                            alt=""
                            style={{ borderRadius: 23, width: "100%", height: "auto" }}
                            />
                        </div>
                        <div className="down-content">
                            <h4>Danize Fadullo</h4>
                            <span>Frontend Developer</span>
                        </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                        <div className="item">
                        <div className="thumb">
                            <img
                            src="assets/images/jp.jpg"
                            alt=""
                            style={{ borderRadius: 23, width: "100%", height: "auto" }}
                            />
                        </div>
                        <div className="down-content">
                            <h4>John Paul Francisco</h4>
                            <span>Backend Developer</span>
                        </div>
                        </div>
                    </div>
                    </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ***** Banner End ***** */}
      </div>
    </div>
  </div>
</div>

  )
}

export default About