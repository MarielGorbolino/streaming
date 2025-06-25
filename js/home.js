const catalogo = [
  {
    titulo: "Adolescencia",
    tipo: "serie",
    imagen: "../assets/img/adolescencia_s.jpg",
    enlace: "./serie.html",
    categoria: ["drama"],
  },
  {
    titulo: "Bala Perdida 3",
    tipo: "pelicula",
    imagen: "../assets/img/bala_perdida_3.jpg",
    enlace: "./films.html",
    categoria: ["accion", "drama"],
  },
  {
    titulo: "Cafe Con Aroma De Mujer",
    tipo: "serie",
    imagen: "../assets/img/cafe_con_aroma_de_mujer_s.jpg",
    enlace: "./serie.html",
    categoria: ["romance", "drama"],
  },
  {
    titulo: "Contraataque",
    tipo: "pelicula",
    imagen: "../assets/img/contraataque.jpg",
    enlace: "./films.html",
    categoria: ["accion", "thriller"],
  },
  {
    titulo: "De Vuelta A La Accion",
    tipo: "pelicula",
    imagen: "../assets/img/de_vuelta_a_la_accion.jpg",
    enlace: "./films.html",
    categoria: ["accion", "comedia"],
  },
  {
    titulo: "El Marginal",
    tipo: "serie",
    imagen: "../assets/img/el_marginal_s.jpg",
    enlace: "./serie.html",
    categoria: ["drama", "accion"],
  },
  {
    titulo: "Estragos",
    tipo: "pelicula",
    imagen: "../assets/img/estragos.jpg",
    enlace: "./films.html",
    categoria: ["accion", "drama", "romance"],
  },
  {
    titulo: "GT Max",
    tipo: "pelicula",
    imagen: "../assets/img/gt_max_p.jpg",
    enlace: "./films.html",
    categoria: ["accion"],
  },
  {
    titulo: "La Casa De Papel",
    tipo: "serie",
    imagen: "../assets/img/la_casa_de_papel_s.jpg",
    enlace: "./serie.html",
    categoria: ["accion", "thriller"],
  },
  {
    titulo: "Rosario Tijeras",
    tipo: "serie",
    imagen: "../assets/img/rosario_tijeras_s.jpg",
    enlace: "./serie.html",
    categoria: ["drama", "romance", "accion"],
  },
  {
    titulo: "El Sindicato",
    tipo: "pelicula",
    imagen: "../assets/img/sindicato_p.jpg",
    enlace: "./films.html",
    categoria: ["accion"],
  },
  {
    titulo: "El Eternauta",
    tipo: "serie",
    imagen: "../assets/img/eternauta_s.jpg",
    enlace: "./serie.html",
    categoria: ["ciencia_ficcion", "thriller"],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".grid__container");
  const filtroTipo = document.getElementById("tipo");
  const filtroCategoria = document.getElementById("category");
  const buscador = document.getElementById("buscador");

  function filtrarCatalogo() {
    const tipoSeleccionado = filtroTipo.value;
    const categoriaSeleccionada = filtroCategoria.value;
    const textoBusqueda = buscador.value.toLowerCase().trim();

    return catalogo.filter(item => {
      const coincideTipo = tipoSeleccionado === "todo" || item.tipo === tipoSeleccionado;
      const coincideCategoria = categoriaSeleccionada === "" || item.categoria.includes(categoriaSeleccionada);
      const coincideBusqueda = item.titulo.toLowerCase().includes(textoBusqueda);
      return coincideTipo && coincideCategoria && coincideBusqueda;
    });
  }

  function renderizarCatalogo(items) {
    contenedor.innerHTML = "";
    items.forEach(item => {
      const a = document.createElement("a");
      const href = item.tipo === "serie" ? './serie.html' : './films.html';
      a.href = `${href}?titulo=${encodeURIComponent(item.titulo)}`;
      const img = document.createElement("img");
      img.src = item.imagen;
      img.alt = item.titulo;

      a.appendChild(img);
      contenedor.appendChild(a);
    });
  }

  function actualizarVista() {
    const resultado = filtrarCatalogo();
    renderizarCatalogo(resultado);
  }

  filtroTipo.addEventListener("change", actualizarVista);
  filtroCategoria.addEventListener("change", actualizarVista);
  buscador.addEventListener("input", actualizarVista);

  actualizarVista();
});
