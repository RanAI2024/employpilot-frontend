import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

function Contact() {
  const apiBase = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${apiBase}/api/contact`, form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">

        <h1>Contact Us</h1>
        <p className="contact-sub">
          Have a question? Need support? Send us a message.
        </p>

        {!sent ? (
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        ) : (
          <div className="contact-success">
            <h2>Message Sent ✔</h2>
            <p>We will get back to you within 24 hours.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Contact;
