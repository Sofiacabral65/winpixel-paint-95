// WINPIXEL PAINT 95 - LÓGICA DE PROGRAMACIÓN (JAVASCRIPT)


document.addEventListener('DOMContentLoaded', () => {    
    // 1. SELECCIÓN DE ELEMENTOS (Nuestros "Conectores" con el HTML) ---
    // Guardamos en variables los elementos que vamos a manipular
    const lienzo = document.getElementById('lienzo');
    const paletteColors = document.querySelectorAll('.palette-color'); // devuelve una lista de todos los colores
    const btnPincel = document.getElementById('btnPincel');
    const btnGoma = document.getElementById('btnGoma');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const instrucciones = document.querySelector('.instrucciones');
    
    // Variables para el Pop-up de bienvenida
    const welcomeScreen = document.getElementById('welcomeScreen');
    const btnStart = document.getElementById('btnStart');

    // 2. ESTADO DE LA APLICACIÓN (La "Memoria" del programa) 
    let colorActual = '#000000'; // empezamos pintando en negro
    let pintando = false; // interruptor: ¿Estoy apretando el botón? (true/false)
    let modo = 'pincel'; // herramienta actual: 'pincel' o 'goma'

    // 3. LÓGICA DEL POP-UP (BIENVENIDA) 
    // si existen los elementos, añadimos el evento para cerrar el modal   
    if (welcomeScreen && btnStart) {
        btnStart.addEventListener('click', () => {
            welcomeScreen.style.display = 'none'; // ocultamos la capa oscura (display: none) para "entrar" al juego
        });
    }

    // 4. LÓGICA DE LA PALETA DE COLORES
    // Recorre cada cuadradito de color de la lista
    paletteColors.forEach(colorBox => {
        colorBox.addEventListener('click', () => {
            // A. Obtener color: Leemos el código HEX guardado en el atributo 'data-color' del HTML
            colorActual = colorBox.getAttribute('data-color');
            
            // B. Feedback Visual: Quitamos la clase 'selected' a todos y se la ponemos al clicado
            paletteColors.forEach(c => c.classList.remove('selected'));
            colorBox.classList.add('selected');
            
            // C. Lógica: Si elijo un color, automáticamente vuelvo al modo pincel
            modo = 'pincel';
            actualizarBotones(); // actualiza la apariencia de los botones de herramientas
            instrucciones.textContent = `Color seleccionado: ${colorActual}`;
        });
    });

    // 5. FUNCIÓN MAESTRA: CREAR LA REJILLA
    // Genera dinámicamente los 900 cuadraditos (30x30) del lienzo
    function crearGrid() {
        // 30x30 = 900 pixeles
        for (let i = 0; i < 900; i++) {
            //Llega a 900 porque quería una cuadrícula de 30x30. Multiplicando 30 por 30 me da los 900 divs que necesito crear.

            // 1. Crear un div nuevo
            const pixel = document.createElement('div');
            pixel.classList.add('pixel'); // añadirle la clase CSS para que tenga borde y tamaño

            // EVENTOS DE MOUSE (Para PC)

            // cuando hago click (bajo el dedo)
            pixel.addEventListener('mousedown', (e) => {
                e.preventDefault(); // evita comportamientos raros de arrastre
                pintando = true; // enciende el interrupto
                pintar(pixel); // pintamos este pixel inmediatamente
            });

            // cuando paso el ratón por encima
            pixel.addEventListener('mouseover', () => {
                if (pintando) { // solo pintamos si el interruptor está encendido (click sostenido)
                    pintar(pixel);
                }
            });

            // EVENTOS DE TOUCH (Para Móvil/Tablet)
            // Al tocar la pantalla

            // al tocar la pantalla
            pixel.addEventListener('touchstart', (e) => {
                e.preventDefault(); // evita scroll mientras pintas
                pintando = true;
                pintar(pixel);
            }, { passive: false });

            // al arrastrar el dedo por la pantalla
            pixel.addEventListener('touchmove', (e) => {
                e.preventDefault(); // evita scroll 
                if (pintando) {
                    // PROBLEMA TÉCNICO: En móvil, el evento 'touchmove' se dispara sobre el elemento
                    // donde EMPEZÓ el toque, no sobre el que está debajo del dedo ahora.

                    // SOLUCIÓN:
                    // 1. Obtenemos las coordenadas (X, Y) de donde está el dedo
                    const touch = e.touches[0];
                    // 2. Preguntamos al documento: "¿Qué elemento hay en estas coordenadas?"
                    const elementoBajoDedo = document.elementFromPoint(touch.clientX, touch.clientY);
                    
                    // 3. Si encontramos un elemento y es un pixel, lo pintamos
                    if (elementoBajoDedo && elementoBajoDedo.classList.contains('pixel')) {
                        pintar(elementoBajoDedo);
                    }
                }
            }, { passive: false });
            
            // al levantar el dedo
            pixel.addEventListener('touchend', () => {
                pintando = false;
            });

            // añadimos el pixel al lienzo
            lienzo.appendChild(pixel);
        }
    }

    // 6. FUNCIÓN PARA PINTAR O BORRAR)
    // recibe el div específico que queremos modificar
    function pintar(elementoPixel) {
        if (modo === 'pincel') {
            // PINCEL: Cambiamos el color de fondo y quitamos el borde punteado
            elementoPixel.style.backgroundColor = colorActual;
            elementoPixel.style.border = 'none'; // Color sólido
        } else if (modo === 'goma') {
            // GOMA: Ponemos fondo transparente
            elementoPixel.style.backgroundColor = 'transparent';
            // Restauramos los bordes punteados para que se vea la guía
            elementoPixel.style.borderRight = '1px dotted #ccc';
            elementoPixel.style.borderBottom = '1px dotted #ccc';
        }
    }

    // 7. EVENTOS GLOBALES Y HERRAMIENTAS    
    // si suelto el click FUERA del lienzo, también debo dejar de pintar
    window.addEventListener('mouseup', () => {
        pintando = false;
    });

    // Botón Goma
    btnGoma.addEventListener('click', () => {
        modo = 'goma';
        actualizarBotones();
        instrucciones.textContent = "Modo: Goma de borrar";
    });

    // Botón Pincel
    btnPincel.addEventListener('click', () => {
        modo = 'pincel';
        actualizarBotones();
        instrucciones.textContent = "Modo: Pincel";
    });

    // Botón Limpiar Todo
    btnLimpiar.addEventListener('click', () => {
        // Pedimos confirmación para evitar accidentes
        if(confirm("¿Seguro que quieres borrar tu obra de arte?")) {
            const todosLosPixels = document.querySelectorAll('.pixel');
            // Recorremos los 900 pixeles y los reiniciamos a transparente
            todosLosPixels.forEach(pixel => {
                pixel.style.backgroundColor = 'transparent';
                pixel.style.borderRight = '1px dotted #ccc';
                pixel.style.borderBottom = '1px dotted #ccc';
            });
        }
    });

    // Actualizar visualmente qué botón está activo/parece presionado
    function actualizarBotones() {
        if (modo === 'pincel') {
            btnPincel.classList.add('active'); // hundimos el pincel
            btnGoma.classList.remove('active'); // levantamos la goma
        } else {
            btnGoma.classList.add('active'); // hundimos la goma
            btnPincel.classList.remove('active'); // levantamos el pincel
        }
    }

    // 8. INICIO 
    // Ejecutamos la función para generar el tablero al cargar la página
    crearGrid();
    
});

