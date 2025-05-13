
import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { PGFilter } from '@/types';
import { amenities as allAmenities } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from '@/components/ui/slider';

interface PGFiltersProps {
  currentFilters: PGFilter;
  onApplyFilters: (filters: PGFilter) => void;
}

const PGFilters: React.FC<PGFiltersProps> = ({ currentFilters, onApplyFilters }) => {
  const [tempFilters, setTempFilters] = useState<PGFilter>({ ...currentFilters });
  
  const handlePriceChange = (value: number[]) => {
    setTempFilters(prev => ({
      ...prev,
      price: { min: value[0], max: value[1] }
    }));
  };
  
  const handleGenderChange = (gender: 'male' | 'female' | 'co-ed' | null) => {
    setTempFilters(prev => ({ ...prev, gender }));
  };
  
  const handleAvailabilityChange = (availability: 'available-now' | 'available-soon' | null) => {
    setTempFilters(prev => ({ ...prev, availability }));
  };
  
  const toggleAmenity = (amenityId: string) => {
    setTempFilters(prev => {
      if (prev.amenities.includes(amenityId)) {
        return { ...prev, amenities: prev.amenities.filter(id => id !== amenityId) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenityId] };
      }
    });
  };
  
  const applyFilters = () => {
    onApplyFilters(tempFilters);
  };
  
  const resetFilters = () => {
    const defaultFilters: PGFilter = {
      price: { min: 5000, max: 20000 },
      gender: null,
      amenities: [],
      availability: null
    };
    setTempFilters(defaultFilters);
    onApplyFilters(defaultFilters);
  };
  
  // Count active filters safely
  const countActiveFilters = () => {
    let count = 0;
    if (tempFilters.gender) count++;
    if (tempFilters.availability) count++;
    if (tempFilters.amenities && tempFilters.amenities.length > 0) count += tempFilters.amenities.length;
    
    // Only count price if it's different from the default range
    if (tempFilters.price && (tempFilters.price.min !== 5000 || tempFilters.price.max !== 20000)) {
      count++;
    }
    
    return count;
  };
  
  return (
    <div className="mb-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full flex justify-between items-center">
            <span className="flex items-center">
              <Filter size={16} className="mr-2" />
              Filters
            </span>
            <span className="bg-appPurple text-white text-xs rounded-full px-2 py-0.5">
              {countActiveFilters()}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Customize your PG search with filters
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-4 space-y-6">
            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-2">Price Range (₹)</h3>
              <div className="mx-2">
                <Slider
                  defaultValue={[tempFilters.price.min, tempFilters.price.max]}
                  max={25000}
                  min={1000}
                  step={500}
                  onValueChange={handlePriceChange}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>₹{tempFilters.price.min}</span>
                  <span>₹{tempFilters.price.max}</span>
                </div>
              </div>
            </div>
            
            {/* Gender Preference */}
            <div>
              <h3 className="font-medium mb-2">Gender Preference</h3>
              <div className="flex gap-2">
                <Button 
                  variant={tempFilters.gender === 'male' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleGenderChange(tempFilters.gender === 'male' ? null : 'male')}
                  className={tempFilters.gender === 'male' ? 'bg-appPurple' : ''}
                >
                  Male
                </Button>
                <Button 
                  variant={tempFilters.gender === 'female' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleGenderChange(tempFilters.gender === 'female' ? null : 'female')}
                  className={tempFilters.gender === 'female' ? 'bg-appPurple' : ''}
                >
                  Female
                </Button>
                <Button 
                  variant={tempFilters.gender === 'co-ed' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleGenderChange(tempFilters.gender === 'co-ed' ? null : 'co-ed')}
                  className={tempFilters.gender === 'co-ed' ? 'bg-appPurple' : ''}
                >
                  Co-ed
                </Button>
              </div>
            </div>
            
            {/* Availability */}
            <div>
              <h3 className="font-medium mb-2">Availability</h3>
              <div className="flex gap-2">
                <Button 
                  variant={tempFilters.availability === 'available-now' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleAvailabilityChange(tempFilters.availability === 'available-now' ? null : 'available-now')}
                  className={tempFilters.availability === 'available-now' ? 'bg-appPurple' : ''}
                >
                  Available Now
                </Button>
                <Button 
                  variant={tempFilters.availability === 'available-soon' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleAvailabilityChange(tempFilters.availability === 'available-soon' ? null : 'available-soon')}
                  className={tempFilters.availability === 'available-soon' ? 'bg-appPurple' : ''}
                >
                  Coming Soon
                </Button>
              </div>
            </div>
            
            {/* Amenities */}
            <div>
              <h3 className="font-medium mb-2">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {(allAmenities ?? []).map(amenity => (
                  <Button 
                    key={amenity.id}
                    variant={tempFilters.amenities.includes(amenity.id) ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`justify-start ${tempFilters.amenities.includes(amenity.id) ? 'bg-appPurple' : ''}`}
                  >
                    <span className="mr-1">{amenity.icon}</span>
                    {amenity.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <SheetFooter className="mt-4">
            <Button variant="outline" onClick={resetFilters}>
              <X size={16} className="mr-2" />
              Reset
            </Button>
            <SheetClose asChild>
              <Button onClick={applyFilters} className="bg-appPurple hover:bg-appPurple-dark">
                Apply Filters
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PGFilters;
