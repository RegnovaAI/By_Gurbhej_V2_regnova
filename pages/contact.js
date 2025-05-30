import Head from "next/head";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";
import { BASE_URL } from "@/utils/api_constants";

export default function Contact() {
    const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("Message sent!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send.");
      }
    } catch {
      setStatus("Failed to send.");
    }
  };
  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>
      <div
        className="pt-48 min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10"
        style={{
          backgroundImage: "url(/bg-hero.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-10 bg-opacity-60">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <div className="">
                <h2 className="text-4xl font-bold mb-2">Contact Us</h2>
                <p className="text-gray-300">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reiciendis dignissimos eaque doloremque, nulla mollitia facilis
                temporibus ullam voluptas nostrum consequatur?
                </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white text-black rounded-full p-3 w-12 h-12 text-center">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-400">
                    Address
                  </h4>
                  <p>
                    71-75, Shelton Street, Covent Garden,
                    <br />  London, WC2H 9JQ, UNITED KINGDOM
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white text-black rounded-full p-3 w-12 h-12 text-center">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-400">Phone</h4>
                  <p>+49 176 76697872</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white text-black rounded-full p-3 w-12 h-12 text-center">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-400">Email</h4>
                  <p>founder@regnovaai.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white text-black p-8 rounded shadow-md">
            <h3 className="text-2xl font-bold mb-6">Send Message</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 p-2"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 p-2"
              />
              <textarea
                name="message"
                rows="4"
                placeholder="Type your Message..."
                value={form.message}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 p-2"
              ></textarea>
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white w-full py-2 rounded mt-4"
              >
                Send
              </button>
              {status && <p className="mt-2 text-sm">{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
