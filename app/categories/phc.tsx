import React from 'react';
import { CategoryPage } from '@/src/components/CategoryPage';

export default function PHCScreen() {
  return (
    <CategoryPage
      id="2"
      name="Health PHC"
      fullName="Primary Health Care"
      description="Basic health services and facilities at the community level. PHCs serve as the first point of contact for individuals and families, providing essential healthcare services including preventive, promotive, curative, and rehabilitative care."
      icon="🏥"
      color="#2196F3"
    />
  );
}
