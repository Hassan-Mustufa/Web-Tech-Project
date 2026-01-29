import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Users, Fuel, Cog, Calendar, DollarSign, Star, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { Reviews } from '../components/Reviews';
import { MessageModal } from '../components/MessageModal';
import type { Car, CarImage, Profile } from '../lib/supabase';

interface CarWithDetails extends Car {
  images: CarImage[];
  owner: Profile;
}

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [car, setCar] = useState<CarWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('cars')
        .select(`
          *,
          images: car_images(*),
          owner: profiles(*)
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      setCar(data);
    } catch (err) {
      console.error(err);
      setError('Car not found');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date');
      return;
    }

    setBookingLoading(true);

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = days * (car?.price_per_day || 0);

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          car_id: car?.id,
          renter_id: user?.id,
          owner_id: car?.owner_id,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
          status: 'pending',
        });

      if (bookingError) throw bookingError;

      setSuccess(true);
      setStartDate('');
      setEndDate('');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Car not found</p>
        </div>
      </div>
    );
  }

  const primaryImage = car.images?.find(img => img.is_primary) || car.images?.[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              {primaryImage ? (
                <img
                  src={primaryImage.image_url}
                  alt={car.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{car.title}</h1>
              <p className="text-gray-600 mb-6">
                {car.brand} {car.model} • {car.year}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
                <div className="text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600">{car.seats} Seats</p>
                </div>
                <div className="text-center">
                  <Fuel className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600">{car.fuel_type}</p>
                </div>
                <div className="text-center">
                  <Cog className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600">{car.transmission}</p>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-auto mb-2" />
                  <p className="text-gray-600">{car.average_rating || 'No reviews'}</p>
                </div>
              </div>

              {car.description && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About this car</h3>
                  <p className="text-gray-600 leading-relaxed">{car.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-20">
              <div className="mb-8">
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">${car.price_per_day}</span>
                  <span className="text-gray-600 ml-2">/day</span>
                </div>
                <p className="text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {car.location}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-green-700 text-sm">Booking created! Redirecting...</p>
                </div>
              )}

              {isAuthenticated && user?.id !== car.owner_id ? (
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  {startDate && endDate && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Estimated total:</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${(Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) * car.price_per_day).toFixed(2)}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? 'Booking...' : 'Book Now'}
                  </button>
                </form>
              ) : isAuthenticated && user?.id === car.owner_id ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700">This is your car listing</p>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Sign In to Book
                </button>
              )}

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Owner Information</h3>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 mb-1">{car.owner?.full_name || 'Unknown Owner'}</p>
                  <p className="text-gray-600 text-sm mb-4">{car.owner?.bio || 'No bio'}</p>
                  {isAuthenticated && user?.id !== car.owner_id && (
                    <button
                      onClick={() => setShowMessageModal(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message Owner</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <Reviews carId={car.id} />
          </div>
        </div>

        {showMessageModal && (
          <MessageModal
            recipientId={car.owner_id}
            recipientName={car.owner?.full_name || 'Car Owner'}
            onClose={() => setShowMessageModal(false)}
          />
        )}
      </div>
    </div>
  );
}
