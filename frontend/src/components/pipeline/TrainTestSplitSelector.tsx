import React, { useState } from 'react';
import { Split } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { TrainTestSplitConfig, ColumnInfo } from '@/types/pipeline.types';

interface TrainTestSplitSelectorProps {
  columns: ColumnInfo[];
  onSplit: (config: TrainTestSplitConfig) => void;
  isLoading?: boolean;
}

export function TrainTestSplitSelector({ columns, onSplit, isLoading }: TrainTestSplitSelectorProps) {
  const [testSize, setTestSize] = useState(20);
  const [shuffle, setShuffle] = useState(true);
  const [stratify, setStratify] = useState(false);
  const [stratifyColumn, setStratifyColumn] = useState('');
  const [randomState, setRandomState] = useState(42);

  const categoricalColumns = columns.filter(col => col.type === 'categorical');

  const handleSplit = () => {
    const config: TrainTestSplitConfig = {
      testSize: testSize / 100,
      randomState,
      shuffle,
      stratify: stratify && !!stratifyColumn,
      stratifyColumn: stratify ? stratifyColumn : undefined,
    };

    onSplit(config);
  };

  const trainSize = 100 - testSize;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Split className="h-5 w-5" />
          Train-Test Split
        </CardTitle>
        <CardDescription>
          Split your dataset into training and testing sets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Split Representation */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Train ({trainSize}%)</span>
            <span>Test ({testSize}%)</span>
          </div>
          <div className="flex h-12 rounded-lg overflow-hidden border">
            <div 
              className="bg-blue-500 flex items-center justify-center text-white font-medium transition-all"
              style={{ width: `${trainSize}%` }}
            >
              {trainSize > 15 && `${trainSize}%`}
            </div>
            <div 
              className="bg-orange-500 flex items-center justify-center text-white font-medium transition-all"
              style={{ width: `${testSize}%` }}
            >
              {testSize > 15 && `${testSize}%`}
            </div>
          </div>
        </div>

        {/* Test Size Slider */}
        <div className="space-y-2">
          <Label htmlFor="test-size">
            Test Size: {testSize}%
          </Label>
          <Input
            id="test-size"
            type="range"
            min="10"
            max="50"
            value={testSize}
            onChange={(e) => setTestSize(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-slate-500">
            Recommended: 20-30% for most datasets
          </p>
        </div>

        {/* Random State */}
        <div className="space-y-2">
          <Label htmlFor="random-state">Random Seed</Label>
          <Input
            id="random-state"
            type="number"
            value={randomState}
            onChange={(e) => setRandomState(Number(e.target.value))}
            placeholder="42"
          />
          <p className="text-xs text-slate-500">
            Set a seed for reproducible splits
          </p>
        </div>

        {/* Shuffle */}
        <div className="flex items-center space-x-2">
          <input
            id="shuffle"
            type="checkbox"
            checked={shuffle}
            onChange={(e) => setShuffle(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          <Label htmlFor="shuffle" className="cursor-pointer">
            Shuffle data before splitting
          </Label>
        </div>

        {/* Stratification */}
        {categoricalColumns.length > 0 && (
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <input
                id="stratify"
                type="checkbox"
                checked={stratify}
                onChange={(e) => setStratify(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <Label htmlFor="stratify" className="cursor-pointer">
                Use stratified split
              </Label>
            </div>
            
            {stratify && (
              <div className="space-y-2">
                <Label htmlFor="stratify-column">Stratify Column</Label>
                <Select
                  id="stratify-column"
                  value={stratifyColumn}
                  onChange={(e) => setStratifyColumn(e.target.value)}
                >
                  <option value="">Select a column</option>
                  {categoricalColumns.map((col) => (
                    <option key={col.name} value={col.name}>
                      {col.name}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-slate-500">
                  Maintains class distribution in train/test sets
                </p>
              </div>
            )}
          </div>
        )}

        <Button 
          onClick={handleSplit} 
          disabled={isLoading || (stratify && !stratifyColumn)}
          className="w-full"
        >
          {isLoading ? 'Splitting...' : 'Split Dataset'}
        </Button>
      </CardContent>
    </Card>
  );
}
