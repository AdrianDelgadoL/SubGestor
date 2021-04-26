import SignUp from "../pages/registro/signUp.component";
import signIn from "../pages/login/signIn.component";
import FAQ from "../pages/faq/FAQ.component";
import HomePage from "../pages/homePage/homePage.component";
import SubDetail from "../pages/subDetails/subDetail.component";
import createSubscription from "../pages/createSubscription/createSubscription.component";
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
      path:'/subDetail',
      component: SubDetail
    },
    /*{
      path:'/*',
      component: PageNotFound
    },*/
    {
      isPrivate: false,
      path:'/',
      component: HomePage
    },
  ]
   
  export default routes
