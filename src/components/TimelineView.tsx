
import { TravelPin } from '@/types';
import { Calendar, MapPin, Image } from 'lucide-react';

interface TimelineViewProps {
  pins: TravelPin[];
  onPinClick: (pin: TravelPin) => void;
}

const TimelineView = ({ pins, onPinClick }: TimelineViewProps) => {
  const sortedPins = [...pins].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

  const formatDate = (date: Date) => {  
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (sortedPins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <MapPin className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No memories yet</h3>
        <p className="text-gray-500">Start exploring and add your first travel memory!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
        Your Travel Timeline
      </h2>
      
      
      <div className="space-y-4">
        {sortedPins.map((pin, index) => (
          <div
            key={pin.id}
            onClick={() => onPinClick(pin)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start gap-4">
              {pin.photos.length > 0 && (
                <div className="flex-shrink-0">
                  <img
                    src={pin.photos[0].url}
                    alt={pin.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">{pin.title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(pin.visitDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image className="w-4 h-4" />
                    <span>{pin.photos.length} photo{pin.photos.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                {pin.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">{pin.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
