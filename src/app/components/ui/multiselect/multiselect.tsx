import React, { useState } from 'react';
import { Select, Button } from 'antd';

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];

const App: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

  const handleShowSelectedItems = () => {
    console.log(selectedItems);
  };

  return (
    <section>
          <Select
            mode="multiple"
            placeholder="Inserted are removed"
            value={selectedItems}
            onChange={setSelectedItems}
            style={{ width: '30%' }}
            options={filteredOptions.map((item) => ({
              value: item,
              label: item,
            }))}
          />

          <Button type="primary" onClick={handleShowSelectedItems} style={{ marginTop: '10px' }}>
              Mostrar elementos seleccionados
          </Button>
    </section>
  );
};

export default App;