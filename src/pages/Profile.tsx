import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Star, MapPin, Users, Calendar } from 'lucide-react';
import type { Profile } from '../lib/supabase';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
              {profile.full_name?.charAt(0) || 'U'}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile.full_name || 'Unnamed User'}
            </h1>
            <p className="text-gray-600 mb-4">{profile.email}</p>

            <div className="flex items-center justify-center space-x-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(profile.average_rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 font-semibold text-gray-900">
                {profile.average_rating.toFixed(1)} out of 5
              </span>
            </div>
          </div>

          {profile.bio && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">About</h3>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-1">Total Trips</p>
              <p className="text-3xl font-bold text-gray-900">{profile.total_trips}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-1">Cars Hosted</p>
              <p className="text-3xl font-bold text-gray-900">{profile.total_hosted}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <Star className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-1">Verification</p>
              <p className="text-lg font-bold text-gray-900">
                {profile.verification_status === 'verified' ? '✓ Verified' : 'Pending'}
              </p>
            </div>
          </div>

          {profile.phone && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Contact</h3>
              <p className="text-gray-600">{profile.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
