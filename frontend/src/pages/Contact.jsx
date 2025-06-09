import React from "react";

const Contact = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 pt-28">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
        Contact Us
      </h1>

      <p className="mb-8 text-lg leading-relaxed text-gray-700 text-center">
        Have questions, feedback, or need assistance? Reach out to us anytime!
        We’re here to help and will get back to you as soon as possible.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Our Contact Info
        </h2>
        <p className="text-gray-700 mb-2">
          <strong>Email:</strong> support@flightplatform.com
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Phone:</strong> +1 (555) 123-4567
        </p>
        <p className="text-gray-700">
          <strong>Address:</strong> 123 Flight Street, Travel City, USA
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-blue-600">
          Send Us a Message
        </h2>
        <form className="max-w-md mx-auto space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block mb-2 font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              placeholder="Write your message here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
};

export default Contact;
