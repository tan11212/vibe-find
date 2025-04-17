
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/context/AppContext';
import { PGListing } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Building, MapPin, BedDouble, Users, IndianRupee, CheckCircle, ImagePlus, Trash2 } from 'lucide-react';

const amenitiesList = [
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'ac', name: 'Air Conditioning', icon: '❄️' },
  { id: 'laundry', name: 'Laundry', icon: '👕' },
  { id: 'parking', name: 'Parking', icon: '🚗' },
  { id: 'gym', name: 'Gym', icon: '💪' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'tv', name: 'TV', icon: '📺' },
  { id: 'security', name: '24/7 Security', icon: '🔒' },
  { id: 'food', name: 'Food Service', icon: '🍽️' },
  { id: 'cleaning', name: 'Cleaning Service', icon: '🧹' },
];

const PGListingForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createPGListing } = useApp();
  
  const [formData, setFormData] = useState<Partial<PGListing>>({
    name: '',
    address: '',
    gender: 'co-ed',
    description: '',
    totalBeds: 0,
    availableBeds: 0,
    price: 0,
    amenities: [],
    status: 'draft',
  });
  
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value as 'male' | 'female' | 'co-ed' }));
  };
  
  const handleAmenityToggle = (id: string) => {
    setFormData(prev => {
      const currentAmenities = prev.amenities || [];
      
      if (currentAmenities.includes(id)) {
        return { ...prev, amenities: currentAmenities.filter(a => a !== id) };
      } else {
        return { ...prev, amenities: [...currentAmenities, id] };
      }
    });
  };
  
  const handleAddImage = () => {
    // In a real app, this would open a file picker and upload the image
    // For now, we'll just add a placeholder
    const newImageId = `img-${Date.now()}`;
    setImages(prev => [...prev, { id: newImageId, url: 'https://via.placeholder.com/300x200' }]);
  };
  
  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'PG name is required';
    }
    
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.totalBeds || formData.totalBeds <= 0) {
      newErrors.totalBeds = 'Total beds must be greater than 0';
    }
    
    if (formData.availableBeds === undefined || formData.availableBeds < 0) {
      newErrors.availableBeds = 'Available beds must be 0 or greater';
    }
    
    if (formData.availableBeds !== undefined && formData.totalBeds !== undefined && 
        formData.availableBeds > formData.totalBeds) {
      newErrors.availableBeds = 'Available beds cannot exceed total beds';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveDraft = () => {
    // Add image URLs to the listing
    const listingWithImages = {
      ...formData,
      images: images.map(img => img.url),
      status: 'draft' as 'draft' | 'published' | 'archived',
    };
    
    createPGListing(listingWithImages);
    
    toast({
      title: 'Draft Saved',
      description: 'Your PG listing has been saved as a draft',
    });
    
    // Navigate back to the appropriate page
    navigate('/');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the errors in the form',
        variant: 'destructive',
      });
      return;
    }
    
    // Add image URLs to the listing
    const listingWithImages = {
      ...formData,
      images: images.map(img => img.url),
      status: 'published' as 'draft' | 'published' | 'archived',
    };
    
    createPGListing(listingWithImages);
    
    toast({
      title: 'Success',
      description: 'Your PG listing has been created',
    });
    
    // Navigate back to the home page
    navigate('/');
  };
  
  return (
    <Layout>
      <div className="gradient-bg-purple min-h-screen">
        <div className="container px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">Create New PG Listing</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center">
                  <Building size={16} className="mr-2" />
                  PG Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter PG name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="address" className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full address of your PG"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              
              <div>
                <Label className="flex items-center mb-2">
                  <Users size={16} className="mr-2" />
                  Gender
                </Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={handleGenderChange}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="co-ed" id="co-ed" />
                    <Label htmlFor="co-ed">Co-ed</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="totalBeds" className="flex items-center">
                  <BedDouble size={16} className="mr-2" />
                  Total Beds
                </Label>
                <Input
                  id="totalBeds"
                  name="totalBeds"
                  type="number"
                  value={formData.totalBeds || ''}
                  onChange={handleNumberChange}
                  min="1"
                  className={errors.totalBeds ? 'border-red-500' : ''}
                />
                {errors.totalBeds && <p className="text-red-500 text-sm mt-1">{errors.totalBeds}</p>}
              </div>
              
              <div>
                <Label htmlFor="availableBeds" className="flex items-center">
                  <BedDouble size={16} className="mr-2" />
                  Available Beds
                </Label>
                <Input
                  id="availableBeds"
                  name="availableBeds"
                  type="number"
                  value={formData.availableBeds || ''}
                  onChange={handleNumberChange}
                  min="0"
                  className={errors.availableBeds ? 'border-red-500' : ''}
                />
                {errors.availableBeds && <p className="text-red-500 text-sm mt-1">{errors.availableBeds}</p>}
              </div>
              
              <div>
                <Label htmlFor="price" className="flex items-center">
                  <IndianRupee size={16} className="mr-2" />
                  Price per Bed (₹)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={handleNumberChange}
                  min="0"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              
              <div>
                <Label htmlFor="description" className="flex items-center">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your PG, including rules, facilities, etc."
                  className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              
              <div>
                <Label className="mb-2 block">Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map(amenity => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={(formData.amenities || []).includes(amenity.id)}
                        onCheckedChange={() => handleAmenityToggle(amenity.id)}
                      />
                      <Label htmlFor={amenity.id} className="flex items-center">
                        <span className="mr-2">{amenity.icon}</span>
                        {amenity.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Images</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {images.map(image => (
                    <div key={image.id} className="relative group">
                      <img 
                        src={image.url} 
                        alt="PG" 
                        className="w-24 h-24 object-cover rounded-md" 
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400"
                  >
                    <ImagePlus size={24} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  In a real app, this would allow uploading actual images.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleSaveDraft}
              >
                Save as Draft
              </Button>
              <Button 
                type="submit"
                className="bg-appPurple hover:bg-appPurple-dark"
              >
                <CheckCircle size={16} className="mr-2" />
                Publish Listing
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PGListingForm;
