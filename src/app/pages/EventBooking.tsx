import { useState } from 'react';
import { Calendar, Clock, MapPin, User, Mail, Phone, PartyPopper } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function EventBooking() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    location: '',
    guestCount: '',
    additionalInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingId = `booking-${Date.now()}`;
      const bookingData = {
        ...formData,
        id: bookingId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Store booking in KV store
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/event-bookings/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          eventTime: '',
          location: '',
          guestCount: '',
          additionalInfo: '',
        });
      } else {
        alert('Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="bg-black text-white min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <PartyPopper size={40} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Booking Submitted!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for your booking request. DJ Enoch will contact you within 24 hours to confirm the details.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg font-semibold"
            >
              Book Another Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Book Your Event
            </h1>
            <p className="text-xl text-gray-400">
              Make your event unforgettable with DJ Enoch Pro
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Why Book DJ Enoch?</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-orange-600 text-xl">✓</span>
                <span>Professional DJ services with 10+ years of experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 text-xl">✓</span>
                <span>Top-notch sound equipment and lighting</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 text-xl">✓</span>
                <span>Expertise in weddings, parties, corporate events, and more</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 text-xl">✓</span>
                <span>Custom playlist tailored to your preferences</span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <User size={16} className="text-orange-600" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Mail size={16} className="text-orange-600" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Phone size={16} className="text-orange-600" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="+256 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <PartyPopper size={16} className="text-orange-600" />
                  Event Type *
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                  <option value="">Select event type</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="graduation">Graduation Party</option>
                  <option value="club">Club Event</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Calendar size={16} className="text-orange-600" />
                  Event Date *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Clock size={16} className="text-orange-600" />
                  Event Time *
                </label>
                <input
                  type="time"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <MapPin size={16} className="text-orange-600" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="Event venue or address"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <User size={16} className="text-orange-600" />
                  Expected Guest Count
                </label>
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="Approximate number of guests"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Any special requests or additional details..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-orange-600 hover:bg-orange-700 py-4 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Booking Request'}
            </button>

            <p className="text-center text-gray-400 text-sm mt-4">
              You will receive a confirmation call/email within 24 hours
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
