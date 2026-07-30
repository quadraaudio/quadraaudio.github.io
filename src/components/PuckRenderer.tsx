'use client';

import React from 'react';
import { Render, Data } from '@puckeditor/core';
import { config } from '@/puck/config';

export function PuckRenderer({ data }: { data: Data }) {
  return <Render config={config} data={data} />;
}
