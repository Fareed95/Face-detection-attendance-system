import { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Building2, Globe, MapPin, Briefcase, Calendar, Phone, Image, FileText, Save, LucideIcon } from "lucide-react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  icon: LucideIcon;
  required?: boolean;
  placeholder?: string;
}

const InputField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  icon: Icon, 
  required = true, 
  placeholder 
}: InputFieldProps) => (
  <div className="space-y-2">
    <label className="flex items-center space-x-2 text-sm text-neutral-300">
      <Icon className="w-4 h-4 text-neutral-400" />
      <span>{label}</span>
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/20 transition-all duration-200"
    />
  </div>
);

export default function OrgSettings() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "remote",
    industry: "",
    founded_at: "",
    contact_phone: "",
    logo: null as File | null,
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const getFullLogoUrl = (logoPath: string) => {
    if (!logoPath) return null;
    // If it's already a full URL, return as is
    if (logoPath.startsWith('http')) return logoPath;
    // Otherwise, construct the full URL
    return `http://localhost:8000${logoPath}`;
  };

  // Fetch existing company data when component mounts
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.log("no token")
          return;
        }
        const response = await fetch('http://localhost:8000/api/user', {
          method: 'GET',
          headers: {
            "Authorization": token,
            'Content-Type': "application/json",
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          setError('Please login to access this page');
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        console.log("Fetched user data:", userData);

        const company = userData.companies?.[0];
        if (company) {
          console.log("Found company data:", company);
          setCompanyId(company.id);
          setFormData({
            name: company.name || "",
            description: company.description || "",
            website: company.website || "",
            location: company.location || "",
            industry: company.industry || "",
            founded_at: company.founded_at || "",
            contact_phone: company.contact_phone || "",
            logo: null
          });
          // Set the logo URL if it exists
          if (company.logo) {
            const fullLogoUrl = getFullLogoUrl(company.logo);
            setLogoUrl(fullLogoUrl);
          }
        } else {
          setError('No company data found');
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
        setError('Failed to load company data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
      // Create a temporary URL for preview
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log("no token");
        return;
      }

      // Create the request body as a regular object
      const requestData = {
        name: formData.name,
        description: formData.description,
        website: formData.website,
        location: formData.location,
        industry: formData.industry,
        founded_at: formData.founded_at,
        contact_phone: formData.contact_phone
      };

      // Send PATCH request to update company data
      const response = await fetch(`http://localhost:8000/api/companies/${companyId}/`, {
        method: 'PATCH',
        headers: {
          "Authorization": token,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData)
      });

      if (response.status === 401) {
        alert('Please login to update settings');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Settings updated:', result);

      // If there's a logo to upload, do it in a separate request
      if (formData.logo) {
        const logoData = new FormData();
        logoData.append('logo', formData.logo);

        const logoResponse = await fetch(`http://localhost:8000/api/companies/${companyId}/`, {
          method: 'PATCH',
          headers: {
            "Authorization": token,
          },
          credentials: 'include',
          body: logoData
        });

        if (!logoResponse.ok) {
          console.error('Error uploading logo:', await logoResponse.text());
        } else {
          const updatedCompany = await logoResponse.json();
          if (updatedCompany.logo) {
            const fullLogoUrl = getFullLogoUrl(updatedCompany.logo);
            setLogoUrl(fullLogoUrl);
          }
        }
      }

      alert('Organization settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-neutral-600 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-neutral-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md">
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Settings</h3>
          <p className="text-neutral-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      {/* <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Organization Settings</h2>
          <p className="text-neutral-400 mt-1">Manage your organization's profile and preferences</p>
        </div>
      </div> */}

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Organization Profile</h3>
          
          {/* Logo Upload */}
          <div className="mb-8">
            <div className="flex items-start space-x-6">
              {(logoUrl || formData.logo) ? (
                <div className="relative group">
                  <img 
                    src={logoUrl || (formData.logo ? URL.createObjectURL(formData.logo) : '')}
                    alt="Company Logo"
                    className="w-24 h-24 rounded-xl object-cover border-2 border-neutral-700 group-hover:border-purple-500/50 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer text-xs text-white px-3 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700/80">
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-neutral-700 flex items-center justify-center bg-neutral-800/50 group-hover:border-purple-500/50 transition-colors">
                    <Image className="w-8 h-8 text-neutral-600" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <span className="text-xs text-neutral-400 hover:text-white transition-colors">Upload Logo</span>
                    </label>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-300 mb-2">Company Logo</label>
                <p className="text-xs text-neutral-500">Recommended: 400x400px or larger, maximum 2MB</p>
                <p className="text-xs text-neutral-400 mt-1">Supported formats: PNG, JPG, GIF</p>
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              icon={Building2}
              placeholder="Enter company name"
            />

            <InputField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              type="url"
              icon={Globe}
              placeholder="https://example.com"
            />

            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              icon={MapPin}
              placeholder="City, Country"
            />

            <InputField
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              icon={Briefcase}
              placeholder="e.g. Technology"
            />

            <InputField
              label="Founded Date"
              name="founded_at"
              value={formData.founded_at}
              onChange={handleInputChange}
              type="date"
              icon={Calendar}
            />

            <InputField
              label="Contact Phone"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
              type="tel"
              icon={Phone}
              placeholder="+1 (234) 567-8900"
            />

            {/* Description - Full Width */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="flex items-center space-x-2 text-sm text-neutral-300">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/20 transition-all duration-200"
                placeholder="Tell us about your organization..."
              />
            </div>
          </div>
        </motion.section>

        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveSettings}
            disabled={isSaving}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg bg-purple-500 text-white font-medium transition-all duration-200
              ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-600'}`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
} 