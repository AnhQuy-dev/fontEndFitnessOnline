import React from 'react';

const PricingSection = () => {
    return (
        <section id="pricing">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title wow fadeInDown">Pricing</h2>
                    <p className="wow fadeInDown">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa <br /> semper aliquam quis mattis quam.
                    </p>
                </div>

                <div className="row">
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="wow zoomIn" data-wow-duration="400ms" data-wow-delay="0ms">
                            <ul className="pricing">
                                <li className="plan-header">
                                    <div className="price-duration">
                                        <span className="price">$45</span>
                                        <span className="duration">per month</span>
                                    </div>

                                    <div className="plan-name">Basic</div>
                                </li>
                                <li><strong>1</strong> DOMAIN</li>
                                <li><strong>100GB</strong> DISK SPACE</li>
                                <li><strong>UNLIMITED</strong> BANDWIDTH</li>
                                <li>SHARED SSL CERTIFICATE</li>
                                <li><strong>10</strong> EMAIL ADDRESS</li>
                                <li><strong>24/7</strong> SUPPORT</li>
                                <li className="plan-purchase">
                                    <a className="btn btn-primary" href="#">Get It Now!</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="wow zoomIn" data-wow-duration="400ms" data-wow-delay="200ms">
                            <ul className="pricing featured">
                                <li className="plan-header">
                                    <div className="price-duration">
                                        <span className="price">$85</span>
                                        <span className="duration">per month</span>
                                    </div>

                                    <div className="plan-name">Bronze</div>
                                </li>
                                <li><strong>5</strong> DOMAIN</li>
                                <li><strong>500GB</strong> DISK SPACE</li>
                                <li><strong>UNLIMITED</strong> BANDWIDTH</li>
                                <li>SHARED SSL CERTIFICATE</li>
                                <li><strong>30</strong> EMAIL ADDRESS</li>
                                <li><strong>24/7</strong> SUPPORT</li>
                                <li className="plan-purchase">
                                    <a className="btn btn-primary" href="#">Get It Now!</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="wow zoomIn" data-wow-duration="400ms" data-wow-delay="400ms">
                            <ul className="pricing">
                                <li className="plan-header">
                                    <div className="price-duration">
                                        <span className="price">$125</span>
                                        <span className="duration">per month</span>
                                    </div>

                                    <div className="plan-name">Silver</div>
                                </li>
                                <li><strong>10</strong> DOMAIN</li>
                                <li><strong>2GB</strong> DISK SPACE</li>
                                <li><strong>UNLIMITED</strong> BANDWIDTH</li>
                                <li>SHARED SSL CERTIFICATE</li>
                                <li><strong>50</strong> EMAIL ADDRESS</li>
                                <li><strong>24/7</strong> SUPPORT</li>
                                <li className="plan-purchase">
                                    <a className="btn btn-primary" href="#">Get It Now!</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="wow zoomIn" data-wow-duration="400ms" data-wow-delay="600ms">
                            <ul className="pricing">
                                <li className="plan-header">
                                    <div className="price-duration">
                                        <span className="price">$185</span>
                                        <span className="duration">per month</span>
                                    </div>

                                    <div className="plan-name">Gold</div>
                                </li>
                                <li><strong>15</strong> DOMAIN</li>
                                <li><strong>10GB</strong> DISK SPACE</li>
                                <li><strong>UNLIMITED</strong> BANDWIDTH</li>
                                <li>SHARED SSL CERTIFICATE</li>
                                <li><strong>100</strong> EMAIL ADDRESS</li>
                                <li><strong>24/7</strong> SUPPORT</li>
                                <li className="plan-purchase">
                                    <a className="btn btn-primary" href="#">Get It Now!</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PricingSection;
