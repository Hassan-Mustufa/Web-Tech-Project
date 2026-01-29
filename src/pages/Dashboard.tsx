import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, DollarSign, Star, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Car, Booking, CarImage } from '../lib/supabase';

interface CarWithImage extends Car {
  images: CarImage[];
}

interface BookingWithCar extends Booking {
  car: Car & { images: CarImage[] };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [userCars, setUserCars] = useState<CarWithImage[]>([]);
  const [bookings, setBookings] = useState<BookingWithCar[]>([]);
  const [tab, setTab] = useState<'bookings' | 'listings'>('bookings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [bookingsRes, carsRes] = await Promise.all([
        supabase
          .from('bookings')
          .select(`
            *,
            car: cars(*, images: car_images(*))
          `)
          .eq('renter_id', user?.id),
        supabase
          .from('cars')
          .select(`
            *,
            images: car_images(*)
          `)
          .eq('owner_id', user?.id),
      ]);

      if (bookingsRes.error) throw bookingsRes.error;
      if (carsRes.error) throw carsRes.error;

      setBookings(bookingsRes.data || []);
      setUserCars(carsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car listing?')) return;

    try {
      await supabase.from('cars').delete().eq('id', carId);
      setUserCars(userCars.filter(car => car.id !== carId));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setTab('bookings')}
            className={`px-6 py-3 font-semibold transition ${
              tab === 'bookings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setTab('listings')}
            className={`px-6 py-3 font-semibold transition ${
              tab === 'listings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Listings
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : tab === 'bookings' ? (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No bookings yet</p>
                <p className="text-gray-500">Start booking cars to see them here</p>
              </div>
            ) : (
              bookings.map((booking) => {
                const carImage = booking.car?.images?.[0];
                return (
                  <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {carImage && (
                        <img
                          src={carImage.image_url}
                          alt={booking.car?.title}
                          className="h-40 object-cover rounded-lg"
                        />
                      )}

                      <div className="md:col-span-2">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {booking.car?.title}
                        </h3>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(booking.start_date).toLocaleDateString()} to{' '}
                              {new Date(booking.end_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.car?.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">${booking.total_price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <Link
                          to={`/car/${booking.car?.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {userCars.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No listings yet</p>
                <Link
                  to="/list-car"
                  className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                >
                  List Your First Car
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userCars.map((car) => {
                  const primaryImage = car.images?.find(img => img.is_primary) || car.images?.[0];
                  return (
                    <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                      {primaryImage && (
                        <img
                          src={primaryImage.image_url}
                          alt={car.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{car.title}</h3>
                        <p className="text-gray-600 mb-4">
                          {car.brand} {car.model} • {car.year}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-600" />
                            <span className="font-semibold">${car.price_per_day}/day</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <span>{car.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span>{car.average_rating || 'No reviews'}</span>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Link
                            to={`/car/${car.id}`}
                            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => deleteCar(car.id)}
                            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 rounded-lg transition flex items-center justify-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
