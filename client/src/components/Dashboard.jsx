import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { addVisualize, getVisualize, getFilenames } from './visualize'; // Update the path as needed

const chartTypes = [
  { value: 'line', label: 'Line Chart', fields: ['xAxis', 'yAxis'] },
  { value: 'bar', label: 'Bar Chart', fields: ['xAxis', 'yAxis'] },
  // { value: 'pie', label: 'Pie Chart', fields: ['name', 'value'] },
  { value: 'area', label: 'Area Chart', fields: ['xAxis', 'yAxis'] },
];

function Dashboard() {
  const [selectedFilename, setSelectedFilename] = useState('');
  const [selectedChart, setSelectedChart] = useState(chartTypes[0]);
  const [fieldValues, setFieldValues] = useState({});
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');
  const [schemaFields, setSchemaFields] = useState({});
  const [xAxisOptions, setXAxisOptions] = useState([]);
  const [yAxisOptions, setYAxisOptions] = useState([]);

  useEffect(() => {
    if (selectedFilename) {
      try {
        const data = getVisualize();
        console.log('Fetched Data:', data);
        const nodeId = Object.keys(data).find(
          (id) => data[id]?.fileName === selectedFilename
        );
        if (nodeId) {
          const visualizeData = data[nodeId];
          const schema = visualizeData.schema || {};
          setSchemaFields(schema);

          const xAxisOptions = Object.keys(schema);
          const yAxisOptions = Object.keys(schema);

          setXAxisOptions(xAxisOptions);
          setYAxisOptions(yAxisOptions);
          
          setFieldValues({
            xAxis: '',
            yAxis: '',
            name: '',
            value: ''
          });
          setChartData(visualizeData.rows || []); // Use rows as chartData
          setError('');
        } else {
          setChartData(null);
        }
      } catch (e) {
        console.error('Error fetching data:', e);
        setError('Failed to load data');
      }
    } else {
      setChartData(null);
      setFieldValues({});
      setSchemaFields({});
    }
  }, [selectedFilename]);

  const handleFilenameChange = (value) => {
    setSelectedFilename(value);
  };

  const handleChartTypeChange = (value) => {
    const chart = chartTypes.find(c => c.value === value);
    setSelectedChart(chart);
  };

  const handleFieldChange = (field, value) => {
    setFieldValues(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleCreateChart = () => {
    setChartData(getVisualize()[selectedFilename]?.rows || null);
    setError('');
  };

const renderChart = () => {
  if (!chartData) return null;

  const { value: chartType } = selectedChart;
  const commonProps = {
    data: chartData,
    margin: { top: 5, right: 30, left: 20, bottom: 30 }, // Adjust bottom margin for label spacing
  };

  const xAxisLabel = selectedChart.fields.includes('xAxis') ? fieldValues.xAxis : 'X Axis';
  const yAxisLabel = selectedChart.fields.includes('yAxis') ? fieldValues.yAxis : 'Y Axis';

  switch (chartType) {
    case 'line':
    case 'area':
      const ChartComponent = chartType === 'line' ? LineChart : AreaChart;
      const DataComponent = chartType === 'line' ? Line : Area;
      return (
        <ChartComponent {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={fieldValues.xAxis || 'default'} 
            label={{ value: xAxisLabel }}
            tick={false} // Hide X-axis tick labels
          />
          <YAxis 
            // label={{ value: yAxisLabel, angle: -90, position: 'left', offset: 0 }}
          />
          <Tooltip />
          <Legend  className='mt-8'/>
          <DataComponent type="monotone" dataKey={fieldValues.yAxis} stroke="#8884d8" fill="#8884d8" />
        </ChartComponent>
      );
    case 'bar':
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={fieldValues.xAxis || 'default'} 
            label={{ value: xAxisLabel, position: 'bottom', offset: 0 }}
            tick={false} // Hide X-axis tick labels
          />
          <YAxis 
            label={{ value: yAxisLabel, angle: -90, position: 'left', offset: 0 }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey={fieldValues.yAxis} fill="#8884d8" />
        </BarChart>
      );
    case 'pie':
      return (
        <PieChart {...commonProps}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={fieldValues.value}
            nameKey={fieldValues.name}
            label
          />
          <Tooltip />
          <Legend />
        </PieChart>
      );
    default:
      return null;
  }
};

  const userID = localStorage.getItem('user_minex_id');

  const availableFilenames = getFilenames();
  const schemaFieldsArray = Object.keys(schemaFields);

  return (
    <div className="flex flex-col w-full">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Chart Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select onValueChange={handleFilenameChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select filename" />
              </SelectTrigger>
              <SelectContent>
                {availableFilenames.map((filename) => (
                  <SelectItem key={filename} value={filename}>
                    {filename}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleChartTypeChange}>
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
            </Select>
            {selectedFilename && selectedChart.fields.map((field) => (
              <Select key={field} onValueChange={(value) => handleFieldChange(field, value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${field}`} />
                </SelectTrigger>
                <SelectContent>
                  {field === 'xAxis' ? (
                    xAxisOptions.map((schemaField) => (
                      <SelectItem key={schemaField} value={schemaField}>
                        {schemaField}
                      </SelectItem>
                    ))
                  ) : (
                    yAxisOptions.map((schemaField) => (
                      <SelectItem key={schemaField} value={schemaField}>
                        {schemaField}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            ))}

            {/* <Button onClick={handleCreateChart} className="w-full">Create Chart</Button> */}
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      {chartData && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedChart.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;
