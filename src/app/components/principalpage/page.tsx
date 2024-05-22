'use client'

import React from 'react';
import { Tabs } from 'antd';
import OrdenesEnCurso from '@/app/dashboard/enCurso/page';
import OrdenesPorPagar from '@/app/dashboard/porPagar/page';
import CardsStates from './cardsStates/page';
import Drawerform from '@/app/components/ui/drawerform/drawer';

const App: React.FC = () => (
    <>
        <CardsStates />
        <Tabs
        className='mt-20 w-11/12 m-auto'
        defaultActiveKey="1"
        items={[
        {
            key: "1",
            label: "Ordenes en curso",
            children: <OrdenesEnCurso />,
        },
        {
            key: "2",
            label: "Ordenes por pagar",
            children: <OrdenesPorPagar />,
        },
        {
            key: "3",
            label: "Ordenes terminadas",
            children: "Hola",
        },
        ]}
    />
    </>
);

export default App;