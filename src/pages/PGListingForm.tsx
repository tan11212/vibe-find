
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
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
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Building, MapPin, BedDouble, Users, IndianRupee, CheckCircle, ImagePlus, Trash2, Loader2 } from 'lucide-react';

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
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<Partial<PGListing>>({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    gender: 'co-ed',
    description: '',
    totalBeds: 0,
    availableBeds: 0,
    price: 0,
    amenities: [],
    status: 'draft',
  });
  
  const [images, setImages] = useState<{ id: string; file?: File; url: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newImages = Array.from(files).map(file => ({
      id: uuidv4(),
      file,
      url: URL.createObjectURL(file),
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };
  
  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // Revoke object URLs to prevent memory leaks
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove && !imageToRemove.file) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return filtered;
    });
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'PG name is required';
    }
    
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city?.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state?.trim()) {
      newErrors.state = 'State is required';
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
  
  const uploadImages = async (): Promise<string[]> => {
    const uploadPromises = images
      .filter(img => img.file) // Only upload new files
      .map(async (img) => {
        const file = img.file as File;
        const fileExt = file.name.split('.').pop();
        const filePath = `${user?.id}/${uuidv4()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('pg_images')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('pg_images')
          .getPublicUrl(filePath);
          
        return data.publicUrl;
      });
      
    return Promise.all(uploadPromises);
  };
  
  const saveListing = async (status: 'draft' | 'published'): Promise<void> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save a listing',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Upload images first
      const uploadedImageUrls = await uploadImages();
      
      // Combine existing image URLs with new uploaded ones
      const allImageUrls = [
        ...images.filter(img => !img.file).map(img => img.url),
        ...uploadedImageUrls
      ];
      
      const listingData = {
        owner_id: user.id,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip || null,
        gender: formData.gender,
        description: formData.description,
        total_beds: formData.totalBeds,
        available_beds: formData.availableBeds,
        price: formData.price,
        amenities: formData.amenities,
        images: allImageUrls,
        status: status,
      };
      
      const { data, error } = await supabase
        .from('pg_listings')
        .insert([listingData])
        .select();
        
      if (error) {
        throw error;
      }
      
      // Update local state too for immediate UI updates
      if (data && data[0]) {
        createPGListing({
          ...formData,
          id: data[0].id,
          ownerId: user.id,
          images: allImageUrls,
          status: status,
          createdAt: new Date(),
        });
      }
      
      toast({
        title: status === 'published' ? 'Listing Published' : 'Draft Saved',
        description: status === 'published' 
          ? 'Your PG listing has been published' 
          : 'Your PG listing has been saved as a draft',
      });
      
      // Navigate back to the listing page
      navigate('/pg-owner-listing');
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save listing',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveDraft = async () => {
    // For drafts, we don't need to validate all fields
    await saveListing('draft');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the errors in the form',
        variant: 'destructive',
      });
      return;
    }
    
    await saveListing('published');
  };
  
  return (
    <Layout>
      <div className="gradient-bg-purple min-h-screen">
        <div className="container px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/pg-owner-listing')}
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
                  placeholder="Street address of your PG"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className={errors.state ? 'border-red-500' : ''}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
                
                <div>
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                  />
                </div>
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
                  <label
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 cursor-pointer"
                  >
                    <input 
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <ImagePlus size={24} />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save as Draft
              </Button>
              <Button 
                type="submit"
                className="bg-appPurple hover:bg-appPurple-dark"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle size={16} className="mr-2" />}
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
