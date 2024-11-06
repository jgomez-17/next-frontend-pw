import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiciosSelectProps {
    tipo: string;
    servicioSeleccionado: string;
    setServicioSeleccionado: (value: string) => void;
}

const ServiciosSelect: React.FC<ServiciosSelectProps> = ({ tipo, servicioSeleccionado, setServicioSeleccionado }) => {
    const preciosServiciosPorTipo: Record<string, { services: Record<string, number>, adicionales: Record<string, number> }> = {
        Automovil: {
            services: {
                "Brillado Manual": 60000,
                "Brillado Rotorbital": 80000,
                "Completo Plus": 30000,
                "Ceramico": 500000,
                "Desmanchado de pintura": 160000,
                "Hidratacion de interior": 60000,
                "Limpieza cogineria de cuero": 90000,
                "Limpieza cogineria de paño": 80000,
                "Polichado": 140000,
                "Polichado Americano": 180000,
                "Plasticina": 170000,
                "Porcelanizado": 500000,
            },
            adicionales: {
                "Descontaminacion conductos de aire": 30000,
                "Limpieza de motor": 30000,
                "Restauracion de partes negras": 60000,
            }
        },
        Camioneta: {
            services: {
                "Brillado Manual": 70000,
                "Brillado Rotorbital": 110000,
                "Completo Plus": 35000,
                "Ceramico": 600000,
                "Desmanchado de pintura": 180000,
                "Hidratacion de interior": 70000,
                "Polichado": 150000,
                "Polichado Americano": 210000,
                "Limpieza cogineria de cuero": 110000,
                "Limpieza cogineria de paño": 90000,
                "Plasticina": 190000,
                "Porcelanizado": 600000,
            },
            adicionales: {
                "Descontaminacion conductos de aire": 30000,
                "Limpieza de motor": 30000,
                "Restauracion de partes negras": 70000,
            }
        },
        // Otros servicios para camionetas...
    };

    const [preciosServicios, setPreciosServicios] = useState<Record<string, number>>(
        preciosServiciosPorTipo[tipo]
            ? { ...preciosServiciosPorTipo[tipo].services, ...preciosServiciosPorTipo[tipo].adicionales }
            : {}
    );

    useEffect(() => {
        const nuevosPrecios = preciosServiciosPorTipo[tipo]
            ? { ...preciosServiciosPorTipo[tipo].services, ...preciosServiciosPorTipo[tipo].adicionales }
            : {};
        if (JSON.stringify(nuevosPrecios) !== JSON.stringify(preciosServicios)) {
            setPreciosServicios(nuevosPrecios);
        }
    }, [tipo]);

    return (
        <Select
            value={servicioSeleccionado}
            onValueChange={(value) => setServicioSeleccionado(value)}
        >
            <SelectTrigger className="w-[350px] h-9 my-2 rounded-none">
                <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
                <div>
                    {Object.entries(preciosServiciosPorTipo[tipo]?.services || {}).map(([nombreServicio, costo]) => (
                        <SelectItem key={`normal-${nombreServicio}`} value={`${nombreServicio} - $${costo}`}>
                            {nombreServicio} - ${costo.toLocaleString('es-CO')}
                        </SelectItem>
                    ))}
                </div>
                <div>
                    <p className="text-sm font-bold ml-8 my-3">Servicios Adicionales</p>
                    {Object.entries(preciosServiciosPorTipo[tipo]?.adicionales || {}).map(([nombreServicio, costo]) => (
                        <SelectItem key={`adicional-${nombreServicio}`} value={`${nombreServicio} - $${costo}`}>
                            {nombreServicio} - ${costo.toLocaleString('es-CO')}
                        </SelectItem>
                    ))}
                </div>
            </SelectContent>
        </Select>
    );
};

export default ServiciosSelect;
