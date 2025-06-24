const catalogo = [
  {
    titulo: "Adolescencia",
    tipo: "serie",
    imagen: "../assets/img/adolescencia_s.jpg",
    enlace: "./serie.html",
    categoria: "drama"
  },
  {
    titulo: "Bala Perdida 3",
    tipo: "pelicula",
    imagen: "../assets/img/bala_perdida_3.jpg",
    enlace: "./films.html",
    categoria: "accion"
 },
    {
    titulo: "Cafe Con Aroma De Mujer",
    tipo: "serie",
    imagen: "../assets/img/cafe_con_aroma_de_mujer_s.jpg",
    enlace: "./serie.html",
    categoria: "romance"
    },
   {
    titulo: "Contraataque",
    tipo: "pelicula",
    imagen: "../assets/img/contraataque.jpg",
    enlace: "./films.html",
    categoria: "accion"
  },
    {
    titulo: "De Vuelta A La Accion",
    tipo: "pelicula",
    imagen: "../assets/img/de_vuelta_a_la_accion.jpg",
    enlace: "./films.html",
    categoria: "accion"
  },

  {
    titulo: "El Marginal",
    tipo: "serie",
    imagen: "../assets/img/el_marginal_s.jpg",
    enlace: "./serie.html",
    categoria: "drama"
  },
    {
    titulo: "Estragos",
    tipo: "pelicula",
    imagen: "../assets/img/estragos.jpg",
    enlace: "./films.html",
    categoria: "accion"
  },
  {
    titulo: "GT Max",
    tipo: "pelicula",
    imagen: "../assets/img/gt_max_p.jpg",
    enlace: "./films.html",
    categoria: "accion"
  },
 {
    titulo: "La Casa De Papel",
    tipo: "serie",
    imagen: "../assets/img/la_casa_de_papel_s.jpg",
    enlace: "./serie.html",
    categoria: "suspenso"
  },
  {
    titulo: "Rosario Tijeras",
    tipo: "serie",
    imagen: "../assets/img/rosario_tijeras_s.jpg",
    enlace: "./serie.html",
    categoria: "drama"
  },
   {
    titulo: "El Sindicato",
    tipo: "pelicula",
    imagen: "../assets/img/sindicato_p.jpg",
    enlace: "./films.html",
    categoria: "accion"
  },

];

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".grid__container");
  const filtroTipo = document.getElementById("tipo");
  const filtroCategoria = document.getElementById("category");

  function cargarContenido(tipoSeleccionado) {
    contenedor.innerHTML = "";

    const filtrado = catalogo.filter(item => {
      return tipoSeleccionado === "todo" || item.tipo === tipoSeleccionado;
    });

    filtrado.forEach(item => {
      const a = document.createElement("a");
      
     if (item.tipo === "serie") {
        a.href = "./serie.html";
        } 
        else {
        a.href = "./films.html";
        }

      const img = document.createElement("img");
      img.src = item.imagen;
      img.alt = item.titulo;

      a.appendChild(img);
      contenedor.appendChild(a);
    });
  }

  filtroTipo.addEventListener("change", () => {
    cargarContenido(filtroTipo.value);
  });

  filtroCategoria.addEventListener("change", () => {
    cargarContenido(filtroCategoria.value);
  });


  cargarContenido("todo");
});
  
  