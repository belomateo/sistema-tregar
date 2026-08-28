(function () {
  const ESTADOS = {
    verde:    { label: 'Visitado y compró',      color: '#1f9d5f', soft: '#e5f7ed', deep: '#136d41' },
    amarillo: { label: 'No compró',              color: '#e8b21c', soft: '#fdf6e0', deep: '#7a5c07' },
    naranja:  { label: 'Quiere comprar después', color: '#e0821f', soft: '#fdf1e0', deep: '#7a4508' },
    rojo:     { label: 'No compra más',          color: '#dd4f43', soft: '#fdeceb', deep: '#9c2f26' },
    gris:     { label: 'Sin visitar',            color: '#9a9aa4', soft: '#f2efe9', deep: '#55555e' }
  };

  const ZONAS = {
    'Centro':  '#2563c9',
    'Norte':   '#e0821f',
    'Sur':     '#7c4dcc',
    'Oeste':   '#c2377e',
    'ATE 2':   '#92400e',
    'Ruta 8':  '#17879b'
  };

  const VANS = [
    { id: 'V-01', nombre: 'Camioneta 1', color: '#0f766e', chofer: 'Julián Rossi',      patente: 'AD 412 KM', zona: 'Centro',          lat: -33.1238, lon: -64.3478 },
    { id: 'V-02', nombre: 'Camioneta 2', color: '#b45309', chofer: 'Emiliano Pérez',    patente: 'AC 890 TR', zona: 'Norte y Ruta 8',  lat: -33.1075, lon: -64.3350 },
    { id: 'V-03', nombre: 'Camioneta 3', color: '#4338ca', chofer: 'Damián Sosa',       patente: 'AF 233 LP', zona: 'Oeste y ATE 2',    lat: -33.1160, lon: -64.3690 },
    { id: 'V-04', nombre: 'Camioneta 4', color: '#be123c', chofer: 'Nahuel Ferreyra',   patente: 'AB 671 QS', zona: 'Sur',             lat: -33.1400, lon: -64.3470 },
    { id: 'V-05', nombre: 'Móvil 5',     color: '#0369a1', chofer: 'Lucía Fernández',   patente: 'AE 118 WD', zona: 'Refuerzo · toda la ciudad', lat: -33.1232, lon: -64.3493 }
  ];

  const RUTA_V05 = [
    [-33.1232, -64.3493], [-33.1201, -64.3516], [-33.1129, -64.3421], [-33.1080, -64.3360],
    [-33.1118, -64.3304], [-33.1155, -64.3615], [-33.1230, -64.3740], [-33.1343, -64.3562],
    [-33.1400, -64.3470], [-33.1268, -64.3452]
  ];

  // [nombre, lat, lon, zona, van, estado, pedidos, últ.fecha, últ.total, últ.detalle, mail, próxima visita, nota]
  const RAW = [
    ['Almacén Don Beto',           -33.1232, -64.3491, 'Centro', 'V-01', 'verde',    42, '12/08', '$412.680', 'Leche entera 1 L ×96 · Yogur bebible frutilla ×96 · Dulce de leche 400 g ×24', 'donbeto.rc@gmail.com',      '01/09', 'Compra cada 5 días. Pidió probar los yogures con granola.'],
    ['Café Plaza Roca',            -33.1240, -64.3505, 'Centro', 'V-01', 'verde',    22, '26/08', '$96.800',  'Crema de leche 200 g ×24 · Chatel 180 g ×12',                                  'plazaroca.cafe@gmail.com',  '23/09', 'Le interesa el chantilly en aerosol para postres.'],
    ['Bar Estación',               -33.1268, -64.3452, 'Centro', 'V-01', 'verde',    31, '25/08', '$178.640', 'Chatel 180 g ×24 · Crema de leche 200 g ×24 · Pan de mesa 350 g ×16',          'barestacion.rc@gmail.com',  '22/09', 'Único de la zona que todavía no lleva arroz con leche.'],
    ['Panadería Del Centro',       -33.1215, -64.3443, 'Centro', 'V-01', 'verde',    37, '25/08', '$266.300', 'Crema de leche 200 g ×36 · Dulce de leche 400 g ×24',                          'delcentro.pan@gmail.com',   '20/09', 'Cliente avanzado: le ofrecemos novedades todos los meses.'],
    ['Kiosco La Esquina',          -33.1201, -64.3516, 'Centro', 'V-01', 'amarillo', 12, '02/08', '$96.400',  'Jugo 250 ml Kids ×48 · Yogur cremoso 125 g ×36',                               'laesquina.kiosco@gmail.com','—',     'Pasamos el martes y no compró: dijo que tenía mercadería.'],
    ['Confitería Los Álamos',      -33.1289, -64.3468, 'Centro', 'V-01', 'naranja',  24, '15/08', '$342.700', 'Crema de leche 350 g ×24 · Dulce de leche 400 g ×24 · Vainillas ×12',          'losalamos.conf@gmail.com',  '18/09', 'Quiere comprar el mes que viene con la crema nueva de 350 g.'],
    ['Rotisería El Fogón',         -33.1256, -64.3541, 'Centro', 'V-01', 'amarillo',  8, '19/08', '$204.180', 'Mozzarella 12 kg · Pan de hamburguesa ×48',                                    'elfogon.rc@gmail.com',      '—',     'Le quedó mozzarella del pedido anterior.'],

    ['Panadería San Cayetano',     -33.1082, -64.3392, 'Norte',  'V-02', 'verde',    51, '26/08', '$612.400', 'Crema de leche 350 g ×24 · Dulce de leche 400 g ×36 · Queso crema 280 g ×24',  'sancayetano.pan@gmail.com', '19/09', 'Cliente avanzado: el de mayor volumen de la zona norte.'],
    ['Despensa La Banda',          -33.1118, -64.3304, 'Norte',  'V-02', 'verde',    28, '24/08', '$188.900', 'Leche 0 % lactosa ×24 · Jugo 1 L clásico ×18',                                 'labanda.despensa@gmail.com','21/09', 'Pidió más variedad sin lactosa.'],
    ['Almacén Doña Rosa',          -33.1063, -64.3268, 'Norte',  'V-02', 'verde',    33, '25/08', '$233.910', 'Yogur con frutas 160 g ×48 · Chocolatada 1 L ×24',                             'donarosa.alm@gmail.com',    '22/09', 'Le funciona muy bien el yogur con frutas.'],
    ['Kiosco 9 de Julio',          -33.1129, -64.3421, 'Norte',  'V-02', 'amarillo',  9, '11/08', '$54.200',  'Jugo 250 ml ×24 · Baloncitos chocolatados ×6',                                 'kiosco9dejulio@gmail.com',  '—',     'Estaba cerrado cuando pasó la camioneta.'],
    ['Rotisería Norte',            -33.1090, -64.3455, 'Norte',  'V-02', 'naranja',  16, '13/08', '$147.500', 'Mozzarella 8 kg · Tapas de empanadas ×24',                                     'rotinorte.rc@gmail.com',    '16/09', 'Vuelve a comprar cuando le entre la temporada de empanadas.'],
    ['Minimercado Aramburu',       -33.1044, -64.3355, 'Norte',  'V-02', 'rojo',     19, '04/07', '$71.300',  'Leche entera 1 L ×24 · Yogur firme 170 g ×12',                                 'aramburu.mini@gmail.com',   '—',     'Reclamo de precios sin resolver: dejó de comprar en julio.'],

    ['Supermercado Yaguarón',      -33.1002, -64.3182, 'Ruta 8', 'V-02', 'verde',    58, '26/08', '$1.284.300','Leche entera ×288 · Yogures surtidos ×240 · Quesos 60 kg',                    'compras@yaguaron.com.ar',   '18/09', 'Cliente avanzado: pedido semanal fijo, lista A.'],
    ['Estación de servicio Ruta 8',-33.0958, -64.3108, 'Ruta 8', 'V-02', 'naranja',  10, '18/08', '$64.700',  'Chocolatada 200 ml ×48 · Jugo 250 ml ×48',                                     'shop.ruta8@gmail.com',      '15/09', 'Quiere sumar la línea de granola para la tienda de conveniencia.'],
    ['Almacén El Cruce',           -33.0921, -64.3042, 'Ruta 8', 'V-02', 'amarillo',  7, '09/08', '$42.300',  'Leche entera ×12 · Pan de mesa ×8',                                            'elcruce.alm@gmail.com',     '—',     'Compra poco volumen, conviene visita quincenal.'],

    ['Supermercado Alberdi',       -33.1108, -64.3568, 'Oeste',  'V-03', 'verde',    46, '25/08', '$704.100', 'Leche entera 1 L ×144 · Yogur cremoso 125 g ×96 · Queso cremoso 22 kg',        'compras@superalberdi.com',  '17/09', 'Cliente avanzado: visita mensual de novedades agendada.'],
    ['Panadería Jardín',           -33.1152, -64.3705, 'Oeste',  'V-03', 'verde',    29, '24/08', '$212.600', 'Crema de leche 200 g ×36 · Dulce de leche 200 g ×24',                          'panjardin.rc@gmail.com',    '24/09', 'Probó las tapas de pascualina y repitió.'],
    ['Despensa Quintitas',         -33.1247, -64.3828, 'Oeste',  'V-03', 'naranja',  14, '08/08', '$118.700', 'Jugo 1 L clásico ×24 · Yogur bebible ×24',                                     'quintitas.desp@gmail.com',  '12/09', 'Espera la reposición de jugos premium para volver a pedir.'],
    ['Almacén Villa Golf',         -33.1312, -64.3782, 'Oeste',  'V-03', 'amarillo', 11, '06/08', '$88.400',  'Leche descremada ×24 · Pan lacteado 600 g ×8',                                 'villagolf.alm@gmail.com',   '—',     'No compró: dijo que le sobró leche de la semana pasada.'],
    ['Kiosco Alberdi',             -33.1071, -64.3618, 'Oeste',  'V-03', 'rojo',      6, '20/06', '$31.900',  'Jugo 250 ml Kids ×12',                                                        'kioscoalberdi@gmail.com',   '—',     'Cambió de proveedor. No quiere que lo visiten más.'],

    ['Almacén Bariloche',          -33.1138, -64.3598, 'ATE 2',  'V-03', 'verde',    27, '26/08', '$164.900', 'Leche entera 1 L ×48 · Yogur cremoso 125 g ×36 · Dulce de leche 400 g ×12',   'almbariloche@gmail.com',    '19/09', 'Punto fuerte de ATE 2: compra parejo todas las semanas.'],
    ['Despensa Pueyrredón',        -33.1146, -64.3616, 'ATE 2',  'V-03', 'verde',    21, '25/08', '$118.300', 'Chatel 180 g ×24 · Queso crema 190 g ×12 · Pan de mesa 350 g ×12',             'desppueyrredon@gmail.com',  '22/09', 'Pidió sumar la línea de arroz con leche.'],
    ['Kiosco Vélez Sarsfield',     -33.1131, -64.3634, 'ATE 2',  'V-03', 'amarillo', 10, '12/08', '$46.700',  'Jugo 250 ml Kids ×24 · Chocolatada 200 ml ×24',                               'kioscovelez@gmail.com',     '—',     'No compró en la última pasada: caja chica.'],
    ['Panadería La Vecinal',       -33.1157, -64.3629, 'ATE 2',  'V-03', 'verde',    33, '26/08', '$228.400', 'Crema de leche 200 g ×36 · Dulce de leche 400 g ×24 · Queso rallado 120 g ×10','lavecinal.pan@gmail.com',   '18/09', 'Cliente avanzado de ATE 2: visita mensual de novedades.'],
    ['Minimercado Juan B. Justo',  -33.1165, -64.3605, 'ATE 2',  'V-03', 'naranja',  15, '09/08', '$97.200',  'Leche entera 1 L ×24 · Yogur bebíble ×12 · Pascualina criolla ×6',             'minijbjusto@gmail.com',     '11/09', 'Quiere volver a comprar cuando salga la promo de yogures.'],
    ['Despensa ATE 2',             -33.1172, -64.3641, 'ATE 2',  'V-03', 'amarillo',  8, '05/08', '$38.900',  'Leche entera 1 L ×12 · Pan lacteado 350 g ×6',                                 'despate2@gmail.com',        '—',     'Atiende a la tarde: pasar después de las 17.'],
    ['Rotisería El Barrio',        -33.1160, -64.3585, 'ATE 2',  'V-03', 'naranja',  12, '14/08', '$84.600',  'Mozzarella 6 kg · Tapas de empanadas ×18',                                     'rotielbarrio@gmail.com',    '13/09', 'Vuelve a pedir con la temporada de empanadas.'],
    ['Kiosco Pasaje Contreras',    -33.1180, -64.3618, 'ATE 2',  'V-03', 'rojo',      4, '28/06', '$21.400',  'Jugo 250 ml ×12',                                                              'kioscocontreras@gmail.com', '—',     'Cerró el local. Dar de baja del recorrido.'],
    ['Almacén Los Tilos',          -33.1149, -64.3668, 'ATE 2',  'V-03', 'verde',    19, '26/08', '$102.500', 'Leche entera 1 L ×36 · Yogur con frutas 160 g ×24',                            'almlostilos@gmail.com',     '20/09', 'Sector oeste de ATE 2. Compra parejo cada semana.'],
    ['Despensa Bariloche Oeste',   -33.1141, -64.3651, 'ATE 2',  'V-03', 'verde',    23, '25/08', '$136.800', 'Chatel 180 g ×24 · Crema de leche 200 g ×24 · Pan de mesa 350 g ×8',           'despbarilocheoeste@gmail.com','21/09','Le anda muy bien la línea de untables.'],
    ['Kiosco Escuela ATE',         -33.1163, -64.3660, 'ATE 2',  'V-03', 'amarillo',  7, '08/08', '$29.800',  'Jugo 250 ml Kids ×24 · Chocolatada 200 ml ×12',                                'kioscoescuela@gmail.com',   '—',     'Compra al ritmo del calendario escolar.'],
    ['Minimercado Pueyrredón Oeste',-33.1173, -64.3672, 'ATE 2', 'V-03', 'verde',    25, '26/08', '$158.200', 'Leche entera 1 L ×48 · Queso cremoso 6 kg · Dulce de leche 400 g ×12',         'minipueyoeste@gmail.com',   '19/09', 'Punta oeste del recorrido: conviene pasar primero.'],
    ['Panadería Horno de Barro',   -33.1156, -64.3689, 'ATE 2',  'V-03', 'naranja',  17, '11/08', '$91.400',  'Crema de leche 200 g ×24 · Queso rallado 40 g ×20',                            'hornodebarro@gmail.com',    '09/09', 'Espera la promo de crema para volver a pedir.'],
    ['Despensa La Esquina Oeste',  -33.1186, -64.3648, 'ATE 2',  'V-03', 'amarillo', 11, '07/08', '$47.600',  'Leche entera 1 L ×24 · Yogur natural 140 g ×12',                               'laesquinaoeste@gmail.com',  '—',     'No compró en la última pasada: mucha mercadería de la anterior.'],

    ['Pizzería Vicente',           -33.1388, -64.3449, 'Sur',    'V-04', 'naranja',  38, '25/08', '$489.050', 'Mozzarella 40 kg · Tapas de empanadas ×36',                                    'pizzeriavicente@gmail.com', '10/09', 'Compra cada 4 días, está atrasado. Ofrecerle la mozzarella x 40 kg.'],
    ['Almacén Sur',                -33.1343, -64.3562, 'Sur',    'V-04', 'verde',    26, '25/08', '$174.300', 'Chatel 180 g ×24 · Queso rallado 120 g ×20',                                   'almacensur.rc@gmail.com',   '23/09', 'Le interesa la línea de untables saborizados.'],
    ['Kiosco Trinidad',            -33.1492, -64.3658, 'Sur',    'V-04', 'verde',    17, '23/08', '$79.500',  'Jugo 250 ml ×36 · Yogur bebible ×12',                                          'kioscotrinidad@gmail.com',  '25/09', 'Buen movimiento de jugos escolares.'],
    ['Rotisería Banda Sur',        -33.1465, -64.3498, 'Sur',    'V-04', 'amarillo', 13, '14/08', '$122.800', 'Papas precocidas ×20 · Hamburguesas clásicas ×24',                             'bandasur.roti@gmail.com',   '—',     'Pasó la camioneta el jueves y no compró.'],
    ['Despensa Nuevo Sol',         -33.1424, -64.3386, 'Sur',    'V-04', 'rojo',     21, '02/08', '$96.420',  'Leche entera 1 L ×24 · Yogur firme ×12',                                       'nuevosol.desp@gmail.com',   '—',     'Sin comprar hace 24 días. Avisó que no sigue.']
  ];

  const CLIENTES = RAW.map((r, i) => ({
    id: 'C-' + String(101 + i), nombre: r[0], lat: r[1], lon: r[2], zona: r[3], van: r[4],
    estado: r[5], pedidos: r[6], ultFecha: r[7], ultTotal: r[8], ultDetalle: r[9],
    mail: r[10], prox: r[11], nota: r[12]
  }));

  const nivel = n => (n >= 30 ? 'Avanzado' : n >= 12 ? 'Habitual' : 'Nuevo');
  const nivelColor = n => (n >= 30 ? ['#e8f0fd', '#1b4a99'] : n >= 12 ? ['#f2efe9', '#55555e'] : ['#fdf6e0', '#7a5c07']);

  const TIPOS = {
    supermarket: 'Supermercado', convenience: 'Almacén / despensa', kiosk: 'Kiosco', bakery: 'Panadería',
    butcher: 'Carnicería', greengrocer: 'Verdulería', dairy: 'Lácteos', deli: 'Fiambrería',
    confectionery: 'Confitería', pastry: 'Confitería', frozen_food: 'Congelados', general: 'Almacén de ramos generales',
    food: 'Alimentos', cafe: 'Café', restaurant: 'Restaurante', fast_food: 'Comida rápida', bar: 'Bar', ice_cream: 'Heladería'
  };
  const ZONA_CENTROS = [
    ['Centro', -33.1240, -64.3480], ['Norte', -33.1080, -64.3360], ['Sur', -33.1430, -64.3500],
    ['Oeste', -33.1230, -64.3740], ['ATE 2', -33.1155, -64.3615], ['Ruta 8', -33.0960, -64.3120]
  ];
  const VAN_POR_ZONA = { 'Centro': 'V-01', 'Norte': 'V-02', 'Ruta 8': 'V-02', 'Oeste': 'V-03', 'ATE 2': 'V-03', 'Sur': 'V-04' };

  // Geometría: los móviles siguen las cuadras — tramos en L sobre la trama de calles,
  // con el ángulo real de la trama según el sector (Banda Norte está girada ~43°; el centro/sur ~-10°)
  const M_LAT = 110540, M_LON = 111320 * Math.cos(-33.12 * Math.PI / 180);
  const distM = (a, b) => Math.hypot((a[0] - b[0]) * M_LAT, (a[1] - b[1]) * M_LON);
  function anguloTrama(lat, lon) {
    const latRio = -33.132 + 0.42 * (lon + 64.385); // traza aproximada del río Cuarto
    return (lat > latRio ? 43 : -10) * Math.PI / 180;
  }
  function porCuadras(puntos) {
    const out = [puntos[0]];
    for (let i = 1; i < puntos.length; i++) {
      const a = out[out.length - 1], b = puntos[i];
      const th = anguloTrama((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      const cos = Math.cos(th), sin = Math.sin(th);
      const x = (b[1] - a[1]) * M_LON, y = (b[0] - a[0]) * M_LAT;
      const u = x * cos + y * sin, v = -x * sin + y * cos; // coordenadas sobre la trama
      if (Math.abs(u) > 70 && Math.abs(v) > 70) {
        const cu = i % 2 ? u : 0, cv = i % 2 ? 0 : v; // esquina: primero una calle, después la transversal
        out.push([a[0] + (cu * sin + cv * cos) / M_LAT, a[1] + (cu * cos - cv * sin) / M_LON]);
      }
      out.push(b);
    }
    return out;
  }
  const zonaCercana = (lat, lon) => ZONA_CENTROS.map(z => [z[0], (z[1] - lat) * (z[1] - lat) + (z[2] - lon) * (z[2] - lon)]).sort((a, b) => a[1] - b[1])[0][0];

  // Comercios de referencia precargados (se usan si la consulta en vivo a OpenStreetMap no está disponible)
  const LOCALES = [
    ['Almacén Sobremonte', 'Almacén / despensa', -33.1225, -64.3470, 'Sobremonte 740'],
    ['Kiosco Plaza', 'Kiosco', -33.1236, -64.3499, 'Constitución 65'],
    ['Panadería La Espiga', 'Panadería', -33.1210, -64.3480, 'Alvear 520'],
    ['Minimercado Cabrera', 'Almacén / despensa', -33.1252, -64.3462, 'Cabrera 980'],
    ['Despensa Mitre', 'Almacén / despensa', -33.1218, -64.3532, 'Mitre 1130'],
    ['Supermercado Centro', 'Supermercado', -33.1246, -64.3520, 'San Juan 45'],
    ['Fiambrería El Bodegón', 'Fiambrería', -33.1263, -64.3488, 'Sadi Carnot 210'],
    ['Café del Boulevard', 'Café', -33.1230, -64.3455, 'Bv. Roca 320'],
    ['Verdulería Don Pedro', 'Verdulería', -33.1272, -64.3512, 'Lamadrid 640'],
    ['Kiosco 25 de Mayo', 'Kiosco', -33.1198, -64.3465, '25 de Mayo 180'],
    ['Carnicería El Corte', 'Carnicería', -33.1284, -64.3540, 'Belgrano 870'],
    ['Rotisería Centro', 'Comida rápida', -33.1241, -64.3477, 'Buenos Aires 415'],
    ['Panadería Del Sol', 'Panadería', -33.1275, -64.3450, 'Baigorria 300'],
    ['Heladería La Plaza', 'Heladería', -33.1228, -64.3508, 'Constitución 350'],
    ['Almacén Banda Norte', 'Almacén / despensa', -33.1065, -64.3330, 'Av. España 1450'],
    ['Kiosco Universidad', 'Kiosco', -33.1120, -64.3345, 'Bv. Ameghino 220'],
    ['Panadería La Flor', 'Panadería', -33.1092, -64.3372, 'Cabrera Norte 1120'],
    ['Minimercado Islas Malvinas', 'Almacén / despensa', -33.1048, -64.3395, 'Guardias Nacionales 980'],
    ['Verdulería Norte', 'Verdulería', -33.1108, -64.3288, 'Av. Italia 1540'],
    ['Despensa Los Pinos', 'Almacén / despensa', -33.1035, -64.3312, 'Pje. Los Pinos 240'],
    ['Supermercado Familiar Norte', 'Supermercado', -33.1075, -64.3425, 'Av. España 890'],
    ['Carnicería El Novillo', 'Carnicería', -33.1130, -64.3390, 'Dinkeldein 350'],
    ['Café Costanera', 'Café', -33.1148, -64.3440, 'Costanera Norte 120'],
    ['Kiosco El Puente', 'Kiosco', -33.1155, -64.3365, 'Av. Amadeo Sabattini 60'],
    ['Almacén La Amistad', 'Almacén / despensa', -33.1360, -64.3420, 'Av. San Martín 2300'],
    ['Panadería Trigo Sur', 'Panadería', -33.1395, -64.3500, 'Sarmiento Sur 1850'],
    ['Kiosco Barrio Fátima', 'Kiosco', -33.1440, -64.3445, 'Pasaje Newbery 130'],
    ['Minimercado Sur', 'Almacén / despensa', -33.1372, -64.3555, 'Av. Marconi 1200'],
    ['Despensa Doña Carmen', 'Almacén / despensa', -33.1478, -64.3530, 'Mitre Sur 2600'],
    ['Verdulería La Huerta', 'Verdulería', -33.1412, -64.3362, 'Río Negro 740'],
    ['Carnicería Sur', 'Carnicería', -33.1352, -64.3480, 'San Luis 1980'],
    ['Rotisería El Buen Sabor', 'Comida rápida', -33.1430, -64.3580, 'Av. Marconi 1650'],
    ['Supermercado del Sur', 'Supermercado', -33.1338, -64.3378, 'Av. San Martín 1900'],
    ['Almacén Alberdi', 'Almacén / despensa', -33.1095, -64.3590, 'Av. Godoy Cruz 750'],
    ['Panadería La Tradición', 'Panadería', -33.1140, -64.3660, 'Fotheringham 890'],
    ['Kiosco Villa Dálcar', 'Kiosco', -33.1265, -64.3745, 'M. T. de Alvear 2400'],
    ['Minimercado Oeste', 'Almacén / despensa', -33.1180, -64.3720, 'Paso de los Andes 560'],
    ['Despensa El Trébol', 'Almacén / despensa', -33.1122, -64.3625, 'Bv. Almafuerte 430'],
    ['Verdulería Alberdi', 'Verdulería', -33.1088, -64.3648, 'Av. Reforma Universitaria 1100'],
    ['Supermercado Familiar Oeste', 'Supermercado', -33.1205, -64.3688, 'Fotheringham 1500'],
    ['Café Villa Golf', 'Café', -33.1298, -64.3810, 'Los Álamos 220'],
    ['Carnicería La Querencia', 'Carnicería', -33.1240, -64.3770, 'Av. Alvear Oeste 2900'],
    ['Almacén Km 604', 'Almacén / despensa', -33.0965, -64.3140, 'Ruta 8 km 604'],
    ['Kiosco La Terminal', 'Kiosco', -33.1005, -64.3225, 'Av. Sabattini 3200'],
    ['Minimercado El Cruce Norte', 'Almacén / despensa', -33.0930, -64.3080, 'Ruta 8 acceso norte'],
    ['Panadería La Rueda', 'Panadería', -33.0985, -64.3175, 'Av. Sabattini 2800'],
    ['Despensa El Parador', 'Almacén / despensa', -33.0908, -64.3020, 'Ruta 8 km 601'],
    ['Supermercado Mayorista Ruta 8', 'Supermercado', -33.1020, -64.3260, 'Av. Sabattini 2400'],
    ['Almacén Fotheringham', 'Almacén / despensa', -33.1150, -64.3593, 'Fotheringham 240'],
    ['Kiosco Bariloche', 'Kiosco', -33.1142, -64.3625, 'Bariloche 1780'],
    ['Panadería ATE', 'Panadería', -33.1168, -64.3622, 'Pueyrredón 1850'],
    ['Verdulería ATE 2', 'Verdulería', -33.1176, -64.3596, 'Juan B. Justo 1420'],
    ['Almacén El Oeste', 'Almacén / despensa', -33.1147, -64.3702, 'Bv. Los Andes 2100'],
    ['Kiosco Los Tilos', 'Kiosco', -33.1169, -64.3695, 'Pje. Los Tilos 380'],
    ['Carnicería ATE Oeste', 'Carnicería', -33.1182, -64.3663, 'Pueyrredón 2300']
  ].map((r, i) => ({ id: 'loc/' + i, nombre: r[0], tipo: r[1], lat: r[2], lon: r[3], dir: r[4], src: 'local' }));

  function el(tag, style, text) {
    const n = document.createElement(tag);
    if (style) n.setAttribute('style', style);
    if (text != null) n.textContent = text;
    return n;
  }
  function pill(texto, bg, fg) {
    return el('span', 'display:inline-flex;align-items:center;font-size:12px;font-weight:550;border-radius:99px;padding:4px 10px;white-space:nowrap;background:' + bg + ';color:' + fg, texto);
  }
  function chipStyle(activo, color) {
    return 'border:0;border-radius:99px;font-size:12.5px;font-weight:550;padding:7px 13px;cursor:pointer;white-space:nowrap;flex:none;background:' +
      (activo ? color + ';color:#fff' : '#f2efe9;color:#43434a');
  }
  function tabStyle(activo, color) {
    return 'border:0;border-radius:4px;font-size:12.5px;font-weight:550;padding:6px 12px;cursor:pointer;white-space:nowrap;background:' +
      (activo ? '#fff;color:' + color + ';box-shadow:0 1px 2px rgba(22,22,26,.16)' : 'transparent;color:#6f6f76');
  }

  async function esperarLeaflet() {
    for (let i = 0; i < 300; i++) {
      if (window.L && window.L.map) return window.L;
      await new Promise(r => setTimeout(r, 40));
    }
    return null;
  }

  class MapaReparto extends HTMLElement {
    static get observedAttributes() { return ['compact']; }

    constructor() {
      super();
      this.modo = 'estado';
      this.vanFiltro = 'Todas';
      this.sel = CLIENTES[0];
      this.selVan = null;
      this.selPros = null;
      this.addMode = false;
      this.verRutas = true;
      this.verComercios = true;
      this.osmStatus = 'idle';
      this.prospectos = [];
      this.clientes = CLIENTES.slice();
      this.nuevos = 0;
      this.capas = {};
      this.reloj = 0;
      this.alertas = [];
      this.vanMarkers = {};
      this.trails = {};
      this.gps = {};
      this.eventos = [[18, 'V-02', 'off'], [30, 'V-05', 'off'], [55, 'V-02', 'on'], [80, 'V-04', 'off'], [116, 'V-04', 'on']];
    }

    get compacto() { return this.getAttribute('compact') === '1'; }

    connectedCallback() {
      if (this.montado) return;
      this.montado = true;
      this.construir();
      this.iniciarMapa();
    }

    disconnectedCallback() {
      if (this.ro) this.ro.disconnect();
      if (this.timer) clearInterval(this.timer);
      if (this.mov) clearInterval(this.mov);
      if (this.onFs) document.removeEventListener('fullscreenchange', this.onFs);
      if (this.onEsc) document.removeEventListener('keydown', this.onEsc);
    }

    attributeChangedCallback(n, viejo, nuevo) {
      if (n === 'compact' && viejo !== nuevo && this.montado) {
        this.aplicarLayout();
        if (this.map) setTimeout(() => this.map.invalidateSize(), 60);
      }
    }

    construir() {
      this.baseStyle = 'display:flex;flex-direction:column;min-width:0;min-height:0;width:100%;height:100%;background:#f7f5f1;font-family:"Plus Jakarta Sans",system-ui,sans-serif;color:#16161a';
      this.setAttribute('style', this.baseStyle);

      // Barra de herramientas: los controles scrollean, el botón queda fijo a la derecha
      const bar = el('div', 'flex:none;display:flex;align-items:center;gap:9px;padding:10px 16px;background:#fff;border-bottom:1px solid #e6e2db');
      this.bar = bar;
      const scrollGrp = el('div', 'flex:1;min-width:0;display:flex;align-items:center;gap:9px;overflow-x:auto;scrollbar-width:none');
      this.scrollGrp = scrollGrp;

      const lblModo = el('span', 'font-size:10.5px;font-weight:600;letter-spacing:.05em;color:#6f6f76;flex:none', 'COLOR');
      const grpModo = el('div', 'display:flex;gap:2px;background:#f2efe9;border-radius:6px;padding:3px;flex:none');
      this.btnModo = {};
      [['estado', 'Estado'], ['zona', 'Zona'], ['van', 'Camioneta']].forEach(([k, txt]) => {
        const b = el('button', tabStyle(this.modo === k, '#c2377e'), txt);
        b.onclick = () => { this.modo = k; this.refrescar(); };
        this.btnModo[k] = b;
        grpModo.appendChild(b);
      });

      const grpVan = el('div', 'display:flex;gap:6px;flex:none');
      this.chipsVan = {};
      ['Todas'].concat(VANS.map(v => v.id)).forEach(id => {
        const v = VANS.filter(x => x.id === id)[0];
        const b = el('button', chipStyle(this.vanFiltro === id, v ? v.color : '#c2377e'), id === 'Todas' ? 'Todas' : id);
        b.onclick = () => { this.vanFiltro = id; this.selVan = v || null; this.refrescar(); };
        this.chipsVan[id] = b;
        grpVan.appendChild(b);
      });

      this.chipOsm = el('button', chipStyle(false, '#55555e'), 'Comercios de la ciudad…');
      this.chipOsm.onclick = () => {
        this.verComercios = !this.verComercios;
        this.refrescar();
      };

      this.btnAdd = el('button', '', '+  Agregar cliente');
      this.btnAdd.onclick = () => this.toggleAdd();

      this.conteo = el('span', 'font-size:12.5px;color:#a4a4ae;white-space:nowrap;margin-left:auto;flex:none');

      scrollGrp.appendChild(lblModo); scrollGrp.appendChild(grpModo); scrollGrp.appendChild(grpVan); scrollGrp.appendChild(this.chipOsm); scrollGrp.appendChild(this.conteo);
      bar.appendChild(scrollGrp); bar.appendChild(this.btnAdd);

      // Cuerpo
      this.cuerpo = el('div', '');
      this.mapaWrap = el('div', 'position:relative;min-width:0;min-height:0');
      this.mapEl = el('div', 'position:absolute;inset:0');
      this.mapaWrap.appendChild(this.mapEl);

      this.banner = el('div', 'display:none;position:absolute;top:12px;left:50%;transform:translateX(-50%);z-index:900;background:#16161a;color:#fff;font-size:13px;font-weight:550;padding:9px 15px;border-radius:99px;box-shadow:0 8px 20px -8px rgba(0,0,0,.5)', 'Tocá el mapa donde está el negocio');
      this.mapaWrap.appendChild(this.banner);

      this.toastsEl = el('div', 'position:absolute;top:56px;left:50%;transform:translateX(-50%);z-index:950;display:flex;flex-direction:column;gap:6px;align-items:center;pointer-events:none;max-width:92%');
      this.mapaWrap.appendChild(this.toastsEl);

      // Barra de alertas de ubicación (siempre visible, arriba del mapa)
      this.alertasEl = el('div', 'display:none');
      
      this.leyenda = el('div', 'position:absolute;left:12px;bottom:16px;z-index:900;background:rgba(255,255,255,.96);border:1px solid #e6e2db;border-radius:9px;padding:10px 12px;box-shadow:0 6px 18px -10px rgba(0,0,0,.4);max-width:210px');
      this.mapaWrap.appendChild(this.leyenda);

      this.detalle = el('div', '');
      this.cuerpo.appendChild(this.mapaWrap);
      this.cuerpo.appendChild(this.detalle);

      this.appendChild(bar);
      this.appendChild(this.alertasEl);
      this.appendChild(this.cuerpo);
      this.aplicarLayout();
    }

    toggleFsCss() {
      this.fsCss = !this.fsCss;
      this.aplicarLayout();
    }

    aplicarLayout() {
      const c = this.compacto;
      const fs = !!document.fullscreenElement || !!this.fsCss;
      this.setAttribute('style', this.baseStyle + (this.fsCss ? ';position:fixed;inset:0;z-index:99999;height:100vh;width:100vw' : ''));
      if (this.btnFs) { this.btnFs.textContent = fs ? '✕' : '⛶'; this.btnFs.title = fs ? 'Salir de pantalla completa' : 'Pantalla completa'; }
      this.cuerpo.setAttribute('style', 'flex:1;min-width:0;min-height:0;display:flex;flex-direction:' + (c ? 'column' : 'row') + ';overflow:' + (c ? 'auto' : 'hidden'));
      // El mapa queda como tarjeta con margen (más centrado); en pantalla completa ocupa todo
      this.mapaWrap.setAttribute('style', 'position:relative;min-width:0;flex:' + (c ? 'none' : '1 1 auto') + ';height:' + (c ? '320px' : 'auto') +
        (fs ? ';margin:0;border-radius:0' : c ? ';margin:12px 14px 4px;border-radius:12px' : ';margin:18px 14px 26px 20px;border-radius:14px') +
        ';overflow:hidden;border:1px solid #e6e2db;background:#e9e7e2;box-shadow:0 10px 30px -18px rgba(22,22,26,.35)');
      this.detalle.setAttribute('style', 'flex:' + (c ? '1 0 auto' : 'none') + ';width:' + (c ? 'auto' : '330px') + ';min-width:0;background:#fff;border-' + (c ? 'top' : 'left') + ':1px solid #e6e2db;overflow-y:auto;padding:16px 18px 22px' + (c ? ';margin-top:10px' : ''));
      if (this.map) setTimeout(() => this.map.invalidateSize(), 60);
      if (c) {
        // Botón flotante sobre el mapa: siempre visible y con buen tamaño táctil
        this.btnAdd.setAttribute('style', 'position:absolute;right:12px;bottom:16px;z-index:900;min-height:46px;border:0;border-radius:99px;background:' + (this.addMode ? '#16161a' : '#c2377e') + ';color:#fff;font-size:13.5px;font-weight:600;padding:0 17px;cursor:pointer;white-space:nowrap;box-shadow:0 8px 20px -8px rgba(0,0,0,.5)');
        if (this.btnAdd.parentNode !== this.mapaWrap) this.mapaWrap.appendChild(this.btnAdd);
      } else {
        this.btnAdd.setAttribute('style', 'flex:none;min-height:38px;border:0;border-radius:8px;background:' + (this.addMode ? '#16161a' : '#c2377e') + ';color:#fff;font-size:13px;font-weight:600;padding:0 15px;cursor:pointer;white-space:nowrap');
        if (this.btnAdd.parentNode !== this.bar) this.bar.appendChild(this.btnAdd);
      }
      this.btnAdd.textContent = this.addMode ? 'Tocando el mapa…' : '+  Agregar cliente';
      if (this.conteo) this.conteo.style.display = c ? 'none' : 'inline';
    }

    async iniciarMapa() {
      const L = await esperarLeaflet();
      if (!L) {
        this.mapEl.appendChild(el('div', 'padding:24px;font-size:14px;color:#6f6f76', 'No se pudo cargar el mapa. Revisá la conexión.'));
        return;
      }
      this.L = L;
      this.map = L.map(this.mapEl, { zoomControl: true, attributionControl: true, preferCanvas: true })
        .setView([-33.1232, -64.3493], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors', maxZoom: 19
      }).addTo(this.map);
      L.control.scale({ imperial: false }).addTo(this.map);

      // Etiquetas de zona sobre el plano
      ZONA_CENTROS.forEach(([nombre, lat, lon]) => {
        L.marker([lat, lon], {
          interactive: false,
          icon: L.divIcon({
            className: '',
            html: '<div style="font:700 10px/1 \'Plus Jakarta Sans\',system-ui,sans-serif;letter-spacing:.12em;color:' + (ZONAS[nombre] || '#43434a') + ';text-shadow:0 1px 3px #fff,0 -1px 3px #fff,1px 0 3px #fff,-1px 0 3px #fff;white-space:nowrap;transform:translate(-50%,-50%);opacity:.85">' + nombre.toUpperCase() + '</div>',
            iconSize: [0, 0]
          })
        }).addTo(this.map);
      });

      // Botón para volver a encuadrar todos los puntos + pantalla completa
      this.btnFs = el('button', 'position:absolute;top:12px;right:12px;z-index:900;min-height:34px;min-width:38px;border:1px solid #e6e2db;border-radius:8px;background:rgba(255,255,255,.96);color:#43434a;font-size:15px;font-weight:600;cursor:pointer;box-shadow:0 4px 12px -6px rgba(0,0,0,.4)', '⛶');
      this.btnFs.title = 'Pantalla completa';
      this.btnFs.onclick = () => {
        if (document.fullscreenElement) { document.exitFullscreen(); return; }
        if (this.fsCss) { this.toggleFsCss(); return; }
        let p = null;
        try { p = this.requestFullscreen ? this.requestFullscreen() : null; } catch (e) { p = null; }
        if (p && p.catch) p.catch(() => this.toggleFsCss());
        else if (!p) this.toggleFsCss();
      };
      this.mapaWrap.appendChild(this.btnFs);
      this.onFs = () => this.aplicarLayout();
      document.addEventListener('fullscreenchange', this.onFs);
      this.onEsc = e => { if (e.key === 'Escape' && this.fsCss) this.toggleFsCss(); };
      document.addEventListener('keydown', this.onEsc);

      this.btnCentrar = el('button', 'position:absolute;top:12px;right:58px;z-index:900;min-height:34px;border:1px solid #e6e2db;border-radius:8px;background:rgba(255,255,255,.96);color:#43434a;font-size:12px;font-weight:600;padding:0 12px;cursor:pointer;box-shadow:0 4px 12px -6px rgba(0,0,0,.4)', '⌖ Centrar');
      this.btnCentrar.onclick = () => this.encuadrar();
      this.mapaWrap.appendChild(this.btnCentrar);

      this.capaRutas = L.layerGroup().addTo(this.map);
      this.capaProspectos = L.layerGroup().addTo(this.map);
      this.capaPuntos = L.layerGroup().addTo(this.map);
      this.capaVans = L.layerGroup().addTo(this.map);

      this.cargarComercios();

      this.map.on('click', e => { if (this.addMode) this.crearCliente(e.latlng); });

      // Estado GPS y recorrido en vivo de cada móvil (demo del tracking del preventista)
      VANS.forEach((v, i) => {
        const suyos = this.clientes.filter(c => c.van === v.id);
        const base = v.id === 'V-05' ? RUTA_V05.slice() : [[v.lat, v.lon]].concat(suyos.map(c => [c.lat, c.lon]));
        if (base.length < 2) base.push([v.lat + 0.004, v.lon + 0.004]);
        base.push(base[0]);
        const ruta = porCuadras(base);
        this.gps[v.id] = { online: true, off: null, pos: ruta[0].slice(), seg: 0, m: 0, vel: 46 + i * 7, tAcc: 0, ruta, trail: [ruta[0].slice()] };
      });
      this.timer = setInterval(() => this.tick(), 1000);
      this.mov = setInterval(() => this.mover(0.12), 120);

      this.ro = new ResizeObserver(() => this.map && this.map.invalidateSize());
      this.ro.observe(this.mapaWrap);

      this.refrescar();
      this.encuadrar();
      setTimeout(() => { this.map.invalidateSize(); this.encuadrar(); }, 150);
    }

    encuadrar() {
      if (!this.map || !this.L) return;
      const pts = this.visibles().map(c => [c.lat, c.lon]).concat(VANS.map(v => [v.lat, v.lon]));
      if (pts.length) this.map.fitBounds(this.L.latLngBounds(pts).pad(0.1));
    }

    horaSim() {
      const total = 11 * 60 + 24 + Math.floor(this.reloj / 60);
      return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
    }
    fmtDur(s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }

    mover(dt) {
      Object.keys(this.gps).forEach(id => {
        const g = this.gps[id];
        if (!g.online) return;
        let resto = g.vel * dt;
        while (resto > 0) {
          const a = g.ruta[g.seg], b = g.ruta[(g.seg + 1) % g.ruta.length];
          const largo = Math.max(1, distM(a, b));
          const falta = largo - g.m;
          if (resto < falta) { g.m += resto; resto = 0; }
          else { resto -= falta; g.m = 0; g.seg = (g.seg + 1) % (g.ruta.length - 1); }
        }
        const a = g.ruta[g.seg], b = g.ruta[(g.seg + 1) % g.ruta.length];
        const f = g.m / Math.max(1, distM(a, b));
        g.pos = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
        if (this.vanMarkers[id]) this.vanMarkers[id].setLatLng(g.pos);
        g.tAcc += dt;
        if (g.tAcc >= 0.7) {
          g.tAcc = 0;
          g.trail.push(g.pos.slice());
          if (g.trail.length > 700) { g.trail = g.trail.slice(-500); if (this.trails[id]) this.trails[id].setLatLngs(g.trail); }
          else if (this.trails[id]) this.trails[id].addLatLng(g.pos);
        }
      });
    }

    tick() {
      this.reloj += 1;
      this.eventos.filter(e => e[0] === this.reloj).forEach(([, id, tipo]) => this.eventoGps(id, tipo));
      this.pintarAlertas();
      if (this.gpsRowVal && this.selVan) {
        const g = this.gps[this.selVan.id];
        this.gpsRowVal.textContent = g.online ? 'En vivo · compartiendo' : 'Apagada hace ' + this.fmtDur(this.reloj - g.off);
        this.gpsRowVal.setAttribute('style', 'font-size:13px;text-align:right;font-weight:600;color:' + (g.online ? '#136d41' : '#9c2f26'));
      }
    }

    eventoGps(id, tipo) {
      const g = this.gps[id], v = VANS.filter(x => x.id === id)[0];
      if (!g || !v) return;
      if (tipo === 'off' && g.online) {
        g.online = false; g.off = this.reloj;
        this.alertas.unshift({ tipo: 'off', van: v, hora: this.horaSim() });
        this.toast('⚠ ' + v.id + ' · ' + v.chofer + ' apagó la ubicación', '#9c2f26', '#fdeceb');
      } else if (tipo === 'on' && !g.online) {
        const dur = this.reloj - g.off;
        g.online = true; g.off = null;
        this.alertas.unshift({ tipo: 'on', van: v, hora: this.horaSim(), dur });
        this.toast('✓ ' + v.id + ' volvió a compartir · estuvo ' + this.fmtDur(dur) + ' sin señal', '#136d41', '#e5f7ed');
      }
      this.alertas = this.alertas.slice(0, 6);
      this.refrescar();
    }

    toast(txt, fg, bg) {
      const t = el('div', 'background:' + bg + ';color:' + fg + ';border:1px solid ' + fg + '33;font-size:12.5px;font-weight:600;padding:8px 14px;border-radius:99px;box-shadow:0 8px 20px -8px rgba(0,0,0,.35);white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis', txt);
      this.toastsEl.appendChild(t);
      setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 6000);
    }

    pintarAlertas() {
      const off = VANS.filter(v => this.gps[v.id] && !this.gps[v.id].online);
      const A = this.alertasEl;
      if (!off.length && !this.alertas.length) { A.style.display = 'none'; return; }
      A.setAttribute('style', 'display:flex;flex-wrap:wrap;align-items:center;gap:7px;padding:8px 16px;background:#fff;border-bottom:1px solid #e6e2db;flex:none');
      A.textContent = '';
      A.appendChild(el('span', 'font-size:10px;font-weight:700;letter-spacing:.08em;color:#9c2f26', 'ALERTAS GPS'));
      off.forEach(v => {
        const g = this.gps[v.id];
        const chip = el('span', 'display:inline-flex;align-items:center;gap:6px;background:#fdeceb;color:#9c2f26;font-size:12px;font-weight:600;border-radius:99px;padding:5px 11px;white-space:nowrap;cursor:pointer');
        chip.appendChild(el('span', 'width:8px;height:8px;border-radius:99px;background:#dd4f43'));
        chip.appendChild(el('span', '', v.id + ' · ' + v.chofer + ' · sin ubicación hace ' + this.fmtDur(this.reloj - g.off)));
        chip.onclick = () => { this.selVan = v; this.sel = null; this.selPros = null; this.refrescar(); };
        A.appendChild(chip);
      });
      this.alertas.filter(a => a.tipo === 'on').slice(0, 2).forEach(a => {
        A.appendChild(el('span', 'display:inline-flex;align-items:center;gap:6px;background:#e5f7ed;color:#136d41;font-size:12px;font-weight:550;border-radius:99px;padding:5px 11px;white-space:nowrap', a.van.id + ' volvió ' + a.hora + ' · ' + this.fmtDur(a.dur) + ' apagada'));
      });
    }

    async cargarComercios() {
      this.osmStatus = 'cargando';
      this.pintarChipOsm();
      const CACHE_KEY = 'tregar_osm_comercios_v1';
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const c = JSON.parse(raw);
          if (c && c.t && Date.now() - c.t < 7 * 86400e3 && Array.isArray(c.d) && c.d.length) {
            this.prospectos = c.d; this.osmStatus = 'ok'; this.refrescar(); return;
          }
        }
      } catch (e) {}
      const query = '[out:json][timeout:30];(nwr["shop"~"^(supermarket|convenience|kiosk|bakery|butcher|greengrocer|dairy|deli|confectionery|pastry|frozen_food|general|food)$"](-33.19,-64.43,-33.05,-64.26);nwr["amenity"~"^(cafe|restaurant|fast_food|bar|ice_cream)$"](-33.19,-64.43,-33.05,-64.26););out center 700;';
      const urls = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
      for (const u of urls) {
        try {
          const res = await fetch(u, { method: 'POST', body: 'data=' + encodeURIComponent(query), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
          if (!res.ok) continue;
          const json = await res.json();
          const vistos = {};
          this.prospectos = (json.elements || []).map(e => {
            const lat = e.lat != null ? e.lat : (e.center && e.center.lat);
            const lon = e.lon != null ? e.lon : (e.center && e.center.lon);
            if (lat == null || lon == null) return null;
            const tags = e.tags || {};
            const clave = tags.shop || tags.amenity;
            const tipo = TIPOS[clave] || 'Comercio';
            const dir = tags['addr:street'] ? tags['addr:street'] + (tags['addr:housenumber'] ? ' ' + tags['addr:housenumber'] : '') : '';
            const id = e.type + '/' + e.id;
            if (vistos[id]) return null; vistos[id] = 1;
            return { id, nombre: tags.name || tipo + ' (sin nombre)', tipo, lat, lon, dir, src: 'osm' };
          }).filter(Boolean);
          this.osmStatus = 'ok';
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d: this.prospectos })); } catch (e) {}
          this.refrescar();
          return;
        } catch (e) {}
      }
      // Sin conexión con OpenStreetMap: usar el listado de referencia precargado
      this.prospectos = LOCALES.slice();
      this.osmStatus = 'local';
      this.refrescar();
    }

    pintarChipOsm() {
      if (!this.chipOsm) return;
      if (this.osmStatus === 'cargando') { this.chipOsm.setAttribute('style', chipStyle(false, '#55555e')); this.chipOsm.textContent = 'Buscando comercios…'; }
      else { this.chipOsm.setAttribute('style', chipStyle(this.verComercios, '#55555e')); this.chipOsm.textContent = 'Comercios (' + this.prospectos.length + ')'; }
    }

    colorDe(c) {
      if (this.modo === 'zona') return ZONAS[c.zona] || '#6f6f76';
      if (this.modo === 'van') { const v = VANS.filter(x => x.id === c.van)[0]; return v ? v.color : '#6f6f76'; }
      return ESTADOS[c.estado].color;
    }

    visibles() {
      return this.clientes.filter(c => this.vanFiltro === 'Todas' || c.van === this.vanFiltro);
    }

    refrescar() {
      Object.keys(this.btnModo).forEach(k => this.btnModo[k].setAttribute('style', tabStyle(this.modo === k, '#c2377e')));
      Object.keys(this.chipsVan).forEach(k => {
        const v = VANS.filter(x => x.id === k)[0];
        this.chipsVan[k].setAttribute('style', chipStyle(this.vanFiltro === k, v ? v.color : '#c2377e'));
      });
      const vis = this.visibles();
      this.pintarChipOsm();
      this.conteo.textContent = vis.length + ' clientes · ' + (this.verComercios && this.prospectos.length ? this.prospectos.length + ' comercios · ' : '') + (this.vanFiltro === 'Todas' ? VANS.length + ' camionetas' : this.vanFiltro);
      this.dibujarPuntos(vis);
      this.dibujarLeyenda();
      this.dibujarDetalle();
    }

    dibujarPuntos(vis) {
      if (!this.map) return;
      const L = this.L;
      this.capaPuntos.clearLayers();
      this.capaVans.clearLayers();
      this.capaRutas.clearLayers();
      this.capaProspectos.clearLayers();

      if (this.verComercios && this.prospectos.length) {
        this.prospectos.forEach(pr => {
          const activo = this.selPros && this.selPros.id === pr.id;
          L.circleMarker([pr.lat, pr.lon], {
            radius: activo ? 6 : 4,
            color: activo ? '#16161a' : '#fff', weight: activo ? 2 : 1,
            fillColor: '#6d6d78', fillOpacity: .7
          }).addTo(this.capaProspectos)
            .bindTooltip(pr.tipo + ' · ' + pr.nombre, { direction: 'top', offset: [0, -5] })
            .on('click', () => { this.selPros = pr; this.sel = null; this.selVan = null; this.refrescar(); });
        });
      }

      VANS.forEach(v => {
        if (this.vanFiltro !== 'Todas' && v.id !== this.vanFiltro) return;
        const g = this.gps[v.id] || { online: true, pos: [v.lat, v.lon], trail: [], ruta: [] };
        const plan = g.ruta && g.ruta.length > 1 ? g.ruta : null;
        if (this.verRutas && plan) {
          L.polyline(plan, { color: v.color, weight: 2, opacity: .3, dashArray: '5 6' }).addTo(this.capaRutas);
        }
        // Recorrido hecho (trail en vivo)
        this.trails[v.id] = L.polyline(g.trail.slice(-700), { color: v.color, weight: 3, opacity: g.online ? .8 : .45 }).addTo(this.capaRutas);
        const icono = L.divIcon({
          className: '',
          html: '<div style="position:relative;width:30px;height:24px;border-radius:5px;background:' + (g.online ? v.color : '#8b8b96') +
            ';color:#fff;display:flex;align-items:center;justify-content:center;font:600 10.5px/1 \'Plus Jakarta Sans\',system-ui,sans-serif;border:2px solid #fff;box-shadow:0 3px 8px -2px rgba(0,0,0,.5)' + (g.online ? '' : ';opacity:.9') + '">' +
            v.id.replace('V-', '') +
            (g.online ? '' : '<span style="position:absolute;top:-6px;right:-6px;width:13px;height:13px;border-radius:99px;background:#dd4f43;color:#fff;font-size:9px;display:flex;align-items:center;justify-content:center">!</span>') +
            '</div>',
          iconSize: [30, 24], iconAnchor: [15, 12]
        });
        this.vanMarkers[v.id] = L.marker(g.pos, { icon: icono, zIndexOffset: 500 })
          .addTo(this.capaVans)
          .bindTooltip(v.id + ' · ' + v.chofer + (g.online ? ' · en vivo' : ' · SIN UBICACIÓN'), { direction: 'top', offset: [0, -10] })
          .on('click', () => { this.selVan = v; this.sel = null; this.selPros = null; this.dibujarDetalle(); });
      });

      vis.forEach(c => {
        const color = this.colorDe(c);
        const activo = this.sel && this.sel.id === c.id;
        L.circleMarker([c.lat, c.lon], {
          radius: 6 + Math.min(6, c.pedidos / 9),
          color: activo ? '#16161a' : '#fff',
          weight: activo ? 3 : 2,
          fillColor: color, fillOpacity: .95
        }).addTo(this.capaPuntos)
          .bindTooltip(c.nombre, { direction: 'top', offset: [0, -6] })
          .on('click', () => { this.sel = c; this.selVan = null; this.selPros = null; this.refrescar(); });
      });
    }

    dibujarLeyenda() {
      const L = this.leyenda;
      L.textContent = '';
      const titulos = { estado: 'ESTADO DE LA VISITA', zona: 'ZONAS', van: 'CAMIONETAS' };
      L.appendChild(el('div', 'font-size:9.5px;font-weight:600;letter-spacing:.06em;color:#6f6f76;margin-bottom:7px', titulos[this.modo]));
      let items;
      if (this.modo === 'estado') items = Object.keys(ESTADOS).map(k => [ESTADOS[k].color, ESTADOS[k].label]);
      else if (this.modo === 'zona') items = Object.keys(ZONAS).map(k => [ZONAS[k], k]);
      else items = VANS.map(v => [v.color, v.id + ' · ' + v.zona]);
      items.forEach(([color, txt]) => {
        const fila = el('div', 'display:flex;align-items:center;gap:7px;padding:2px 0');
        fila.appendChild(el('span', 'width:10px;height:10px;flex:none;border-radius:99px;background:' + color));
        fila.appendChild(el('span', 'font-size:11.5px;line-height:1.3;color:#43434a', txt));
        L.appendChild(fila);
      });
      if (this.verComercios && this.prospectos.length) {
        const fila = el('div', 'display:flex;align-items:center;gap:7px;padding:5px 0 2px;margin-top:4px;border-top:1px solid #f0ede7');
        fila.appendChild(el('span', 'width:7px;height:7px;flex:none;border-radius:99px;background:#6d6d78;opacity:.7'));
        fila.appendChild(el('span', 'font-size:11px;line-height:1.3;color:#6f6f76', this.osmStatus === 'ok' ? 'Comercio de la ciudad (OpenStreetMap)' : 'Comercio de la ciudad (referencia)'));
        L.appendChild(fila);
      }
    }

    toggleAdd() {
      this.addMode = !this.addMode;
      this.banner.style.display = this.addMode ? 'block' : 'none';
      this.mapEl.style.cursor = this.addMode ? 'crosshair' : '';
      this.aplicarLayout();
    }

    crearCliente(latlng) {
      this.nuevos += 1;
      const c = {
        id: 'C-' + String(200 + this.nuevos), nombre: 'Negocio nuevo ' + this.nuevos,
        lat: latlng.lat, lon: latlng.lng, zona: 'Centro', van: this.vanFiltro === 'Todas' ? 'V-01' : this.vanFiltro,
        estado: 'gris', pedidos: 0, ultFecha: '—', ultTotal: '—', ultDetalle: 'Todavía no compró.',
        mail: '', prox: '—', nota: 'Punto agregado desde el mapa. Falta completar los datos.', nuevo: true
      };
      this.clientes.push(c);
      this.sel = c; this.selVan = null; this.selPros = null;
      this.toggleAdd();
      this.refrescar();
    }

    sumarProspecto(pr) {
      const zona = zonaCercana(pr.lat, pr.lon);
      const c = {
        id: 'C-' + String(200 + (++this.nuevos)), nombre: pr.nombre,
        lat: pr.lat, lon: pr.lon, zona, van: VAN_POR_ZONA[zona] || 'V-01',
        estado: 'gris', pedidos: 0, ultFecha: '—', ultTotal: '—', ultDetalle: 'Todavía no compró.',
        mail: '', prox: '—', nota: pr.tipo + (pr.dir ? ' · ' + pr.dir : '') + '. Sumado desde el mapa de comercios.', nuevo: true
      };
      this.prospectos = this.prospectos.filter(x => x.id !== pr.id);
      this.clientes.push(c);
      this.sel = c; this.selPros = null; this.selVan = null;
      this.refrescar();
    }

    fila(label, valor, estilo) {
      const f = el('div', 'display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:7px 0;border-bottom:1px solid #f0ede7');
      f.appendChild(el('span', 'font-size:12.5px;color:#6f6f76;flex:none', label));
      f.appendChild(el('span', 'font-size:13px;text-align:right;min-width:0;' + (estilo || 'font-weight:550'), valor));
      return f;
    }

    dibujarDetalle() {
      const d = this.detalle;
      d.textContent = '';

      if (this.selVan && !this.sel) {
        const v = this.selVan;
        const g = this.gps[v.id];
        const suyos = this.clientes.filter(c => c.van === v.id);
        d.appendChild(el('div', 'font-size:11px;font-weight:600;letter-spacing:.05em;color:' + v.color, v.id + ' · ' + v.patente));
        d.appendChild(el('div', 'font-size:21px;font-weight:450;letter-spacing:-.025em;line-height:1.2;margin-top:3px', v.nombre));
        d.appendChild(el('div', 'font-size:13px;color:#6f6f76;margin-top:3px', v.chofer + ' · ' + v.zona));
        if (g && !g.online) {
          const av = el('div', 'display:flex;gap:9px;background:#fdeceb;border-radius:9px;padding:11px 13px;margin-top:12px');
          av.appendChild(el('span', 'font-size:15px;line-height:1.2', '⚠'));
          av.appendChild(el('span', 'font-size:13px;line-height:1.5;color:#9c2f26', 'Ubicación apagada. Se muestra la última posición conocida.'));
          d.appendChild(av);
        }
        const box = el('div', 'margin-top:14px');
        const fGps = el('div', 'display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:7px 0;border-bottom:1px solid #f0ede7');
        fGps.appendChild(el('span', 'font-size:12.5px;color:#6f6f76;flex:none', 'Ubicación'));
        this.gpsRowVal = el('span', 'font-size:13px;text-align:right;font-weight:600;color:' + (g && g.online ? '#136d41' : '#9c2f26'),
          g ? (g.online ? 'En vivo · compartiendo' : 'Apagada hace ' + this.fmtDur(this.reloj - g.off)) : '—');
        fGps.appendChild(this.gpsRowVal);
        box.appendChild(fGps);
        box.appendChild(this.fila('Negocios asignados', String(suyos.length)));
        box.appendChild(this.fila('Visitados hoy', String(suyos.filter(c => c.estado === 'verde').length)));
        box.appendChild(this.fila('Sin comprar', String(suyos.filter(c => c.estado === 'amarillo').length)));
        box.appendChild(this.fila('Para volver', String(suyos.filter(c => c.estado === 'naranja').length)));
        box.appendChild(this.fila('Dados de baja', String(suyos.filter(c => c.estado === 'rojo').length)));
        d.appendChild(box);
        d.appendChild(el('div', 'font-size:11.5px;color:#a4a4ae;line-height:1.5;margin-top:10px', 'El recorrido se dibuja con la ubicación del teléfono del preventista (demo simulada). La línea llena es lo recorrido; la punteada, la ruta del día.'));
        const lista = el('div', 'margin-top:16px;display:flex;flex-direction:column;gap:6px');
        lista.appendChild(el('div', 'font-size:11px;font-weight:600;letter-spacing:.05em;color:#6f6f76;margin-bottom:2px', 'RECORRIDO DE HOY'));
        suyos.forEach((c, i) => {
          const f = el('button', 'display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:1px solid #e6e2db;border-radius:8px;background:#fff;padding:8px 10px;cursor:pointer');
          f.appendChild(el('span', 'font-size:11px;font-weight:600;color:#a4a4ae;width:14px', String(i + 1)));
          f.appendChild(el('span', 'width:9px;height:9px;flex:none;border-radius:99px;background:' + ESTADOS[c.estado].color));
          f.appendChild(el('span', 'flex:1;min-width:0;font-size:13px;font-weight:450', c.nombre));
          f.onclick = () => { this.sel = c; this.selVan = null; this.refrescar(); };
          lista.appendChild(f);
        });
        d.appendChild(lista);
        return;
      }

      if (this.selPros && !this.sel && !this.selVan) {
        const pr = this.selPros;
        d.appendChild(el('div', 'font-size:11px;font-weight:600;letter-spacing:.05em;color:#55555e', 'COMERCIO DE LA CIUDAD'));
        d.appendChild(el('div', 'font-size:21px;font-weight:450;letter-spacing:-.025em;line-height:1.2;margin-top:3px', pr.nombre));
        const pills = el('div', 'display:flex;flex-wrap:wrap;gap:6px;margin-top:10px');
        pills.appendChild(pill(pr.tipo, '#f2efe9', '#55555e'));
        pills.appendChild(pill('No es cliente todavía', '#fdf6e0', '#7a5c07'));
        d.appendChild(pills);
        const datos = el('div', 'margin-top:14px');
        if (pr.dir) datos.appendChild(this.fila('Dirección', pr.dir));
        datos.appendChild(this.fila('Zona estimada', zonaCercana(pr.lat, pr.lon)));
        datos.appendChild(this.fila('Coordenadas', pr.lat.toFixed(4) + ', ' + pr.lon.toFixed(4), 'font-size:12px;color:#6f6f76'));
        d.appendChild(datos);
        const btn = el('button', 'width:100%;min-height:44px;margin-top:16px;border:0;border-radius:9px;background:#c2377e;color:#fff;font-size:13.5px;font-weight:600;cursor:pointer', 'Sumar como cliente');
        btn.onclick = () => this.sumarProspecto(pr);
        d.appendChild(btn);
        d.appendChild(el('div', 'font-size:11.5px;color:#a4a4ae;line-height:1.5;margin-top:10px', pr.src === 'osm' ? 'Queda gris (sin visitar) hasta que pase la camioneta. Datos del comercio: © OpenStreetMap contributors.' : 'Queda gris (sin visitar) hasta que pase la camioneta. Listado de referencia: confirmá nombre y dirección antes de visitar.'));
        return;
      }

      const c = this.sel;
      if (!c) { d.appendChild(el('div', 'font-size:13.5px;color:#6f6f76;line-height:1.5', 'Tocá un negocio del mapa para ver su ficha.')); return; }

      const e = ESTADOS[c.estado];
      const v = VANS.filter(x => x.id === c.van)[0];
      const nc = nivelColor(c.pedidos);

      d.appendChild(el('div', 'font-size:11px;font-weight:600;letter-spacing:.05em;color:#c2377e', c.id + ' · ' + c.zona));
      d.appendChild(el('div', 'font-size:21px;font-weight:450;letter-spacing:-.025em;line-height:1.2;margin-top:3px', c.nombre));

      const pills = el('div', 'display:flex;flex-wrap:wrap;gap:6px;margin-top:10px');
      pills.appendChild(pill(e.label, e.soft, e.deep));
      pills.appendChild(pill(nivel(c.pedidos), nc[0], nc[1]));
      if (v) pills.appendChild(pill(v.id, '#f2efe9', v.color));
      d.appendChild(pills);

      if (c.estado === 'naranja') {
        const av = el('div', 'display:flex;gap:9px;background:#fdf1e0;border-radius:9px;padding:11px 13px;margin-top:12px');
        av.appendChild(el('span', 'font-size:15px;line-height:1.2', '↻'));
        av.appendChild(el('span', 'font-size:13px;line-height:1.5;color:#7a4508', 'Volver el ' + c.prox + ' a ofrecerle los productos nuevos.'));
        d.appendChild(av);
      }
      if (c.estado === 'rojo') {
        const av = el('div', 'display:flex;gap:9px;background:#fdeceb;border-radius:9px;padding:11px 13px;margin-top:12px');
        av.appendChild(el('span', 'font-size:15px;line-height:1.2', '✕'));
        av.appendChild(el('span', 'font-size:13px;line-height:1.5;color:#9c2f26', 'Dado de baja. No entra en el recorrido hasta que lo reactive administración.'));
        d.appendChild(av);
      }

      const datos = el('div', 'margin-top:14px');
      datos.appendChild(this.fila('Pedidos históricos', String(c.pedidos)));
      datos.appendChild(this.fila('Camioneta', v ? v.id + ' · ' + v.chofer : '—'));
      datos.appendChild(this.fila('Próxima visita', c.prox === '—' ? 'Sin agendar' : c.prox));
      datos.appendChild(this.fila('Coordenadas', c.lat.toFixed(4) + ', ' + c.lon.toFixed(4), 'font-size:12px;color:#6f6f76'));
      d.appendChild(datos);

      d.appendChild(el('div', 'font-size:11px;font-weight:600;letter-spacing:.05em;color:#6f6f76;margin:18px 0 8px', 'PEDIDO ANTERIOR'));
      const prev = el('div', 'background:#f7f5f1;border:1px solid #e6e2db;border-radius:9px;padding:12px 13px');
      const cab = el('div', 'display:flex;justify-content:space-between;align-items:baseline;gap:10px');
      cab.appendChild(el('span', 'font-size:12.5px;color:#6f6f76', c.ultFecha));
      cab.appendChild(el('span', 'font-size:17px;font-weight:450;letter-spacing:-.02em', c.ultTotal));
      prev.appendChild(cab);
      prev.appendChild(el('div', 'font-size:12.5px;line-height:1.55;color:#43434a;margin-top:6px', c.ultDetalle));
      d.appendChild(prev);

      d.appendChild(el('div', 'font-size:11px;font-weight:600;letter-spacing:.05em;color:#6f6f76;margin:18px 0 8px', 'NOVEDADES POR MAIL'));
      const mailBox = el('div', 'background:#e8f0fd;border-radius:9px;padding:12px 13px');
      mailBox.appendChild(el('div', 'font-size:13px;font-weight:550;color:#1b4a99;word-break:break-all', c.mail || 'Sin mail cargado'));
      mailBox.appendChild(el('div', 'font-size:12.5px;line-height:1.5;color:#1b4a99;margin-top:4px;opacity:.85',
        c.mail ? 'Recibe el catálogo de productos nuevos desde novedades@tregar.com.ar' : 'Cargá el mail para que le lleguen los productos nuevos de Tregar.'));
      const btnMail = el('button', 'width:100%;min-height:40px;margin-top:10px;border:0;border-radius:8px;background:#2563c9;color:#fff;font-size:13px;font-weight:600;cursor:pointer', 'Enviar novedades de septiembre');
      btnMail.onclick = () => {
        btnMail.textContent = '✓ Mail enviado';
        btnMail.style.background = '#1f9d5f';
      };
      mailBox.appendChild(btnMail);
      d.appendChild(mailBox);

      d.appendChild(el('div', 'font-size:11px;font-weight:600;letter-spacing:.05em;color:#6f6f76;margin:18px 0 8px', 'NOTA DEL PREVENTISTA'));
      d.appendChild(el('div', 'font-size:13px;line-height:1.55;color:#43434a', c.nota));

      d.appendChild(el('div', 'font-size:11px;font-weight:600;letter-spacing:.05em;color:#6f6f76;margin:18px 0 8px', 'CAMBIAR ESTADO'));
      const grp = el('div', 'display:flex;flex-wrap:wrap;gap:6px');
      Object.keys(ESTADOS).forEach(k => {
        const b = el('button', 'border:1px solid ' + (c.estado === k ? ESTADOS[k].color : '#e6e2db') +
          ';border-radius:99px;background:' + (c.estado === k ? ESTADOS[k].soft : '#fff') +
          ';color:' + (c.estado === k ? ESTADOS[k].deep : '#43434a') +
          ';font-size:12px;font-weight:550;padding:7px 11px;cursor:pointer;display:flex;align-items:center;gap:6px');
        b.appendChild(el('span', 'width:8px;height:8px;border-radius:99px;background:' + ESTADOS[k].color));
        b.appendChild(el('span', '', ESTADOS[k].label));
        b.onclick = () => { c.estado = k; this.refrescar(); };
        grp.appendChild(b);
      });
      d.appendChild(grp);
    }
  }

  if (!customElements.get('mapa-reparto')) customElements.define('mapa-reparto', MapaReparto);
})();
