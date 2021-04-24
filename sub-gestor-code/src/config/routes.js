import SignUp from "../pages/registro/signUp.component";
import signIn from "../pages/login/signIn.component";
import FAQ from "../pages/faq/FAQ.component";
//import PageNotFound from "../pages/notFound" (Hacer redireccion o generar pageNotFound)

const routes =[
    
    {
      isPrivate: false,
      path:'/signIn',
      component: signIn
    },
    
    {
      isPrivate: false,
      path:'/faq',
      component: FAQ
    },
    /*{
      path:'/*',
      component: PageNotFound
    },*/
    {
      isPrivate: false,
      path:'/',
      component: SignUp
    },
  ]
   
  export default routes
