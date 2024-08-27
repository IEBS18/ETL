import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import awsS3 from "../assets/export/awsS3.png";

export default function AwsPopUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: '',
    region: '',
    endpointUrl: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <Card className="w-full max-w-lg mx-auto"> {/* Increased max-width to 'lg' */}
      {/* <CardHeader>
        <CardTitle className="flex items-center space-x-2">
            <img src={awsS3} alt="awsS3" className="h-8 w-8" />
          <span>Connect AWS S3</span>
        </CardTitle>
      </CardHeader> */}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accessKeyId">AWS Access Key ID</Label>
            <Input
              id="accessKeyId"
              name="accessKeyId"
              value={formData.accessKeyId}
              onChange={handleInputChange}
              placeholder="Enter your AWS Access Key ID"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secretAccessKey">AWS Secret Access Key</Label>
            <div className="relative">
              <Input
                id="secretAccessKey"
                name="secretAccessKey"
                type={showPassword ? 'text' : 'password'}
                value={formData.secretAccessKey}
                onChange={handleInputChange}
                placeholder="Enter your AWS Secret Access Key"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bucketName">Bucket Name</Label>
            <Input
              id="bucketName"
              name="bucketName"
              value={formData.bucketName}
              onChange={handleInputChange}
              placeholder="Enter your S3 Bucket Name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              placeholder="Enter your AWS Region"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endpointUrl">Endpoint URL</Label>
            <Input
              id="endpointUrl"
              name="endpointUrl"
              value={formData.endpointUrl}
              onChange={handleInputChange}
              placeholder="Enter your Endpoint URL"
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit}>Save</Button>
      </CardFooter>
    </Card>
  );
}
