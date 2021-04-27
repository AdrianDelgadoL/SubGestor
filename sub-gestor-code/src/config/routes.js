import SignUp from "../pages/registro/signUp.component";
import signIn from "../pages/login/signIn.component";
import FAQ from "../pages/faq/FAQ.component";
import HomePage from "../pages/homePage/homePage.component";
import SubDetail from "../pages/subDetails/subDetail.component";
import createSubscription from "../pages/createSubscription/createSubscription.component";
import SubList from "../pages/subscriptions/SubList.components";
//import PageNotFound from "../pages/notFound" (Hacer redireccion o generar pageNotFound)

const routes =[
    
    {
      isPrivate: false,
      path:'/signIn',
      component: signIn
    },
    {
      isPrivate: false,
      path:'/signUp',
      component: SignUp
    },
    {
      isPrivate: false,
      path:'/faq',
      component: FAQ
    },
    {
      isPrivate: false,
      path:'/createSub',
      component: createSubscription
    },
    {
      isPrivate: false,
      path:'/subDetail/:id',
      component: SubDetail
    },
    // Esta deberia borrarse debido a que solo se puede entrar con el id ha esta ruta con el id.
    {
      isPrivate: false,
      path:'/subDetail',
      component: SubDetail
    },
    
    /*{
      path:'/*',
      component: PageNotFound
    },*/
    {
      isPrivate: true,
      path:'/home',
      component: SubList
    },
    {
      isPrivate: false,
      path:'/',
      component: HomePage
    },
    
  ]
   
  export default routes
