
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Building, MapPin, Users, Wifi, Coffee, ArrowLeft, Bed, Home, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define form schema
const formSchema = z.object({
  pgName: z.string().min(3, { message: "PG name must be at least 3 characters" }),
  address: z.string().min(10, { message: "Please provide a complete address" }),
  gender: z.enum(["male", "female", "co-ed"], { 
    required_error: "Please select the gender type for your PG" 
  }),
  description: z.string().min(20, { message: "Description should be at least 20 characters" }),
  totalBeds: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Please enter a valid number of beds"
  }),
  availableBeds: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Please enter a valid number of available beds"
  }),
  price: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Please enter a valid price"
  }),
});

const PGOwnerListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [amenities, setAmenities] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pgName: "",
      address: "",
      gender: "co-ed",
      description: "",
      totalBeds: "",
      availableBeds: "",
      price: "",
    },
  });
  
  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // For now, just show a toast and navigate back
    toast({
      title: "PG listing created successfully!",
      description: "Your property has been listed and is now visible to potential tenants.",
    });
    
    // In a real application, we would save this data to a database
    console.log({ ...values, amenities });
    
    navigate('/');
  };
  
  const handleNext = async () => {
    const result = await form.trigger();
    if (result) {
      setStep(2);
    }
  };
  
  const commonAmenities = [
    { id: "wifi", name: "WiFi", icon: <Wifi size={18} /> },
    { id: "ac", name: "Air Conditioning", icon: "❄️" },
    { id: "meals", name: "Meals Included", icon: <Coffee size={18} /> },
    { id: "laundry", name: "Laundry", icon: "🧺" },
    { id: "tv", name: "TV", icon: "📺" },
    { id: "furniture", name: "Furnished", icon: "🛋️" },
    { id: "geyser", name: "Hot Water", icon: "🚿" },
    { id: "fridge", name: "Refrigerator", icon: "❄️" },
    { id: "security", name: "24x7 Security", icon: "🔒" },
    { id: "parking", name: "Parking", icon: "🚗" },
  ];
  
  return (
    <Layout>
      <div className="gradient-bg-purple min-h-screen">
        <div className="container px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => step === 1 ? navigate('/roommate-finder') : setStep(1)}
            >
              <ArrowLeft size={16} className="mr-1" />
              {step === 1 ? 'Back' : 'Previous'}
            </Button>
            <div className="text-sm">
              Step {step} of 2
            </div>
          </div>
          
          <div className="w-full bg-gray-200 h-1 rounded-full mb-4">
            <div 
              className="bg-appPurple h-1 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Building size={22} className="mr-2 text-appPurple" />
                List Your PG Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {step === 1 && (
                    <>
                      <FormField
                        control={form.control}
                        name="pgName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PG Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Sunshine PG" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complete Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter full address with landmarks" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PG Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="male" id="male" />
                                  <Label htmlFor="male">Male only</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="female" id="female" />
                                  <Label htmlFor="female">Female only</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="co-ed" id="co-ed" />
                                  <Label htmlFor="co-ed">Co-ed</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Tell potential tenants about your PG" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="button" 
                        className="w-full bg-appPurple hover:bg-appPurple-dark mt-4"
                        onClick={handleNext}
                      >
                        Next Step
                      </Button>
                    </>
                  )}
                  
                  {step === 2 && (
                    <>
                      <div className="grid gap-4 grid-cols-2">
                        <FormField
                          control={form.control}
                          name="totalBeds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Beds</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" placeholder="Total beds" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="availableBeds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Available Beds</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" placeholder="Available beds" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price per Bed (₹/month)</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" placeholder="Enter price" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <Label>Amenities</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {commonAmenities.map((amenity) => (
                            <Button
                              key={amenity.id}
                              type="button"
                              variant={amenities.includes(amenity.id) ? 'default' : 'outline'}
                              className={`justify-start ${
                                amenities.includes(amenity.id) ? 'bg-appPurple hover:bg-appPurple-dark' : ''
                              }`}
                              onClick={() => toggleAmenity(amenity.id)}
                            >
                              <span className="mr-2">{amenity.icon}</span>
                              {amenity.name}
                              {amenities.includes(amenity.id) && <Check className="ml-auto" size={16} />}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-appPurple hover:bg-appPurple-dark mt-4"
                      >
                        Submit Listing
                      </Button>
                    </>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PGOwnerListing;
