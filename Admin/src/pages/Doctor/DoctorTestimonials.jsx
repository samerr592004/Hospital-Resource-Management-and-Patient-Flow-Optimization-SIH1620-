import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../contexts/DoctorContext";
import { FaStar } from "react-icons/fa";

const DoctorTestimonials = () => {
  const { doctorData } = useContext(DoctorContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (doctorData?.reviews && typeof doctorData.reviews === "object") {
      const reviewArray = Object.entries(doctorData.reviews)
        .map(([id, review]) => ({ id, ...review }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);
      setReviews(reviewArray);
    }
  }, [doctorData]);

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Client Testimonials
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-12">
            No testimonials yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review) => (
              <div 
                key={review.id}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:border-indigo-100 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
              >
                {/* Header Row */}
                <div className="flex gap-3 justify-between items-center mb-4">
                <img 
                    src={review.image || "/default-avatar.png"} 
                    alt={review.name} 
                    className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                  
                    @{review.username || review.name.toLowerCase().replace(/\s+/g, '')}
                  
                  </h3>
                  
                </div>

                {/* Quote Section */}
                <div className="relative mb-5 pl-1">
                  <svg 
                    className="absolute -top-1 -left-1 w-5 h-5 text-gray-200" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-600 text-sm pl-4 leading-5">
                    "{review.feedback.substring(0, 120)}{review.feedback.length > 120 ? '...' : ''}"
                  </p>
                </div>

                {/* Footer Row */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar 
                        key={star} 
                        size={14}
                        className={star <= Math.round(parseFloat(review.stars || 0)) ? "text-yellow-400" : "text-gray-200"} 
                      />
                    ))}
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorTestimonials;