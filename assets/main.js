const HomeView = {
  template: `
    <main id="home">
      <h1>Damien Watson</h1>
      <h2>Full Stack Software Engineer</h2>
      <p>
        <strong>People go through four stages<br /> before any revolutionary development:</strong><br />
      </p>
      <p>
        1. It&apos;s nonsense, don&apos;t waste my time.<br />
        2. It&apos;s interesting, but not important.<br />
        3. I always said it was a good idea.<br />
        4. I thought of it first.<br /><br />
        <em>Arthur C. Clarke</em>
      </p>
      <nav>
        <router-link to="/projects">GitHub Projects &amp; Skills</router-link>
      </nav>
    </main>
  `
};
const ProjectsView = {
  data() {
    return {
      username: 'DamienWatson', // 'Ph4se',
      loading: true,
      errors: false,
      perPage: 20,
      page: 1,
      projects: [],
      projectsCount: 5,
      projectsList: null,
      skills: ['React'],
      githubLink: 'https://github.com/DamienWatson',
    };
  },
  methods: {
    getProjects() {
      this.projectsList = this.projects.slice(0, this.projectsCount);
      return this.projectsList;
    },
    loadMore() {
      if (this.projectsList.length <= this.projects.length) {
        this.projectsCount += 5;
        this.getProjects();
      }
    },
    fetchData() {
      this.loading = true;
      axios.get(`https://api.github.com/users/${this.username}/repos?per_page=${this.perPage}&page=${this.page}`)
        .then((response) => {
          console.log(response.data);
          this.projects = response.data;
          this.projects.forEach(project => {
            console.log(project);
            if (project.language !== null && !this.skills.includes(project.language)) {
              this.skills.push(project.language);
            }
          });
        })
        .catch(error => {
          console.log(error);
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
          this.getProjects();
        })
    },
    trimTitle(text) {
      const clean = text.replace(/(-)/g, ' ');
      return clean;
    },
    trimText(text) {
      if (text?.length > 100) {
        return `${text.slice(0, 100)}...`;
      }

      return text;
    }
  },
  mounted() {
    this.fetchData();
  },
  template: `
  <div class="container">
    <header>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/projects">Projects</router-link>
        <a :href="githubLink" target="_blank">
          <i class="fab fa-github fa-lg fa-fw"></i>
        </a>
      </nav>
      <div class="bio">
        <h1>Damien Watson</h1>
        <h2>Full Stack Software Engineer</h2>
        <p>
          Design, desktop publishing, multimedia development, 3d modelling,<br />
          html, css, js, vueJS, React, PHP, MySQL, MOngoDB etc.
        </p>
      </div>
    </header>

    <main>
      <div class="error" v-if="errors">
        Sorry! It seems we can't fetch data right now.
      </div>
      <section v-else id="gitfolio">
        <div v-if="loading" class="loading">
          <p>Loading ...</p>
        </div>
        <div v-else class="projects">
          <div
            v-for="project in projectsList"
            :key="project.id"
            class="card"
          >
            <div>
              <h3>{{ trimTitle(project.name) }}</h3>
              <p>{{ trimText(project.description) }}</p>
            </div>
            <div class="info">
              <img :src="project.owner.avatar_url" alt="user avatar" class="avatar">
              <div class="date">
                <h4>Update at</h4>
                <p>{{ new Date(project.updated_at).toDateString() }}</p>
              </div>
            </div>
            <a :href="project.html_url" class="button">Code</a>
          </div>
        </div>

        <div
          v-if="!this.loading && this.projectsList < this.projects"
          class="next-action"
        >
          <button @click="loadMore()">Load more</button>
        </div>
        <div v-else class="next-action">
          <a :href="githubLink" target="_blank">Visit my GitHub</a>
        </div>

        <div v-if="!this.loading" id="skillSection">
          <h2>Development Skills</h2>
          <ul class="skills">
            <li v-for="skill in skills">{{ skill }}</li>
          </ul>
        </div>
      </section>
    </main>
  </div>
`};

const routes = [
  { path: '/', component: HomeView },
  { path: '/projects', component: ProjectsView },
];

const router = new VueRouter({
  routes,
});

let app = new Vue({
  router
}).$mount('#app');
