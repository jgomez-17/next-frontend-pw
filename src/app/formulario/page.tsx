"use client"
import React, { useState, useEffect } from 'react';
import './ordenForm.css'
import { FaPlus } from "react-icons/fa";
import { GrNext } from "react-icons/gr";
import { IoChevronBackSharp } from "react-icons/io5";
import { App, Button, Space } from 'antd';


const Formulario = () => {

  // SECCIONES
  const [seccion, setSeccion] = useState<number>(1); // Estado para controlar qué sección se muestra

  const avanzarSeccion = () => {
    if (seccion === 1 && !tipo) {
      alert("Por favor selecciona un tipo de vehículo.");
      return;
    }
    setSeccion(seccion + 1);
  };

  const retrocederSeccion = () => {
    setSeccion(seccion - 1);
  };

  // Estado para los datos del vehiculo
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [tipo, setTipo] = useState('');
  const [color, setColor] = useState('');
  const [llaves, setLlaves] = useState(false);
  const [observaciones, setObservaciones] = useState('');

  // Estado para los datos del cliente
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [correoCliente, setCorreoCliente] = useState('');

  // Estado para los datos del servicio
  const [servicios, setServicios] = useState<{ nombre: string, costo: number}[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>('');
  const [nombresServicios, setNombresServicios] = useState<string>(''); 
  const [descuento, setDescuento] = useState<number>(0); // Nuevo estado para el descuento

    // Definir precios de servicios por tipo de vehículo
  const preciosServiciosPorTipo: Record<string, Record<string, number>> = {
    Automovil: {
      "Brillado Manual": 60000,
      "Brillado Rotorbital":80000,
      "Completo Plus": 30000,
      "Ceramico":500000,
      "Descontaminacion conductos de aire":30000,
      "Desmanchado de pintura":160000,
      "Hidratacion de interior":60000,
      "Limpieza cogineria de cuero":90000,
      "Limpieza cogineria de paño":80000,
      "Limpieza de motor":30000,
      "Polichado":140000,
      "Polichado Americano":180000,
      "Plasticina":170000,
      "Porcelanizado":500000,
      "Restauracion de partes negras":60000,
      // Otros servicios para automóviles...
    },
    Camioneta: {
      "Brillado Manual": 70000,
      "Brillado Rotorbital":110000,
      "Completo Plus": 35000,
      "Ceramico":600000,
      "Descontaminacion conductos de aire":30000,
      "Desmanchado de pintura":180000,
      "Hidratacion de interior":70000,
      "Polichado":150000,
      "Polichado Americano":210000,
      "Limpieza cogineria de cuero":110000,
      "Limpieza cogineria de paño":90000,
      "Limpieza de motor":30000,
      "Plasticina":190000,
      "Porcelanizado":600000,
      "Restauracion de partes negras":70000,
      // Otros servicios para camionetas...
    },
  };

  const [preciosServicios, setPreciosServicios] = useState<Record<string, number>>(
    preciosServiciosPorTipo[tipo] || {}
  );

  useEffect(() => {
    setPreciosServicios(preciosServiciosPorTipo[tipo] || {});
  }, [tipo]);
  

  const costoServicios: number = servicios.reduce((total, servicio) => {
    return total + servicio.costo;
  }, 0);

  const costoConDescuento: number = costoServicios - descuento; // Calcula el costo con el descuento

  // Manejar la adición de un servicio seleccionado de un solo nombre
  const handleAgregarServicio = () => {
    if (servicioSeleccionado) {
      const servicioNombre = servicioSeleccionado.split(' - ')[0]; // Obtener solo el nombre del servicio
      const servicioExistente = servicios.find(servicio => servicio.nombre === servicioNombre);
      if (!servicioExistente) {
        const costo = parseFloat(servicioSeleccionado.split(' - ')[1].replace('$', ''));
        setServicios([...servicios, { nombre: servicioNombre, costo }]);
        setNombresServicios(prev => prev ? prev + ', ' + servicioNombre : servicioNombre); 
        setServicioSeleccionado(''); // Restablecer la selección
      }
    }
  };

    // Maneja la eliminación de un servicio seleccionado para solo nombre
  const handleRemoveServicio = (nombre: string) => {

    const serviciosFiltrados = servicios.filter(servicio => servicio.nombre !== nombre);
    setServicios(serviciosFiltrados);
    // setServicios(servicios.filter(servicio => servicio.nombre !== nombre));
    const nuevosNombres = serviciosFiltrados.map(servicio => servicio.nombre).join('+');
    setNombresServicios(nuevosNombres);
  };

  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

      // Validar que los campos obligatorios estén llenos
  if (!placa || !marca || !tipo || !color || !nombre || !celular) {
    alert("Por favor completa los campos obligatorios.");
    return;
  }

    // Validar que la placa sea valida
    if (placa.length !== 7) {
      alert("Por favor ingresa una placa válida");
      return;
    }

  // Validar si al menos un servicio está seleccionado
  if (servicios.length === 0) {
    alert("Por favor selecciona al menos un servicio.");
    return;
  }

    // Validar que el número de teléfono tenga exactamente 10 dígitos
  if (celular.length !== 10) {
    alert("Por favor ingresa un número de teléfono válido");
    return;
  }
  
    // Objeto de datos a enviar
     const dataOrdens = {
      placa: placa,
      marca: marca,
      tipo: tipo,
      color: color,
      llaves: llaves,
      observaciones: observaciones,
      nombre: nombre,
      celular: parseInt(celular),
      // correo: correoCliente,
      nombre_servicios: nombresServicios,
       servicios: servicios.map(servicio => ({
         nombre_servicio: servicio.nombre,
         costo: servicio.costo
       })),
      costo: costoConDescuento
    };
    
      try {
         const responseOrdenes= await fetch('http://localhost:4000/api/ordenes', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({data: dataOrdens})
         });
    
         if (!responseOrdenes.ok) {
          console.error('Error en la petición:', responseOrdenes.statusText);
        } else {
          
          // setPlaca('');
          // setMarca('');
          // setTipo('');
          // setColor('');
          // setLlaves(false);
          // setObservaciones('');
          // setNombre('');
          // setCelular('');
          // setCorreoCliente('');
          // setServicios([]);
          // setDescuento(0);
          // setNombresServicios('');
      
          console.log('orden generada', dataOrdens);
          alert('orden generada');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    }

  return (
    
    <form id='orden' onSubmit={handleSubmit}>
      {seccion === 1 && (
        <>
          <fieldset className='datos-vehiculo'>
            <legend>Datos del Vehículo</legend>
            <label>
              <span>Placa
              <span className='text-red-500'>*</span>
              </span>
              
              <input 
                className='uppercase' 
                type="text" 
                value={placa} 
                onChange={(e) => {

                let inputValue = e.target.value.toUpperCase();
    
                  inputValue = inputValue.replace(/[^A-Z, 0-9]/g, '');

                  if (inputValue.length > 3) {
                  inputValue = inputValue.slice(0, 3) + '-' + inputValue.slice(3);
                  }

                  inputValue = inputValue.replace(/[^A-Z0-9\-]/g, '');

                  if (inputValue.includes('-')) {
                    const parts = inputValue.split('-');
                    parts[1] = parts[1].replace(/[^0-9]/g, '');
                    inputValue = parts.join('-');
                  }

                  inputValue = inputValue.slice(0, 7);

                  setPlaca(inputValue);
                }} 
                maxLength={7}
                required 
              />

            </label>
            <label>
              <span>Marca</span>
              <select value={marca} onChange={(e) => setMarca(e.target.value)} required>
                <option value="" disabled selected>Seleccionar</option>
                <option value="Audi">Audi</option>
                <option value="BMW">BMW</option>
                <option value="Cadillac">Cadillac</option>
                <option value="Citroen">Citroen</option>
                <option value="Chery">Chery</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Dodge">Dodge</option>
                <option value="Fiat">Fiat</option>
                <option value="Ford">Ford</option>
                <option value="Honda">Honda</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Jeep">Jeep</option>
                <option value="Jaguar">Jaguar</option>
                <option value="Kia">Kia</option>
                <option value="Land Rober">Land Rober</option>
                <option value="Lexus">Lexus</option>
                <option value="Mazda">Mazda</option>
                <option value="Mercedes">Mercedes</option>
                <option value="Mitsubishi">Mitsubishi</option>
                <option value="Mini Cooper">Mini Cooper</option>
                <option value="Nissan">Nissan</option>
                <option value="Toyota">Toyota</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Peugeot">Peugeot</option>
                <option value="Porsche">Porsche</option>
                <option value="Renault">Renault</option>
                <option value="Rolls Royce">Rolls Royce</option>
                <option value="Subaru">Subaru</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Volvo">Volvo</option>
                <option value="Otro">Otro</option>
              </select>
            </label>
            <label>
              <span>Tipo</span>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                <option value="" disabled selected>Seleccionar</option>
                <option value="Automovil">Automovil</option>
                <option value="Camioneta">Camioneta</option>
              </select>
            </label>

            <label>
              <span>Color</span>
              <select value={color} onChange={(e) => setColor(e.target.value)} required>
              <option value="" disabled selected>
                Seleccione
              </option>
                <option value="Negro">Negro</option>
                <option value="Blanco">Blanco</option>
                <option value="Azul">Azul</option>
                <option value="Amarillo">Amarillo</option>
                <option value="Beige">Beige</option>
                <option value="Gris">Gris</option>
                <option value="Morado">Morado</option>
                <option value="Plateado">Plateado</option>
                <option value="Rojo">Rojo</option>
                <option value="Vinotinto">Vinotinto</option>
                <option value="Verde">Verde</option>
              </select>
            </label>
            <label>
              <span> Deja llaves? </span>
              <input className='w-6' type="checkbox" checked={llaves} onChange={(e) => setLlaves(e.target.checked)} />
            </label>
            <label>
            <span>Descripción</span>
              <textarea className='textarea' value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
            </label>
        </fieldset>

        <fieldset className='datos-cliente'>
          <legend>Datos del cliente</legend>
          <label>
            <span>Nombre</span>
            <input className='uppercase' type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
          </label>
          <label>
            <span>Celular</span>
            <input 
              type="text" 
              value={celular} 
              onChange={(e) => {
                const formattedValue = e.target.value.replace(/\D/g, '');
                const trimmedValue = formattedValue.slice(0, 10);
                setCelular(trimmedValue);
              }} 
              maxLength={10}             />
          </label>
          <label>
              <span>Correo</span>
              <input type="email" value={correoCliente} onChange={(e) => setCorreoCliente(e.target.value)} />
          </label>
        </fieldset>
          <div className='flex max-w-min m-auto gap-4'>
            <a 
              href='/dashboard'
              className='button m-auto w-max'>
              Ir al dashboard
            </a>
            <button 
              className='button m-auto gap-4' 
              type="button" 
              onClick={avanzarSeccion}>
              Siguiente
              <GrNext />
            </button>
          </div>
        </>
      )}
       
      {seccion === 2 &&(
        <>
          <fieldset className='datos-servicio'>
            <legend>Datos del Servicio</legend>
            <div className='escoger-servicios'>
            <label>
                <span>Escoge tus servicios</span>
                <div className='menu-servicios'>
                  <select value={servicioSeleccionado} onChange={(e) => setServicioSeleccionado(e.target.value)}>
                    <option value="" disabled>
                      Seleccionar
                    </option>
                    {Object.entries(preciosServicios).map(([nombreServicio, costo]) => (
                      <option key={nombreServicio} value={`${nombreServicio} - $${costo}`}>
                        {nombreServicio} - ${costo.toLocaleString('es-CO')}
                      </option>
                    ))}
                  </select>
                  <button 
                    className='agregar-servicio' 
                    type="button" 
                    onClick={handleAgregarServicio}>
                    <FaPlus />
                  </button>
                </div>
              </label>

              <label>
                  <span>
                    Aplica un descuento
                  </span>
                  <input 
                    placeholder='$'
                    type="number" 
                    value={descuento || ''} 
                    onChange={(e) => setDescuento(parseFloat(e.target.value))} 
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setDescuento(0);
                      }
                   }}
                  />
              </label>

              <label>
                  <input 
                    className='nombre_servicios' 
                    type="text" 
                    name='nombre_servicios' 
                    value={nombresServicios} 
                    readOnly 
                    hidden 
                  />
              </label>
            </div>
        
            <div className="servicios-seleccionados">
              <span className='mb-4 font-semibold'>
                Detalles de la orden
              </span>
                  {servicios.map(servicio => (
                      <div 
                        title='seleccione para eliminar servicio' 
                        key={servicio.nombre} 
                        className="servicio" 
                        onClick={() => handleRemoveServicio(servicio.nombre)}>
                        {servicio.nombre}
                      </div>
                    ))}

                <label>
                  <span className='mt-4'>
                    Total
                  </span>
                  <input 
                      className='costo-servicios' 
                      type="text" 
                      name="costo" 
                      value={`$ ${costoServicios.toLocaleString('es-CO')}`} 
                      readOnly 
                  />
                </label>

                <label>
                  <span>
                    Total con descuento
                  </span>
                  <input 
                      className='costo-con-descuentos' 
                      type="text" 
                      name="costo" 
                      value={`$ ${costoConDescuento.toLocaleString('es-CO')}`} 
                      readOnly 
                    />
                </label>
            </div>
      </fieldset>
            <div className='flex max-w-min m-auto gap-3'>
              <button 
                  className='button gap-2' 
                  type="button" 
                  onClick={retrocederSeccion}
                  >
                <IoChevronBackSharp />
                Atras
              </button>
                <button 
                    className='button' 
                    type="submit"
                    >
                    Generar orden
                </button>
            </div>
        </>
      )}
    </form>
  );
};

export default Formulario;