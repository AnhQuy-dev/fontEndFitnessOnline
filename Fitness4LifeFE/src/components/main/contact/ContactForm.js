import React, { useState } from 'react';
import '../../../assets/css/contact.css'
import '../../../assets/plugins/sky-forms-pro/skyforms/css/sky-forms.css'
import '../../../assets/plugins/sky-forms-pro/skyforms/custom/custom-sky-forms.css'
import '../../../assets/css/font-awesome.min.css'

function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        number: '',
        message: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuccess(true);
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
    };

    return (
        <section id="services">
            <div className="container">
                <div className="row" style={{ marginBottom: '30px' }}>
                    <div className="col-md-9" style={{ marginBottom: '30px' }}>
                        <div className="headline">
                            <h2>Contact Form</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="sky-form sky-changes-3">
                            <fieldset>
                                <div className="row">
                                    <section className="col col-6">
                                        <label className="label">Name</label>
                                        <label className="input">
                                            <i className="icon-append fa fa-user"></i>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </label>
                                    </section>
                                    <section className="col col-6">
                                        <label className="label">E-mail</label>
                                        <label className="input">
                                            <i className="icon-append fa fa-envelope-o"></i>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </label>
                                    </section>
                                </div>

                                <section>
                                    <label className="label">Subject</label>
                                    <label className="input">
                                        <i className="icon-append fa fa-tag"></i>
                                        <input
                                            type="text"
                                            name="subject"
                                            id="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                        />
                                    </label>
                                </section>

                                <section>
                                    <label className="label">Mobile Number</label>
                                    <label className="input">
                                        <i className="icon-append fa fa-phone"></i>
                                        <input
                                            type="text"
                                            name="number"
                                            id="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                        />
                                    </label>
                                </section>

                                <section>
                                    <label className="label">Message</label>
                                    <label className="textarea">
                                        <i className="icon-append fa fa-comment"></i>
                                        <textarea
                                            rows="4"
                                            name="message"
                                            id="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                        ></textarea>
                                    </label>
                                </section>
                            </fieldset>

                            {showSuccess && (
                                <div className="alert alert-success successBox" style={{ width: '90%', marginLeft: '30px' }}>
                                    <button type="button" className="close" onClick={handleCloseSuccess}>
                                        ×
                                    </button>
                                    <strong style={{ fontSize: '16px' }}>Congratulations!</strong>
                                    <span className="alert-link"> Your Message Has been sent!</span>
                                </div>
                            )}

                            <footer>
                                <button type="submit" className="btn-u">
                                    Send message
                                </button>
                            </footer>
                        </form>
                    </div>

                    <div className="col-md-3" style={{ marginTop: '56px' }}>
                        <div className="headline">
                            <h2>Address</h2>
                        </div>
                        <ul className="list-unstyled who" style={{ marginBottom: '30px' }}>
                            <li>
                                <a href="#">
                                    <i className="fa fa-home"></i>Aptech, IN.
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="fa fa-envelope"></i>fitness4lesss@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="fa fa-phone"></i>886 666 00555
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="fa fa-globe"></i>http://www.Fitness4less.com
                                </a>
                            </li>
                        </ul>

                        <div className="headline">
                            <h2>Business Hours</h2>
                        </div>
                        <ul className="list-unstyled" style={{ marginBottom: '40px' }}>
                            <li>
                                <strong>Monday-Saturday:</strong> 24/7 Available.
                            </li>
                            <li>
                                <strong>Sunday:</strong> 4 AM to 11 PM.
                            </li>
                        </ul>

                        <div className="headline">
                            <h2>Why Choose Us?</h2>
                        </div>
                        <p>
                            "All fitness services are available under one roof, making [Gym Name] your one-stop destination for all your health and fitness needs."
                        </p>
                        <ul className="list-unstyled">
                            <li>
                                <i style={{color: ' #F9690E' }}className="fa fa-check color-green"></i> 24/7 Gym Access.
                            </li>
                            <li>
                                <i style={{color: ' #F9690E' }}className="fa fa-check color-ogrange"></i> Certified and Experienced Trainers.
                            </li>
                            <li>
                                <i style={{color: ' #F9690E' }} className="fa fa-check color-green"></i> Variety of Workout Programs.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ContactForm;
