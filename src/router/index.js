import { createRouter, createWebHistory } from 'vue-router';
import GenerarTicket from '../GenerarTicket/Pages/GenerarTicket.component.vue';
import ViewTicket from '../GenerarTicket/Pages/ViewTicket.component.vue';



const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: GenerarTicket,  meta: { title: "Generar"} },
        { path: '/view-ticket', component: ViewTicket,  meta: { title: "Ver Ticket"} },

    ]
});

router.beforeEach((to, from, next) => {
    let baseTitle = 'MPJ';
    document.title = `${ baseTitle } | ${ to.meta["title"]}`;
    next();

    authenticationGuard(to, from, next);
});

export default router;