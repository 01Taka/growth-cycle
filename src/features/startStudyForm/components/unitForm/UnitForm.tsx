import React, { useState } from 'react';
import AutoFillInput from './AutoFillInput';

interface UnitFormProps {}

export const UnitForm: React.FC<UnitFormProps> = ({}) => {
  const [unitText, setUnitText] = useState('');

  return (
    <div>
      <AutoFillInput
        autoFills={['abc', 'efg', 'hij']}
        value={unitText}
        onChange={setUnitText}
        onCreateNewAutoFill={(v) => console.log(v)}
      />
    </div>
  );
};
