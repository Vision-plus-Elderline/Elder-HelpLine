import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface UserDetailsFormProps {
  onSubmit: (details: { firstName: string; lastName: string; phoneNumber: string; gender: string; state: string; city: string; designation: string; processAllocated: string; qualification: string;fatherName: string; }) => void;
  onCancel: () => void;
}

export const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ onSubmit, onCancel }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [designation, setDesignation] = useState('');
  const [processAllocated, setProcessAllocated] = useState('');
  const [qualification, setQualification] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fullName, setFullName] = useState('');
  const [empId, setEmpId] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
      if (user?.id) {
        // Fetch profile basic info
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, emp_id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        // Fetch detailed info if it exists
        const { data: details, error: detailsError } = await supabase
          .from('user_details')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (detailsError) {
          console.error('Error fetching user details:', detailsError);
        }

        // Set state with existing details if found
        if (details) {
          const d = details as any;
          setFirstName(d.first_name || '');
          setLastName(d.last_name || '');
          setPhoneNumber(d.phone_number || '');
          setGender(d.gender || '');
          setState(d.state || '');
          setCity(d.city || '');
          setDesignation(d.designation || '');
          setProcessAllocated(d.product_process || d.process_allocated || '');
          setQualification(d.qualification || '');
          setFatherName(d.father_name || '');
          setDateOfBirth(d.date_of_birth || '');
          setAddress(d.address || '');
        }

        // Fallback/Override with basic profile/metadata for name and emp_id if not in details
        const name = (user?.user_metadata?.full_name ?? '').trim();
        const employeeId = ((details as any)?.emp_id || user?.user_metadata?.emp_id || '').trim();
        
        setFullName(name);
        setEmpId(employeeId);
        
        // Only split name if firstName/lastName haven't been set from details
        if (name && !details) {
          const parts = name.split(/\s+/);
          if (parts.length > 0) {
            setFirstName(parts[0]);
            setLastName(parts.length > 1 ? parts.slice(1).join(' ') : '');
          }
        }
      }
    };
    getUser().catch(err => console.error('Failed to fetch user/profile:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!firstName || !lastName || !phoneNumber || !gender || !state || !city || !userId || !dateOfBirth || !fatherName || !processAllocated || !designation || !address || !qualification) {
      console.log('Validation failed - missing fields:', { 
        firstName, lastName, phoneNumber, gender, state, city, userId, dateOfBirth, 
        fatherName, processAllocated, designation, address, qualification 
      });
      alert('Please fill in all fields and ensure you are logged in.');
      return;
    }

    console.log('Attempting to upsert data for user:', userId);
    const payload: any = {
      user_id: userId,
      emp_id: empId,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      gender: gender,
      state: state,
      city: city,
      date_of_birth: dateOfBirth,
      father_name: fatherName,
      product_process: processAllocated,
      designation: designation,
      address: address,
      qualification: qualification,
      updated_at: new Date().toISOString(),
    };
    console.log('Payload:', payload);

    const { data, error } = await supabase
      .from('user_details')
      .upsert([payload], { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving user details:', error);
      alert(`Failed to save details: ${error.message}. If this persists, please ensure your database has the required columns (father_name, address, designation, qualification, process_allocated).`);
    } else {
      console.log('User details saved:', data);
      onSubmit({ firstName, lastName, phoneNumber, gender, state, city, designation, processAllocated, qualification,fatherName });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-center rounded-full px-4 sm:px-6 py-2 border-2 sm:border-4 border-green-300 text-green-600">Candidate Registration Form</h2>
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 p-2 sm:p-3 text-center text-gray-800">Enter Your Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name (from signup)</Label>
              <Input id="fullName" value={fullName || ''} disabled className="bg-gray-50 border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empId" className="text-sm font-medium text-gray-700">Employee ID (from signup)</Label>
              <Input id="empId" value={empId || ''}
              onChange={(e) => setEmpId(e.target.value)}
              required
              disabled={!!empId}
               className="bg-gray-50 border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
              <Input 
                id="firstName" 
                value={firstName || ''} 
                onChange={(e) => setFirstName(e.target.value)} 
                required 
                disabled={!!fullName}
                className="border-gray-200 focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
              <Input 
                id="lastName" 
                value={lastName || ''} 
                onChange={(e) => setLastName(e.target.value)} 
                required 
                // disabled={!!fullName}
                disabled={firstName === fullName.split(/\s+/)[0] && fullName.split(/\s+/).length > 1}
                className="border-gray-200 focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatherName" className="text-sm font-medium text-gray-700">Father Name</Label>
              <Input id="fatherName" value={fatherName || ''} onChange={(e) => setFatherName(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />   
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-sm font-medium text-gray-700">Date of Birth</Label>
              <Input id="dob" type="date" value={dateOfBirth || ''} onChange={(e) => setDateOfBirth(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
              <Input id="phoneNumber" type="tel" value={phoneNumber || ''} onChange={(e) => setPhoneNumber(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger className="border-gray-200 focus:ring-2 focus:ring-green-500">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Process Allocated</Label>
              <RadioGroup className="flex gap-6 mt-2" value={processAllocated} onValueChange={setProcessAllocated}>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="elderLine" id="r1" className="text-green-600 focus:ring-green-500" />
                  <Label htmlFor="r1" className="text-sm text-gray-600">ElderLine</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="other" id="r3" className="text-green-600 focus:ring-green-500" />
                  <Label htmlFor="r3" className="text-sm text-gray-600">Other</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Designation</Label>
              <RadioGroup className="flex gap-6 mt-2" value={designation} onValueChange={setDesignation}>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="co" id="des-co" className="text-green-600 focus:ring-green-500" />
                  <Label htmlFor="des-co" className="text-sm text-gray-600">CO</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="fro" id="des-fro" className="text-green-600 focus:ring-green-500" />
                  <Label htmlFor="des-fro" className="text-sm text-gray-600">FRO</Label>
                </div>
                 <div className="flex items-center gap-2">
                  <RadioGroupItem value="frl" id="des-frl" className="text-green-600 focus:ring-green-500" />
                  <Label htmlFor="des-frl" className="text-sm text-gray-600">FRL</Label>
                </div> <div className="flex items-center gap-2">
                  <RadioGroupItem value="tl" id="des-tl" className="text-green-600 focus:ring-green-500" />
                  <Label htmlFor="des-tl" className="text-sm text-gray-600">TL</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Qualification</Label>
              <Input id="qualification" value={qualification || ''} onChange={(e) => setQualification(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Address</Label>
              <Input id="address" value={address || ''} onChange={(e) => setAddress(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
              <Input id="city" value={city || ''} onChange={(e) => setCity(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
              <Input id="state" value={state || ''} onChange={(e) => setState(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onCancel} className="px-6 border-gray-200 hover:bg-gray-50">Cancel</Button>
            <Button type="submit" className="px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all active:scale-95">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
