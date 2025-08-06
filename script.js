// 👉 Ocultar todas las secciones
function ocultarTodo() {
    document.querySelector(".bienvenida").style.display = "none";
    document.getElementById("formulario").style.display = "none";
    document.getElementById("contenido").style.display = "none";
    document.getElementById("juego").style.display = "none";
  }
  
  // 👉 Mostrar sección bienvenida
  function irAInicio() {
    ocultarTodo();
    document.querySelector(".bienvenida").style.display = "block";
  }
  
  // 👉 Mostrar formulario
  function mostrarFormulario() {
    ocultarTodo();
    document.getElementById("formulario").style.display = "block";
  }
  
  // 👉 Cerrar sesión
  function cerrarSesion() {
    localStorage.clear();
    location.reload();
  }
  
  // 👉 Evento al enviar formulario
  document.querySelector("#datosForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const nombre = document.querySelector("#nombre").value;
    const edad = parseInt(document.querySelector("#edad").value);
    localStorage.setItem("nombreUsuario", nombre);
  
    document.getElementById("formulario").style.display = "none";
    document.getElementById("contenido").style.display = "block";
    document.getElementById("juego").style.display = "block";
  
    const juegoDiv = document.getElementById("juegoContenido");
    const saludo = document.createElement("p");
    saludo.textContent = `¡Hola, ${nombre}! 😊`;
    saludo.style.fontSize = "1.2rem";
    saludo.style.fontWeight = "bold";
    saludo.style.marginBottom = "1rem";
    juegoDiv.innerHTML = "";
    juegoDiv.appendChild(saludo);
  
    if (edad < 18) {
      iniciarJuegoMemoria(juegoDiv);
    } else {
      iniciarJuegoAdivinanza(juegoDiv);
    }
  });
  
  
  // 🎮 JUEGO DE ADIVINANZA (adultos)
  function iniciarJuegoAdivinanza(container) {
    container.innerHTML += `
      <h3>🧠 Juego de Adivinanzas</h3>
      <p id="pregunta"></p>
      <input type="text" id="respuesta" placeholder="Escribe tu respuesta" />
      <button onclick="verificarRespuesta()">Enviar</button>
      <p id="resultado"></p>
    `;
  
    window.adivinanzas = [
      { pregunta: "Me debes seguir para estar bien, lo dice el doctor. ¿Qué deber soy?", respuesta: "recomendaciones médicas" },
      { pregunta: "Si quieres que te atiendan bien, debes llegar puntual. ¿Qué deber soy?", respuesta: "cumplir citas" },
      { pregunta: "No soy secreto, soy tuyo y del doctor, pero se guarda con honor. ¿Qué derecho soy?", respuesta: "historia clínica" }
    ];
  
    window.puntaje = 0;
    window.actual = 0;
  
    mostrarAdivinanza();
  }
  
  function mostrarAdivinanza() {
    document.getElementById("pregunta").textContent = adivinanzas[actual].pregunta;
  }
  
  function verificarRespuesta() {
    const input = document.getElementById("respuesta").value.toLowerCase().trim();
    const correcta = adivinanzas[actual].respuesta;
    const resultado = document.getElementById("resultado");
  
    if (input === correcta) {
      resultado.textContent = "✅ ¡Correcto!";
      puntaje++;
    } else {
      resultado.textContent = `❌ Incorrecto. Era: "${correcta}"`;
    }
  
    actual++;
    if (actual < adivinanzas.length) {
      setTimeout(() => {
        document.getElementById("respuesta").value = "";
        resultado.textContent = "";
        mostrarAdivinanza();
      }, 1500);
    } else {
      setTimeout(() => {
        const nombre = localStorage.getItem("nombreUsuario") || "Invitado";
        guardarPuntaje(nombre, puntaje);
        document.getElementById("juegoContenido").innerHTML += `
          <h3>🎉 Juego terminado</h3>
          <p>${nombre}, obtuviste ${puntaje} de ${adivinanzas.length} respuestas correctas.</p>
          <div id="historialResultados"></div>
        `;
        mostrarHistorial();
      }, 2000);
    }
  }
  
  
  // 🧠 JUEGO DE MEMORIA (niños)
  function iniciarJuegoMemoria(container) {
    const tarjetas = [
      "Derecho: Ser informado", "Derecho: Ser informado",
      "Deber: Ser amable", "Deber: Ser amable",
      "Derecho: Ser atendido", "Derecho: Ser atendido",
      "Deber: Puntualidad", "Deber: Puntualidad",
      "Derecho: Privacidad", "Derecho: Privacidad",
      "Deber: Decir la verdad", "Deber: Decir la verdad"
    ];
  
    let mezcladas = tarjetas.sort(() => 0.5 - Math.random());
    let tarjetasHTML = mezcladas
      .map(texto => `<div class="card" data-texto="${texto}" onclick="voltearCarta(this)"></div>`)
      .join("");
  
    container.innerHTML += `
      <h3>🧩 Juego de Memoria</h3>
      <p>Haz clic en las tarjetas para encontrar los pares iguales.</p>
      <div id="tablero" class="tablero">${tarjetasHTML}</div>
    `;
  
    window.primera = null;
    window.bloqueo = false;
    window.aciertos = 0;
  }
  
  function voltearCarta(carta) {
    if (bloqueo || carta.classList.contains("descubierta")) return;
  
    carta.textContent = carta.getAttribute("data-texto");
    carta.classList.add("descubierta");
  
    if (!primera) {
      primera = carta;
    } else {
      if (primera.getAttribute("data-texto") === carta.getAttribute("data-texto")) {
        aciertos++;
        primera = null;
  
        if (aciertos === 6) {
          setTimeout(() => {
            document.getElementById("juegoContenido").innerHTML += `<h3>🎉 ¡Ganaste el juego de memoria!</h3>`;
          }, 1000);
        }
      } else {
        bloqueo = true;
        setTimeout(() => {
          primera.textContent = "";
          carta.textContent = "";
          primera.classList.remove("descubierta");
          carta.classList.remove("descubierta");
          primera = null;
          bloqueo = false;
        }, 1000);
      }
    }
  }
  
  
  // 💾 GUARDAR PUNTAJE
  function guardarPuntaje(nombre, puntaje) {
    let historial = JSON.parse(localStorage.getItem("historialUsuarios")) || [];
    historial.push({ nombre, puntaje });
    localStorage.setItem("historialUsuarios", JSON.stringify(historial));
  }
  
  // 📋 MOSTRAR HISTORIAL
  function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem("historialUsuarios")) || [];
    const contenedor = document.getElementById("historialResultados");
  
    if (!contenedor) return;
  
    if (historial.length === 0) {
      contenedor.innerHTML = "<p>No hay resultados anteriores.</p>";
      return;
    }
  
    let tabla = `
      <h4>🏆 Historial de jugadores</h4>
      <table>
        <thead><tr><th>Nombre</th><th>Puntaje</th></tr></thead>
        <tbody>
          ${historial.map(item => `<tr><td>${item.nombre}</td><td>${item.puntaje}</td></tr>`).join("")}
        </tbody>
      </table>
    `;
  
    contenedor.innerHTML = tabla;
  }
  