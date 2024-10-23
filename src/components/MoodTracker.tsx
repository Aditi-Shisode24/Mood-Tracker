import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Smile, Frown, Meh, Angry, Heart } from 'lucide-react';
import axios from 'axios';

interface MoodTrackerProps {
  userId: string;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ userId }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!userId) {
      setError('No user ID found. Please log in.');
      return;
    }

    const fetchMoodHistory = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/moods`, {
          params: { userId },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const moods = response.data.reduce(
          (acc: Record<string, string>, mood: any) => {
            acc[mood.date.split('T')[0]] = mood.mood;
            return acc;
          },
          {}
        );
        setMoodHistory(moods);
      } catch (err) {
        console.error('Failed to fetch mood history:', err);
        setError('Failed to fetch mood history. Please try again.');
      }
    };
    fetchMoodHistory();
  }, [userId]);

  const moods = [
    { emoji: '😄', icon: Smile, label: 'Happy' },
    { emoji: '😢', icon: Frown, label: 'Sad' },
    { emoji: '😐', icon: Meh, label: 'Neutral' },
    { emoji: '😠', icon: Angry, label: 'Angry' },
    { emoji: '😊', icon: Heart, label: 'Loved' },
  ];

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    setSelectedMood(null);
    setSuccessMessage(null);
  };

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/mood`, {
        userId,
        date: formatDate(selectedDate),
        mood,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.status === 201) {
        setMoodHistory({ ...moodHistory, [formatDate(selectedDate)]: mood });
        setSuccessMessage('Mood saved successfully!');
      }
    } catch (err) {
      setError('Failed to save mood. Please try again.');
      console.error(err);
    }
  };

  const renderMoodSquare = (date: Date) => {
    const formattedDate = formatDate(date);
    const mood = moodHistory[formattedDate];
    return (
      <div
        key={formattedDate}
        className={`p-1 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100 ${
          mood
            ? `bg-${mood === 'Happy' ? 'green' : mood === 'Sad' ? 'red' : mood === 'Neutral' ? 'gray' : mood === 'Angry' ? 'orange' : 'pink'}-200 text-white`
            : ''
        }`}
        onClick={() => {
          setSelectedDate(date);
          setSelectedMood(mood);
        }}
      >
        {mood && <span className="text-lg">{moods.find((m) => m.label === mood)?.emoji}</span>}
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <CalendarIcon className="mr-2 h-6 w-6 text-[#f1c0e8]" />
        Mood Tracker
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="text-lg font-semibold text-gray-800 mb-2">
            Select a Date
          </label>
          <input
            type="date"
            id="date"
            value={formatDate(selectedDate)}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#cfbaf0]"
            placeholder="YYYY-MM-DD"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">How are you feeling?</h2>
          <div className="flex space-x-4">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => handleMoodSelect(mood.label)}
                className={`p-2 rounded-full transition-all ${
                  selectedMood === mood.label
                    ? 'bg-[#a3c4f3] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {React.createElement(mood.icon, { className: 'h-8 w-8' })}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Mood History</h2>
        <div className="grid grid-cols-7 gap-2">
          {Array.from(Array(31), (_, i) => i + 1).map((day) => (
            <div key={day}>{renderMoodSquare(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}</div>
          ))}
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {successMessage && <p className="text-green-600">{successMessage}</p>}
      </div>
    </div>
  );
};

export default MoodTracker;