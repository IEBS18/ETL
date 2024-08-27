import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from 'lucide-react';

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/awsextract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData),
      });

      const data = await response.json();
      console.log('Buckets:', data.buckets); // Handle the response data (e.g., display bucket names)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
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
