import React from "react";

const About = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 pt-28">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
        About Us
      </h1>

      <p className="mb-6 text-lg leading-relaxed text-gray-700">
        Welcome to our flight booking platform! We’re dedicated to making your
        travel experience as smooth and enjoyable as possible. Whether you’re
        booking a quick business trip or a long-awaited vacation, we provide a
        user-friendly interface and reliable service.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Our Mission
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Our mission is to connect travelers with the best flights worldwide,
          ensuring competitive prices and excellent customer support. We believe
          travel should be accessible, convenient, and exciting for everyone.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Why Choose Us?
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>User-friendly booking system with fast search and comparison</li>
          <li>Secure payment options with multiple currencies</li>
          <li>24/7 customer support ready to assist you</li>
          <li>Regular updates and travel tips on our blog</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Get in Touch
        </h2>
        <p className="text-gray-700 leading-relaxed mb-2">
          Have questions or feedback? We'd love to hear from you!
        </p>
        <p className="text-gray-700 font-medium">
          Email: support@flightplatform.com
        </p>
        <p className="text-gray-700 font-medium">Phone: +1 (555) 123-4567</p>
      </section>
    </main>
  );
};

export default About;
