import SignUp from "../pages/registro/signUp.component";
import signIn from "../pages/login/signIn.component";
import FAQ from "../pages/faq/FAQ.component";
import HomePage from "../pages/homePage/homePage.component";
import SubDetail from "../pages/subDetails/subDetail.component";
import createSubscription from "../pages/createSubscription/createSubscription.component";
import SubList from "../pages/subscriptions/SubList.components";
import Recuperacion from "../pages/login/changePW_form";
import RecuperacionLogeado from "../pages/login/changePW_logeado";
import selectPlantilla from "../pages/selectPlantilla/selectPlantilla.component";
import Perfil from "../pages/modPerfil/modPerfil.component";
import SubCanceladas from "../pages/subscriptions/subcanceladas.component";
import SubDetailCancelada from "../pages/subDetails/subDetailCancelada.component";
import ErrorPage from "../pages/error_page/error.component";
import AuthErrorPage from "../pages/error_page/authError.component";
import Estadistica from "../pages/estadisticas/estadistica.component";
//import PageNotFound from "../pages/notFound" (Hacer redireccion o generar pageNotFound)

const routes =[
    {
      forUnlogged: false,
      isPrivate: false,
      path:'/estadistica',
      component: Estadistica
    },
    {
      forUnlogged: true,
      isPrivate: false,
      path:'/signIn',
      component: signIn
    },
    {
      forUnlogged: true,
      isPrivate: false,
      path:'/signUp',
      component: SignUp
    },
    {
      forUnlogged: false,
      isPrivate: false,
      path:'/faq',
      component: FAQ
    },
    {
      forUnlogged: false,
      isPrivate: false,
      path:'/selectPlantilla',
      component: selectPlantilla
    },
    {
      forUnlogged: false,
      isPrivate: false,
      path:'/createSub/:id',
      component: createSubscription
    },
    {
      forUnlogged:false,
      isPrivate:false,
      path:'/change-pass',
      component:Recuperacion
    },
    {
      forUnlogged:false,
      isPrivate:true,
      path:'/change-password',
      component:RecuperacionLogeado
    },
    {
        forUnlogged: false,
        isPrivate: false,
        path:'/createSub',
        component: createSubscription
    },
    {
      forUnlogged: false,
      isPrivate: true,
      path:'/subDetail/:id',
      component: SubDetail
    },
    {
      forUnlogged: false,
      isPrivate: true,
      path:'/subDetailCancelada/:id',
      component: SubDetailCancelada
    },
    {
      forUnlogged: false,
      isPrivate: true,
      path:'/perfil',
      component: Perfil
    },
    {
      forUnlogged: false,
      isPrivate: true,
      path:'/home',
      component: SubList
    },
    {
      forUnlogged: false,
      isPrivate: true,
      path:'/canceladas',
      component: SubCanceladas
    },
    {
      forUnlogged: true,
      isPrivate: false,
      path:'/error',
      component: ErrorPage
    },
    {
      forUnlogged: true,
      isPrivate: false,
      path:'/auth-error',
      component: AuthErrorPage
    },
    
    {
      forUnlogged: true,
      isPrivate: false,
      path:'/',
      component: HomePage
    },
    
  ]
   
  export default routes
