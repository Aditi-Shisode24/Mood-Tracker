import React, { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';

interface GratitudeJournalProps {
  userId: string;
}

const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ userId }) => {
  const [entries, setEntries] = useState<{ date: string; message: string }[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddEntry = () => {
    if (newEntry.trim()) {
      setEntries((prevEntries) => [
        ...prevEntries,
        { date: entryDate, message: newEntry.trim() },
      ]);
      setNewEntry(''); // Clear the input field
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <BookOpen className="mr-2 h-6 w-6 text-[#f1c0e8]" />
        Gratitude Journal
      </h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">What are you grateful for today?</h2>
        
        <div className="flex mb-4">
          <label htmlFor="entry-date" className="sr-only">Entry Date</label>
          <input
            id="entry-date"
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="mr-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#cfbaf0]"
            title="Select the date for your entry"
          />
          
          <label htmlFor="entry-message" className="sr-only">Gratitude Entry</label>
          <input
            id="entry-message"
            type="text"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#cfbaf0]"
            placeholder="I'm grateful for..."
            title="Type your gratitude entry"
          />
          
          <button
            onClick={handleAddEntry}
            className="bg-[#a3c4f3] text-white p-2 rounded-r-md hover:bg-[#90dbf4] focus:outline-none focus:ring-2 focus:ring-[#cfbaf0]"
            disabled={!newEntry.trim()}
            type="button"
            aria-label="Add gratitude entry"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Gratitude Entries</h2>
        {entries.length === 0 ? (
          <p className="text-gray-600">No entries yet. Start by adding what you're grateful for!</p>
        ) : (
          <ul className="space-y-2">
            {entries.map((entry, index) => (
              <li key={index} className="bg-[#fbf8cc] p-3 rounded-md">
                <strong>{new Date(entry.date).toLocaleDateString()}:</strong> {entry.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GratitudeJournal;
