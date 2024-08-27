import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import mysql from "../assets/export/mysql.png";

export default function AwsPopUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    database: "",
    username: "",
    password: "",
    host: "",
    port: 23666,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      {" "}
      {/* Increased max-width to 'lg' */}
      {/* <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <img src={mysql} alt="mysql" className="h-8 w-8" />
          <span>Connect MySql Server</span>
        </CardTitle>
      </CardHeader> */}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="database">Database</Label>
            <Input
              id="database"
              name="database"
              value={formData.database}
              onChange={handleInputChange}
              placeholder="Enter your Sql Database"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your Username"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your S3 Bucket Name"
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
          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              name="host"
              value={formData.host}
              onChange={handleInputChange}
              placeholder="Enter your Host"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              name="port"
              value={formData.port}
              onChange={handleInputChange}
              placeholder="Enter your Endpoint URL"
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
