'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/SideBar';
import { DataTable } from '@/components/usages/DataTable';
import { columns } from './columns';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

const plans = [
  {
    name: 'Youth Annual Plan',
    price: '$100.00',
    benefits: 'Summarizes key plan benefits',
    eligibility: 'Under-19',
  },
  {
    name: 'Knight premium pack',
    price: '$100.00',
    benefits: '-',
    eligibility: 'Under-19',
  },
  {
    name: 'Grandmaster plan',
    price: '$100.00',
    benefits: '-',
    eligibility: 'Under-19',
  },
  {
    name: 'Pawn pack',
    price: '$100.00',
    benefits: 'Summarizes key plan benefits',
    eligibility: 'Under-19',
  },
  {
    name: 'Knight premium pack',
    price: '$100.00',
    benefits: 'Summarizes key plan benefits',
    eligibility: '-',
  },
  {
    name: 'Grandmaster plan',
    price: '$100.00',
    benefits: '-',
    eligibility: 'Under-19',
  },
  {
    name: 'Grandmaster plan',
    price: '$100.00',
    benefits: 'Summarizes key plan benefits',
    eligibility: 'Under-19',
  },
  {
    name: 'Knight premium pack',
    price: '$100.00',
    benefits: 'Summarizes key plan benefits',
    eligibility: '-',
  },
  {
    name: 'Grandmaster plan',
    price: '$100.00',
    benefits: '-',
    eligibility: 'Under-19',
  },
  {
    name: 'Grandmaster plan',
    price: '$100.00',
    benefits: 'Summarizes key plan benefits',
    eligibility: '-',
  },
];

export default function Memberships() {
  const [search, setSearch] = useState('');

  // const filteredPlans = plans.filter((plan) =>
  //   plan.name.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-auto p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-red-600">
            <FileText size={20} />
          </span>{' '}
          Memberships
        </h1>
        <div className="border-b my-4">
          <Button variant="link" className="text-red-600 font-semibold">
            Plans
          </Button>
        </div>

        <div className="flex gap-4 mb-4 items-end">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <div className="w-36">
            <Label className="ml-4">Plan Id</Label>
            <Input placeholder="Plan ID" className="w-36 h-8" />
          </div>
          <Button className="bg-red-600 text-white ml-auto">
            Create Plans
          </Button>
        </div>

        <DataTable columns={columns} data={plans} />
      </main>
    </div>
  );
}
