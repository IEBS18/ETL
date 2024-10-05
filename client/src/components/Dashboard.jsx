import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { Lightbulb } from 'lucide-react';

const chartTypes = [
  { value: 'line', label: 'Line Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'pie', label: 'Pie Chart' },
];

function Dashboard() {
  const [filenames, setFilenames] = useState([]);
  const [columns, setColumns] = useState(null);
  const [selectedFilename, setSelectedFilename] = useState('');
  const [selectedChart, setSelectedChart] = useState(chartTypes[0].value);
  const [prompt, setPrompt] = useState('');
  const [chartData, setChartData] = useState(null);
  const [insights, setInsights] = useState('');
  const [summary, setSummary] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [isDetailedView, setIsDetailedView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const handleToggleView = () => {
    setIsDetailedView((prev) => !prev);
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/getransformedfiles`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.filenames)) {
          const fileData = data.filenames.map(path => ({
            fullPath: path,
            filename: path.split('/').pop(),
          }));
          setFilenames(fileData);
        } else {
          console.error('Fetched data is not an array:', data);
          setFilenames([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching filenames:', error);
        setFilenames([]);
      });
  }, []);

  const handleCreateChart = () => {
    setisLoading(true);
    const filePath = filenames.find(file => file.filename === selectedFilename)?.fullPath;

    if (!filePath) {
      console.error('Selected file path not found');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/create-chart`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: filePath,
        chartType: selectedChart,
        prompt: prompt,
      }),
    })
      .then((res) => res.json())
      .then((data) => {

        if (data.rows) {
          setChartData(data.rows);
          console.log(data.rows);
          setColumns(data.columns);
          console.log(data.columns);
          setInsights((data.insights.insights));
          setSummary(data.insights.summary);
          setSqlQuery(data.query);// Log the response data
        }
        console.log(summary);
        setisLoading(false);
      })
      .catch((error) => console.error('Error creating chart:', error));
  };

  const renderChart = () => {
    if (!chartData) return null;

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 40, left: 40, bottom: 20 },
    };

    console.log(selectedChart);

    switch ('line') {

      case 'line':
        console.log('ok');
        console.log(chartData)
        console.log(columns);
        return (
          <LineChart {...commonProps} >
            {/* <CartesianGrid /> */}
            <XAxis dataKey={columns[0]} label={{ value: columns[0], position: "bottom", offset: 5 }} />
            <YAxis label={{ value: columns.slice(1), angle: -90, position: "left", offset: 35 }} />
            {/* </YAxis> */}
            <Tooltip />
            {/* <Legend /> */}
            <Line type="monotone" dataKey={columns[1]} stroke="#8884d8" />
            <Line type="monotone" dataKey={columns[2]} stroke="#000" />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={columns[0]} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={columns[1]} fill="#8884d8" />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey={columns[1]} nameKey={columns[0]} label />
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Create Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row space-x-4">
            <Select onValueChange={setSelectedFilename}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select filename" />
              </SelectTrigger>
              <SelectContent>
                {filenames.length > 0 ? (
                  filenames.map((file) => (
                    <SelectItem key={file.fullPath} value={file.filename}>
                      {file.filename}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled> No files available</SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* <Select onValueChange={setSelectedChart}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map((chart) => (
                  <SelectItem key={chart.value} value={chart.value}>
                    {chart.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            <Input
              placeholder="Enter your prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full"
            />

            <Button
              onClick={handleCreateChart}
              className="w-full"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? 'Creating...' : 'Create Chart'} {/* Update text to "Creating..." */}
            </Button>
          </div>
        </CardContent>
      </Card>

      {chartData && (
        <Card className='h-full'>
          <CardHeader>
            {/* <CardTitle>Generated Chart</CardTitle> */}
          </CardHeader>
          <CardContent className='flex flex-row'>
            <div className="w-1/2 justify-center h-[400px] sticky top-10 m-2">
              <h1 className='text-2xl font-bold mb-2'>Generated Chart</h1>
              <ResponsiveContainer width="100%" height="100%" className='justify-center rounded-lg border bg-background md:shadow-xl p-2'>
                {renderChart()}
              </ResponsiveContainer>
            </div>
            <div className='w-1/2 h-full pt-12 '>
              <div className='rounded-lg border bg-background md:shadow-xl p-2 mb-2'>
                <h1 className='text-xl font-bold'>Generated SQL Query: </h1>
                <p>{sqlQuery}</p>
              </div>
              <div className='rounded-lg border bg-background md:shadow-xl p-2'>
                {/* <ReactMarkdown>{insights}</ReactMarkdown> */}
                <h3 className="font-bold">Summary:</h3>
                <ReactMarkdown>{summary}</ReactMarkdown>
                {/* <p>{summary}</p> */}
                <div className='flex justify-center'>
                  <Button onClick={() => setIsOpen(true)} className="mt-2 flex items-center">
                    <Lightbulb className="mr-2" /> {/* Lightbulb icon with margin */}
                    Understand Why
                  </Button>
                </div>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="hidden">Open Insights</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px] max-h-[400px] overflow-y-auto">
                  <DialogHeader>
                    {/* <DialogTitle>Detailed Insights</DialogTitle> */}
                    <DialogDescription>
                      Insights based on your data analysis.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <ReactMarkdown>{insights}</ReactMarkdown>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;
