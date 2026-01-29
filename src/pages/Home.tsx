import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, DollarSign, Users, Star, Search, Calendar, ArrowRight } from 'lucide-react';
import type { Car, CarImage } from '../lib/supabase';

interface CarWithImage extends Car {
  images: CarImage[];
  owner: { full_name: string | null };
}

export default function Home() {
  const [cars, setCars] = useState<CarWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          images: car_images(*),
          owner: profiles(full_name)
        `)
        .eq('status', 'available')
        .limit(8);

      if (error) throw error;
      setCars(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white">
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative">
          <h1 className="text-5xl font-bold mb-4">Find Your Perfect Ride</h1>
          <p className="text-xl text-blue-100 mb-12">Rent cars directly from local owners at unbeatable prices</p>

          <div className="bg-white rounded-xl shadow-2xl p-8">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or address"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Cars</h2>
          <p className="text-gray-600 text-lg">Browse our collection of verified vehicles</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No cars available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map((car) => {
              const primaryImage = car.images?.find(img => img.is_primary) || car.images?.[0];
              return (
                <Link
                  key={car.id}
                  to={`/car/${car.id}`}
                  className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 bg-white"
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {primaryImage?.image_url ? (
                      <img
                        src={primaryImage.image_url}
                        alt={car.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${car.price_per_day}/day
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                      {car.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4">
                      {car.brand} {car.model} {car.year}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {car.average_rating || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{car.seats} seats</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{car.location}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        by {car.owner?.full_name || 'Unknown'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">Rent directly from owners and save up to 50% compared to traditional rental companies</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Owners</h3>
              <p className="text-gray-600">All our car owners are verified and their vehicles are inspected for safety and quality</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600">Join thousands of users who trust CarSwap for their transportation needs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
