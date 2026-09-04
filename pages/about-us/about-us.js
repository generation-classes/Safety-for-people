const team = [
    {
        nombre: 'Lizeth Caro Silva',
        rol: 'Desarrolladora Full Stack',
        foto: '../../Assets/images/profile pics/lizeth.png',
        bio: 'Desarrolladora Full Stack enfocada en crear soluciones tecnológicas innovadoras y experiencias digitales de extremo a extremo.',
        github: 'https://github.com/lizethcarosilva',
        // email: '#',
        linkedin: 'https://www.linkedin.com/in/liancasi/',
    },
    {
        nombre: 'Martha Caro',
        rol: 'Desarrolladora Full Stack',
        foto: '../../Assets/images/profile pics/martha.jpeg',
        bio: 'Especialista en experiencias de usuario intuitivas y diseños atractivos.',
        github: 'https://github.com/MarthajCaro',
        // email: '#',
        linkedin: 'https://www.linkedin.com/in/marthacaro/',
    },
    {
        nombre: 'Jhojan Sebastian Cordoba',
        rol: 'Desarrollador Full Stack',
        foto: '../../Assets/images/profile pics/sebastian.png',
        bio: 'Experto en bases de datos y aseguramiento de calidad de software.',
        github: 'https://github.com/sebascba',
        // email: '#',
        linkedin: 'https://www.linkedin.com/in/jhohan-sebastian-cordoba-palacios-8174b8188/',
    },
    {
        nombre: 'Julian Steven Castellanos Niño',
        rol: 'Desarrollador Full Stack',
        foto: '../../Assets/images/profile pics/Julian.png',
        bio: 'Desarrollador backend enfocado en construir sistemas robustos y escalables.',
        github: 'https://github.com/iTzJulians',
        // email: '#',
        linkedin: 'https://www.linkedin.com/in/julian-castellanos-/',
    },
    {
        nombre: 'Santiago David Garcia',
        rol: 'Desarrollador Full Stack',
        foto: '../../Assets/images/profile pics/santiago.jpeg',
        bio: 'Ingeniero en DevOps y Cloud, encargado de la infraestructura y despliegue continuo.',
        github: 'https://github.com/dargarciacol',
        // email: '#',
        linkedin: '#',
    },
];

function renderTeam() {
    const grid = document.getElementById('teamGrid');
    if (!grid) return;

    grid.innerHTML = team.map(miembro => `
        <div class="col-7 col-md-5 col-lg-4 col-xl-3">
            <article class="card card-equipo h-100 text-center">
                <div class="card-flip rounded-4 border border-2 border-success">
                    <div class="front d-flex flex-column gap-2 p-4 pt-3">
                        <img class="rounded-circle w-75 border border-2 border-success img-equipo mx-auto"
                            src="${miembro.foto}" alt="Foto de ${miembro.nombre}">
                        <h2 class="fw-bolder fs-4">${miembro.nombre}</h2>
                        <h3 class="fw-medium fs-6 role-text text-secondary px-1">${miembro.rol}</h3>
                    </div>
                    <div class="back d-flex flex-column justify-content-center align-items-center gap-2 p-4">
                        <p class="mb-0">${miembro.bio}</p>
                        <div class="social-icons d-flex justify-content-center align-items-center gap-2">
                            <a href="${miembro.github}"
                                class="icono border border-2 border-success rounded-3 d-flex justify-content-center align-items-center"><i
                                    class="bi bi-github text-success fs-4"></i></a>
                            <a href="${miembro.linkedin}"
                                class="icono border border-2 border-success rounded-3 d-flex justify-content-center align-items-center"><i
                                    class="bi bi-linkedin text-success fs-4"></i></a>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    `).join('');
}

document.addEventListener('click', function (e) {
    const card = e.target.closest('.card-equipo');
    if (!card || e.target.closest('a')) return;
    card.classList.toggle('is-flipped');
});

renderTeam();
